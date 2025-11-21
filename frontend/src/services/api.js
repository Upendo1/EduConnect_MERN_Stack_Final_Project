import axios from "axios";

// Vite uses import.meta.env, not process.env
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://educonnect-mern-stack-final-project.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Refresh logic
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err?.config;

    // If no config exists → do not retry
    if (!originalRequest) return Promise.reject(err);

    // Handle 401
    if (err.response && err.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue failed requests
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((e) => Promise.reject(e));
      }

      // Start refresh operation
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshURL = `${BASE_URL}/api/auth/refresh`;

        const response = await axios.post(
          refreshURL,
          {},
          { withCredentials: true }
        );

        const newToken = response.data.token;

        // Update global header
        api.defaults.headers.common["Authorization"] = "Bearer " + newToken;

        // Notify app (AuthContext)
        window.dispatchEvent(
          new CustomEvent("api-refreshed", { detail: { token: newToken } })
        );

        // Retry queued requests
        processQueue(null, newToken);
        isRefreshing = false;

        // Retry the original request
        originalRequest.headers["Authorization"] = "Bearer " + newToken;
        return api(originalRequest);
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        isRefreshing = false;

        // Notify app user must re-login
        window.dispatchEvent(new CustomEvent("api-unauthorized"));

        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
