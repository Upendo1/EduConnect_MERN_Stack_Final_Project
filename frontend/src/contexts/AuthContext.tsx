import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: "student" | "teacher" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
const API_BASE = import.meta.env.VITE_API_BASE_URL
  // const API_BASE = "https://educonnect-mern-stack-final-project.onrender.com/api";

  // 📌 Fetch logged-in user from backend
  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) return;

      const data = await res.json();

      if (data.user && data.user.role) {
        setUser(data.user);
      }
    } catch (err) {
      console.error("Fetch user error:", err);
    }
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  // 🔥 Stable session restore on app load
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) {
          const data = await res.json();
          if (data.user?.role) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        } else {
          // invalid token → clear and force logout
          localStorage.removeItem("token");
          setUser(null);
        }
      } catch (err) {
        console.error("Auto login failed:", err);
        setUser(null);
      }

      setLoading(false);
    };

    init();
  }, []);

  const signOut = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
