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

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  /**
   * 🌐 Fetch logged-in user
   * Ensures loading is handled correctly
   */
  const fetchUser = async () => {
    setLoading(true); // important fix

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        localStorage.removeItem("token");
        setUser(null);
        setLoading(false);
        return;
      }

      const data = await res.json();

      if (data.user && data.user.role) {
        setUser(data.user);
      } else {
        setUser(null); // invalid shape
      }
    } catch (err) {
      console.error("Fetch user error:", err);
      setUser(null);
    }

    setLoading(false);
  };

  const refreshUser = async () => {
    await fetchUser();
  };

  /**
   * 🔥 Restore user session once on page load
   */
  useEffect(() => {
    fetchUser(); // use the repaired unified method
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
