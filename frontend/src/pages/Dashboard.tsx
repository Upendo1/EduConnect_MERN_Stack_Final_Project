import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  /**
   * Redirect unauthenticated users
   */
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth", { replace: true });
    }
  }, [user, loading, navigate]);

  /**
   * Global spinner for auth loading
   */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  /**
   * Render dashboards for authenticated users
   */
  if (user && user.role) {
    const role = user.role.toLowerCase();

    if (role === "student") return <StudentDashboard />;
    if (role === "teacher") return <TeacherDashboard />;
    if (role === "admin") return <AdminDashboard />;

    // Unknown role
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

        <p className="text-lg font-medium text-muted-foreground">
          Unknown role detected. You can return to the homepage.
        </p>
      </div>
    );
  }

  /**
   * Safety fallback — should rarely trigger
   */
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

      <p className="text-lg font-medium text-muted-foreground">
        Taking longer than expected… please try reloading.
      </p>
    </div>
  );
};

export default Dashboard;
