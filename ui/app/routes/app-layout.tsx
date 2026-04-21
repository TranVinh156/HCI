import { Navigate, Outlet, useLocation } from "react-router";
import { Sidebar, type SidebarTab } from "../components/Sidebar";
import { SidebarLayoutProvider } from "../components/layout/sidebar-layout-context";
import { AppBreadcrumbs } from "../components/layout/AppBreadcrumbs";
import { useAuth } from "../auth";
import { useState } from "react";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { LoadingBlock } from "~/components/layout/LoadingBlock";

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
      <LoadingBlock />
    );
  }

  if (!isAuthenticated) {
    const redirectTo = `${location.pathname}${location.search}${location.hash}`;
    return <Navigate to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} replace />;
  }

  return (
    <SidebarProvider open={isSidebarOpen} onOpenChange={setIsSidebarOpen} className="min-h-screen bg-background">
      <SidebarLayoutProvider
        value={{
          isSidebarOpen,
          openSidebar: () => setIsSidebarOpen(true),
          closeSidebar: () => setIsSidebarOpen(false),
        }}
      >
        <Sidebar
          activeTab={
            location.pathname === "/session-analytics"
              ? user?.role === "faculty" || user?.role === "student_affair_officer"
                ? "analytics"
                : "home"
              : getActiveTab(location.pathname)
          }
        />
        <SidebarInset className="min-w-0">
          <div className="sticky top-0 z-30 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75">
            <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
              <SidebarTrigger className="shrink-0 border border-border bg-background shadow-sm" aria-label="Toggle sidebar" />
              <AppBreadcrumbs pathname={location.pathname} search={location.search} />
            </div>
          </div>
          <Outlet />
        </SidebarInset>
      </SidebarLayoutProvider>
    </SidebarProvider>
  );
}
