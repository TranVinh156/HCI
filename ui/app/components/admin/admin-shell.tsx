import {
  BarChart3,
  BookOpen,
  ClipboardCheck,
  GraduationCap,
  LayoutDashboard,
  LogIn,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { isLoggedIn, logoutMock } from "~/lib/auth";
import { cn } from "~/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

const navItems = [
  { label: "Overview", to: "/admin", icon: LayoutDashboard, end: true },
  { label: "Students", to: "/admin/students", icon: Users },
  { label: "Topics", to: "/admin/topics", icon: BookOpen },
  { label: "Lessons", to: "/admin/lessons", icon: GraduationCap },
  { label: "Quizzes", to: "/admin/quizzes", icon: ClipboardCheck },
  { label: "Reports", to: "/admin/reports", icon: BarChart3 },
  { label: "Mascot", to: "/admin/mascot", icon: Sparkles },
];

export function AdminShell({
  children,
  title = "Learning dashboard",
  subtitle = "Content admin",
}: AdminShellProps) {
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  function handleLogout() {
    logoutMock();
    setLoggedIn(false);
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sky-100 bg-[#064f83] p-5 text-white lg:block">
        <Link to="/admin" className="text-xl font-black">
          SignOcean
        </Link>
        <nav className="mt-8 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold transition",
                    isActive ? "bg-white/15 text-white" : "text-sky-100 hover:bg-white/10"
                  )
                }
              >
                <Icon className="size-4" />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-sky-100 bg-white/90 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm font-bold text-cyan-700">{subtitle}</p>
              <h1 className="text-2xl font-black">{title}</h1>
            </div>
            {loggedIn ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="h-10 rounded-xl border-sky-200 px-3 text-sm font-bold text-sky-700"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            ) : (
              <Link
                to="/login"
                className="rounded-xl border border-sky-200 px-3 py-2 text-sm font-bold text-sky-700"
              >
                <span className="inline-flex items-center gap-1.5">
                  <LogIn className="size-4" />
                  Login
                </span>
              </Link>
            )}
          </div>
        </header>
        <nav className="flex gap-2 overflow-x-auto border-b border-sky-100 bg-white px-5 py-3 lg:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "shrink-0 rounded-xl px-3 py-2 text-sm font-bold",
                  isActive
                    ? "bg-sky-600 text-white"
                    : "bg-sky-50 text-sky-700"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}
