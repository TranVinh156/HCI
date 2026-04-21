import { Link } from "react-router";
import { type AccountRole, useAuth } from "../auth";

export type SidebarTab = "home" | "analytics" | "students" | "ai" | "school";

type SidebarRouteItem = {
  tab: SidebarTab;
  to: string;
  icon: string;
  label: string;
};

function getStudentRoutes(): SidebarRouteItem[] {
  return [
    {
      tab: "home",
      to: "/",
      icon: "dashboard",
      label: "Class Management",
    },
    {
      tab: "students",
      to: "/student-profiles",
      icon: "group",
      label: "Student Profiles",
    },
  ];
}

function getTeacherRoutes(): SidebarRouteItem[] {
  return [
    {
      tab: "home",
      to: "/",
      icon: "dashboard",
      label: "Classes Management",
    },
    {
      tab: "ai",
      to: "/ai-configuration",
      icon: "settings_suggest",
      label: "AI Configuration",
    },
  ];
}

function getFacultyRoutes(): SidebarRouteItem[] {
  return [
    {
      tab: "home",
      to: "/",
      icon: "dashboard",
      label: "Classes of Faculty Management",
    },
    {
      tab: "school",
      to: "/school-overview",
      icon: "account_balance",
      label: "Faculty Overview",
    }
  ];
}

function getStudentAffairOfficerRoutes(): SidebarRouteItem[] {
  return [
    {
      tab: "home",
      to: "/",
      icon: "dashboard",
      label: "Classes Management",
    },
    {
      tab: "school",
      to: "/school-overview",
      icon: "account_balance",
      label: "School Overview",
    }
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

export function Sidebar({ 
  isOpen, 
  onClose, 
  activeTab
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  activeTab: SidebarTab;
}) {
  const { user, logout } = useAuth();
  const navItems = user ? getRoutesByRole(user.role) : [];
  const avatarInitial = user ? user.username.slice(0, 1).toUpperCase() : "";

  return (
    <aside
      className={`sticky top-0 self-start shrink-0 h-screen left-0 flex flex-col gap-2 font-medium text-sm transition-all duration-300 ease-in-out z-30 overflow-hidden ${
        isOpen ? "w-72 p-4 bg-white border-r-2 border-slate-200 shadow-[4px_0_24px_rgba(15,23,42,0.08)]" : "w-0 p-0 border-r-0"
      }`}
    >
      <div className="px-4 pt-4 pb-3">
        <div className="flex justify-end mb-2">
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            aria-label="Hide sidebar"
          >
            <span className="material-symbols-outlined">left_panel_close</span>
          </button>
        </div>
        <div className="flex flex-col items-center text-center">
          <img
            src="/vnu-uet.jpg"
            alt="VNU UET logo"
            className="w-24 h-24 object-cover"
          />
          <h1 className="mt-3 font-headline font-extrabold text-sky-900 text-2xl tracking-tight">UETCam</h1>
        </div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">
        {navItems.map((item) => (
          <Link
            key={`${user?.role ?? "guest"}-${item.tab}`}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ease-in-out ${
              activeTab === item.tab
                ? "bg-sky-100 text-sky-900 font-semibold"
                : "text-slate-600 hover:text-sky-800 hover:bg-slate-200"
            }`}
            to={item.to}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>
      {user && (
        <div className="mt-auto px-4 py-3 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 text-sm font-bold flex items-center justify-center shrink-0">
              {avatarInitial}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-900 truncate">{user.username}</p>
              <p className="text-xs text-slate-500 truncate">{user.label}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 shrink-0"
            aria-label="Dang xuat"
            title="Dang xuat"
          >
            <span className="material-symbols-outlined text-sm">logout</span>
          </button>
        </div>
      )}
    </aside>
  );
}
