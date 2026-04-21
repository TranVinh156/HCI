import { Link } from "react-router";
import { type AccountRole, useAuth } from "../auth";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Button } from "./ui/button";
import {
  Sidebar as AppSidebarShell,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from "./ui/sidebar";
import { cn } from "../lib/utils";

export type SidebarTab = "home" | "analytics" | "students" | "ai" | "school";

type SidebarRouteItem = {
  tab: SidebarTab;
  to: string;
  icon: string;
  label: string;
};

function getStudentRoutes(): SidebarRouteItem[] {
  return [
    { tab: "home", to: "/", icon: "dashboard", label: "Class Management" },
    { tab: "students", to: "/student-profiles", icon: "group", label: "Student Profiles" },
  ];
}

function getTeacherRoutes(): SidebarRouteItem[] {
  return [
    { tab: "home", to: "/", icon: "dashboard", label: "Classes Management" },
    { tab: "ai", to: "/ai-configuration", icon: "settings_suggest", label: "AI Configuration" },
  ];
}

function getFacultyRoutes(): SidebarRouteItem[] {
  return [
    { tab: "home", to: "/", icon: "dashboard", label: "Classes of Faculty Management" },
    { tab: "school", to: "/school-overview", icon: "account_balance", label: "Faculty Overview" },
  ];
}

function getStudentAffairOfficerRoutes(): SidebarRouteItem[] {
  return [
    { tab: "home", to: "/", icon: "dashboard", label: "Classes Management" },
    { tab: "school", to: "/school-overview", icon: "account_balance", label: "School Overview" },
  ];
}

function getRoutesByRole(role: AccountRole): SidebarRouteItem[] {
  switch (role) {
    case "student":
      return getStudentRoutes();
    case "teacher":
      return getTeacherRoutes();
    case "faculty":
      return getFacultyRoutes();
    case "student_affair_officer":
      return getStudentAffairOfficerRoutes();
    default:
      return [];
  }
}

export function Sidebar({ activeTab }: { activeTab: SidebarTab }) {
  const { user, logout } = useAuth();
  const { setOpen, isMobile, setOpenMobile } = useSidebar();
  const navItems = user ? getRoutesByRole(user.role) : [];
  const avatarInitial = user ? user.username.slice(0, 1).toUpperCase() : "";

  function closeSidebar() {
    if (isMobile) {
      setOpenMobile(false);
      return;
    }

    setOpen(false);
  }

  return (
    <AppSidebarShell
      collapsible="offcanvas"
      className="border-r-0"
    >
      <SidebarHeader className="gap-4 px-4 pt-4 pb-3">
        <div className="flex justify-end">
          <Button onClick={closeSidebar} variant="ghost" size="icon-sm" aria-label="Hide sidebar">
            <span className="material-symbols-outlined">left_panel_close</span>
          </Button>
        </div>
        <div className="flex flex-col items-center gap-3 px-2 text-center">
          <img
            src="/vnu-uet.jpg"
            alt="VNU UET logo"
            className="size-24 object-cover"
          />
          <h1 className="font-headline text-2xl font-extrabold tracking-tight text-sidebar-foreground">UETCam</h1>
        </div>
      </SidebarHeader>

      <SidebarSeparator className="mx-4" />

      <SidebarContent className="px-3 py-3">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={`${user?.role ?? "guest"}-${item.tab}`}>
              <SidebarMenuButton
                asChild
                isActive={activeTab === item.tab}
                tooltip={item.label}
                className={cn(
                  "h-11 rounded-lg px-3 text-sm",
                  activeTab === item.tab
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                )}
              >
                <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {user && (
        <SidebarFooter className="px-4 py-3">
          <SidebarSeparator className="mx-0 mb-3" />
          <div className="flex items-center gap-3">
            <Avatar className="size-9 border border-sidebar-border">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.username}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user.label}</p>
            </div>
            <Button
              type="button"
              onClick={logout}
              variant="ghost"
              size="icon-sm"
              aria-label="Dang xuat"
              title="Dang xuat"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
            </Button>
          </div>
        </SidebarFooter>
      )}

      <SidebarRail />
    </AppSidebarShell>
  );
}
