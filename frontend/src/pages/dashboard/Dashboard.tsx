import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { HabitTracker } from "@/components/habits/HabitTracker";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useUserPreferences } from "@/hooks/useUserPreferences";
import { useTranslation } from "react-i18next";

export function Dashboard() {
  const { session, loading } = useAuth();
  const { isFetching } = useUserPreferences();
  const { t } = useTranslation();

  if (loading || isFetching) {
    return (
      <div className="min-h-screen bg-background relative">
        <LoadingScreen message={t("loading.please_wait")} />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return <HabitTracker />;
}
