import { BookOpen, Home, Shield, User } from "lucide-react";
import { Link, NavLink } from "react-router";

import { cn } from "~/lib/utils";

type StudentShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { to: "/learn", label: "Home", icon: Home },
  { to: "/topics", label: "Learn", icon: BookOpen },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/admin", label: "Admin", icon: Shield },
];

export function StudentShell({ children }: StudentShellProps) {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#dff8ff,transparent_34%),linear-gradient(180deg,#eefcff_0%,#f8feff_46%,#ffffff_100%)] text-slate-900">
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
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
