import { Navigate, Outlet } from "react-router";
import { useAuth } from "../auth";

export default function AuthLayout() {
  const { isAuthenticated, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <img src="/vnu-uet.jpg" alt="VNU UET logo" className="w-24 h-24 rounded-2xl object-cover" />
      </main>
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
