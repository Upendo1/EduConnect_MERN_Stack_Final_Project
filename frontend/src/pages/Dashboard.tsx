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

  // If user exists, render role-specific dashboard
  if (user) {
    switch (user.role.toLowerCase()) {
      case "student":
        return <StudentDashboard />;
      case "teacher":
        return <TeacherDashboard />;
      case "admin":
        return <AdminDashboard />;
      default:
        // Unknown role fallback
        return (
          <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

            <p className="text-lg font-medium text-muted-foreground">
              Unknown role detected… you can return to the homepage.
            </p>

            <Button
              onClick={() => navigate("/")} // SPA navigation
              className="mt-2"
            >
              Go to Homepage
            </Button>
          </div>
        );
    }
  }

  // If somehow user is null after loading, show homepage button
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-primary"></div>

      <p className="text-lg font-medium text-muted-foreground">
        Still loading… you can return to the homepage.
      </p>

      <Button
        onClick={() => navigate("/")}
        className="mt-2"
      >
        Go to Dashboard
      </Button>
    </div>
  );
};

export default Dashboard;