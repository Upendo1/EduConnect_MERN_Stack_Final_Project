import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // <--- dynamic base URL
  withCredentials: false
});

// AUTH
export const register = (payload) =>
  api.post('/auth/register', payload).then((r) => r.data);

export const login = (payload) =>
  api.post('/auth/login', payload).then((r) => r.data);

export const me = (token) =>
  api
    .get('/auth/me', {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((r) => r.data);

// POSTS
export const listPosts = () =>
  api.get('/posts').then((r) => r.data);

export const createPost = (payload, token) =>
  api
    .post('/posts', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((r) => r.data);

// FILE UPLOAD
export const uploadFiles = (formData, token) =>
  api
    .post('/upload', formData, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
        'Content-Type': 'multipart/form-data',
      },
    })
    .then((r) => r.data);

export default api;
