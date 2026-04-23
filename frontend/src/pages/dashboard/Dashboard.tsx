import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { HabitTracker } from "@/components/habits/HabitTracker";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function Dashboard() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-background relative">
        <LoadingScreen message="Please wait" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <HabitTracker />;
}
