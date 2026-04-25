import {
  BookOpen,
  Dumbbell,
  Home,
  LogIn,
  LogOut,
  MessageCircle,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { isLoggedIn, logoutMock } from "~/lib/auth";
import { cn } from "~/lib/utils";

type StudentShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/learn", label: "Home", icon: Home },
  { to: "/topics", label: "Learn", icon: BookOpen },
  { to: "/communication", label: "Talk", icon: MessageCircle },
  { to: "/practice", label: "Practice", icon: Dumbbell },
  { to: "/mascot", label: "Sami", icon: Sparkles },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function StudentShell({ children }: StudentShellProps) {
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
    <div className="min-h-screen bg-cyan-50 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-cyan-100 bg-white/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/learn" className="flex items-center gap-2">
            <div className="grid size-10 place-items-center rounded-2xl bg-sky-600 text-lg font-black text-white">
              SO
            </div>
            <span className="text-lg font-black text-slate-900">
              SignOcean
            </span>
          </Link>
          <nav className="flex items-center gap-1 rounded-2xl bg-cyan-50 p-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-black text-cyan-800 transition",
                      isActive && "bg-white shadow-sm"
                    )
                  }
                >
                  <Icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </NavLink>
              );
            })}
            {loggedIn ? (
              <Button
                type="button"
                variant="ghost"
                onClick={handleLogout}
                className="flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-black text-cyan-800"
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  cn(
                    "flex h-10 items-center gap-1 rounded-xl px-3 text-sm font-black text-cyan-800 transition",
                    isActive && "bg-white shadow-sm"
                  )
                }
              >
                <LogIn className="size-4" />
                <span className="hidden sm:inline">Login</span>
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
