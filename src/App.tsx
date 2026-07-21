import { useEffect } from "react";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/Layout";
import AuthPage from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import WorkforcePlanner from "@/pages/WorkforcePlanner";
import TaskOrchestration from "@/pages/TaskOrchestration";
import PerformanceIntelligence from "@/pages/PerformanceIntelligence";
import OperationalForecasting from "@/pages/OperationalForecasting";
import ExecutiveDashboard from "@/pages/ExecutiveDashboard";
import Settings from "@/pages/Settings";

function Protected({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" state={{ from: location }} replace />;
  return <>{children}</>;
}

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading && user && location.pathname === "/auth") {
      navigate("/", { replace: true });
    }
  }, [user, loading, location.pathname, navigate]);

  return (
    <>
      <Toaster
        theme="dark"
        position="top-right"
        toastOptions={{
          style: {
            background: "#0d1806",
            border: "1px solid rgba(154,237,102,0.2)",
            color: "#fff",
          },
        }}
      />
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          element={
            <Protected>
              <Layout />
            </Protected>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="workforce-planner" element={<WorkforcePlanner />} />
          <Route path="task-orchestration" element={<TaskOrchestration />} />
          <Route path="performance" element={<PerformanceIntelligence />} />
          <Route path="forecasting" element={<OperationalForecasting />} />
          <Route path="executive" element={<ExecutiveDashboard />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
