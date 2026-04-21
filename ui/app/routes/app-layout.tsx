import { Navigate, Outlet, useLocation } from "react-router";
import { Sidebar, type SidebarTab } from "../components/Sidebar";
import { SidebarLayoutProvider } from "../components/layout/sidebar-layout-context";
import { useAuth } from "../auth";
import { useState } from "react";

function getActiveTab(pathname: string): SidebarTab {
  if (pathname === "/student-profiles") return "students";
  if (pathname === "/ai-configuration") return "ai";
  if (pathname === "/school-overview") return "school";
  return "home";
}

export default function AppLayout() {
  const { isAuthenticated, isHydrated, user } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  if (!isHydrated) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <img src="/vnu-uet.jpg" alt="VNU UET logo" className="w-24 h-24 rounded-2xl object-cover" />
      </main>
    );
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return (
    <SidebarLayoutProvider
      value={{
        isSidebarOpen,
        openSidebar: () => setIsSidebarOpen(true),
        closeSidebar: () => setIsSidebarOpen(false),
      }}
    >
      <main className="bg-background text-on-surface font-body flex overflow-hidden min-h-screen">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTab={
            location.pathname === "/session-analytics"
              ? user?.role === "faculty" || user?.role === "student_affair_officer"
                ? "analytics"
                : "home"
              : getActiveTab(location.pathname)
          }
        />
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </main>
    </SidebarLayoutProvider>
  );
}
