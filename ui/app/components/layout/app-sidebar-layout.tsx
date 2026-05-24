import { LogIn, LogOut, type LucideIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { getCurrentUser, isLoggedIn, logout } from "~/lib/auth";
import type { User, UserRole } from "~/lib/api-client";
import { cn } from "~/lib/utils";

export type AppSidebarNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
  adminOnly?: boolean;
};

type AppSidebarLayoutProps = {
  children: ReactNode;
  navItems: AppSidebarNavItem[];
  navLabel: string;
  homeTo: string;
  brand?: string;
  contentClassName?: string;
  mobileNavBorder?: boolean;
  requireAuth?: boolean;
  requiredRole?: UserRole;
};

export function AppSidebarLayout({
  children,
  navItems,
  navLabel,
  homeTo,
  brand = "GangnamSign",
  contentClassName,
  mobileNavBorder,
  requireAuth,
  requiredRole,
}: AppSidebarLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(Boolean(requireAuth));

  useEffect(() => {
    let ignore = false;

    async function checkAuth() {
      const hasToken = isLoggedIn();
      setLoggedIn(hasToken);

      if (!hasToken) {
        setUser(null);
        setIsCheckingAuth(false);
        if (requireAuth) {
          const next = encodeURIComponent(`${location.pathname}${location.search}`);
          navigate(`/login?redirectTo=${next}`, { replace: true });
        }
        return;
      }

      setIsCheckingAuth(true);
      const currentUser = await getCurrentUser();
      if (ignore) return;

      if (!currentUser) {
        setUser(null);
        setLoggedIn(false);
        setIsCheckingAuth(false);
        if (requireAuth) {
          const next = encodeURIComponent(`${location.pathname}${location.search}`);
          navigate(`/login?redirectTo=${next}`, { replace: true });
        }
        return;
      }

      if (requiredRole && currentUser.role !== requiredRole) {
        setUser(currentUser);
        setLoggedIn(true);
        navigate("/learn", { replace: true });
        return;
      }

      setUser(currentUser);
      setLoggedIn(true);
      setIsCheckingAuth(false);
    }

    void checkAuth();

    return () => {
      ignore = true;
    };
  }, [location.pathname, location.search, navigate, requireAuth, requiredRole]);

  function handleLogout() {
    logout();
    setLoggedIn(false);
    setUser(null);
    navigate("/login");
  }

  const visibleNavItems = navItems.filter((item) => !item.adminOnly || user?.role === "admin");

  if (isCheckingAuth) {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center text-slate-900">
        <div>
          <div className="mx-auto mb-4 size-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          <p className="text-sm font-black uppercase tracking-normal text-slate-500">
            Checking account
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white px-5 py-8 lg:flex lg:flex-col">
        <Link
          to={homeTo}
          className="mb-9 px-4 text-3xl font-black tracking-normal text-primary"
        >
          {brand}
        </Link>
        <SidebarNav items={visibleNavItems} label={navLabel} />
        <SidebarAuthAction loggedIn={loggedIn} onLogout={handleLogout} />
      </aside>

      <main className="lg:pl-72">
        <MobileSidebarHeader
          brand={brand}
          homeTo={homeTo}
          loggedIn={loggedIn}
          onLogout={handleLogout}
        />
        <MobileSidebarNav
          items={visibleNavItems}
          label={navLabel}
          bordered={mobileNavBorder}
        />
        <div className={cn(contentClassName, "max-lg:pb-24")}>{children}</div>
      </main>
    </div>
  );
}

function SidebarNav({
  items,
  label,
}: {
  items: AppSidebarNavItem[];
  label: string;
}) {
  return (
    <nav className="flex flex-1 flex-col gap-3" aria-label={label}>
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex h-[3.75rem] w-full items-center gap-5 rounded-2xl border-2 border-transparent px-5 text-left text-base font-black uppercase tracking-normal text-slate-500 transition hover:bg-primary/10 hover:text-primary",
                isActive && "border-primary/40 bg-primary/10 text-primary"
              )
            }
          >
            <span className="grid size-9 place-items-center">
              <Icon className="size-6 stroke-[3]" />
            </span>
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}

function SidebarAuthAction({
  loggedIn,
  onLogout,
}: {
  loggedIn: boolean;
  onLogout: () => void;
}) {
  return (
    <div className="border-t border-slate-100 pt-4">
      {loggedIn ? (
        <Button
          type="button"
          variant="ghost"
          onClick={onLogout}
          className="h-[3.25rem] w-full justify-start gap-5 rounded-2xl px-5 text-base font-black uppercase text-slate-500 hover:text-primary"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-rose-100 text-rose-500">
            <LogOut className="size-6 stroke-[3]" />
          </span>
          Logout
        </Button>
      ) : (
        <NavLink
          to="/login"
          className={({ isActive }) =>
            cn(
              "flex h-[3.25rem] items-center gap-5 rounded-2xl border-2 border-transparent px-5 text-base font-black uppercase text-slate-500 transition hover:bg-primary/10 hover:text-primary",
              isActive && "border-primary/40 bg-primary/10 text-primary"
            )
          }
        >
          <span className="grid size-9 place-items-center rounded-xl bg-emerald-100 text-emerald-500">
            <LogIn className="size-6 stroke-[3]" />
          </span>
          Login
        </NavLink>
      )}
    </div>
  );
}

function MobileSidebarHeader({
  brand,
  homeTo,
  loggedIn,
  onLogout,
}: {
  brand: string;
  homeTo: string;
  loggedIn: boolean;
  onLogout: () => void;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Link to={homeTo} className="text-2xl font-black text-lime-500">
          {brand}
        </Link>
        {loggedIn ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onLogout}
            className="size-10 rounded-xl p-0 text-slate-500"
            aria-label="Logout"
          >
            <LogOut className="size-5" />
          </Button>
        ) : (
          <Button
            asChild
            variant="ghost"
            className="size-10 rounded-xl p-0 text-slate-500"
            aria-label="Login"
          >
            <Link to="/login">
              <LogIn className="size-5" />
            </Link>
          </Button>
        )}
      </div>
    </header>
  );
}

function MobileSidebarNav({
  items,
  label,
  bordered,
}: {
  items: AppSidebarNavItem[];
  label: string;
  bordered?: boolean;
}) {
  return (
    <nav
      className={cn(
        "fixed inset-x-0 bottom-0 z-30 flex gap-2 overflow-x-auto border-t border-slate-200 bg-white px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_rgba(15,23,42,0.08)] lg:hidden",
        bordered && "border-t border-slate-200"
      )}
      aria-label={label}
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex h-16 min-w-16 shrink-0 flex-col items-center justify-center gap-1 rounded-xl border-2 border-transparent px-2 text-xs font-black uppercase text-slate-500",
                isActive && "border-primary/40 bg-primary/10 text-primary"
              )
            }
          >
            <Icon className="size-5 stroke-[3]" />
            <span className="leading-none">{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
