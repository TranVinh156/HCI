import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth";
import { LoadingBlock } from "~/components/layout/LoadingBlock";

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <LoadingBlock />
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="min-h-screen bg-background text-on-surface font-body flex items-center justify-center px-6 py-10">
      <Outlet />
    </main>
  );
}
