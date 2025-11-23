import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

import StudentDashboard from "@/components/dashboard/StudentDashboard";
import TeacherDashboard from "@/components/dashboard/TeacherDashboard";
import AdminDashboard from "@/components/dashboard/AdminDashboard";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Global loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // User exists → load correct dashboard
  if (user) {
    const role = user.role?.toLowerCase();
    // console.log("--"+user.role?.toLowerCase()+"--")
    switch (role) {
      case "student":
        return <StudentDashboard />;

      case "teacher":
        return <TeacherDashboard />;

      case "admin":
        return <AdminDashboard />;


      default:
        return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
          {/* Spinner Loader */}
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

        <p className="text-lg font-medium text-muted-foreground">
  Still loading… this may take a moment. You can refresh the page if it takes too long.
</p>
        </div>
      );
    }
  }

  return null;
};

export default Dashboard;
