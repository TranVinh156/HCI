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
      collapsible="icon"
      className="border-r-0"
    >
      <SidebarHeader className="gap-4 px-3 pt-4 pb-3">
        <div className="flex items-start justify-between gap-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex min-w-0 items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar-accent/30 shadow-sm group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:rounded-xl">
              <img
                src="/vnu-uet.jpg"
                alt="VNU UET logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <h1 className="truncate font-headline text-xl font-extrabold tracking-tight text-sidebar-foreground">
                UETCam
              </h1>
            </div>
          </div>
        </div>
      </SidebarHeader>


      <SidebarContent className="px-2 py-3">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => (
            <SidebarMenuItem key={`${user?.role ?? "guest"}-${item.tab}`}>
              <SidebarMenuButton
                asChild
                isActive={activeTab === item.tab}
                tooltip={item.label}
                className={cn(
                  "h-11 rounded-lg  text-sm group-data-[collapsible=icon]:h-9 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:px-0",
                  activeTab === item.tab
                    ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground",
                )}
              >
                <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {user && (
        <SidebarFooter className="px-3 py-3">
          <SidebarSeparator className="mx-0 mb-3 group-data-[collapsible=icon]:hidden" />
          <div className="flex items-center gap-3 rounded-xl border border-sidebar-border/70 bg-sidebar-accent/20 px-3 py-2 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:rounded-full group-data-[collapsible=icon]:border-0 group-data-[collapsible=icon]:bg-transparent group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:py-0">
            <Avatar className="size-9 border border-sidebar-border group-data-[collapsible=icon]:hidden">
              <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground">
                {avatarInitial}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-sm font-semibold text-sidebar-foreground">{user.username}</p>
              <p className="truncate text-xs text-sidebar-foreground/70">{user.label}</p>
            </div>
            <Button
              type="button"
              onClick={logout}
              variant="ghost"
              size="icon-sm"
              aria-label="Logout"
              title="Logout"
              className="shrink-0"
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
