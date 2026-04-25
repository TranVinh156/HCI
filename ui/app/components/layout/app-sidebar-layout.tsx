import { LogIn, LogOut, type LucideIcon } from "lucide-react";
import { type ReactNode, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router";

import { Button } from "~/components/ui/button";
import { isLoggedIn, logoutMock } from "~/lib/auth";
import { cn } from "~/lib/utils";

export type AppSidebarNavItem = {
  label: string;
  to: string;
  icon: LucideIcon;
  end?: boolean;
};

type AppSidebarLayoutProps = {
  children: ReactNode;
  navItems: AppSidebarNavItem[];
  navLabel: string;
  homeTo: string;
  brand?: string;
  contentClassName?: string;
  mobileNavBorder?: boolean;
};

export function AppSidebarLayout({
  children,
  navItems,
  navLabel,
  homeTo,
  brand = "GangnamSign",
  contentClassName,
  mobileNavBorder,
}: AppSidebarLayoutProps) {
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
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-72 border-r border-slate-200 bg-white px-5 py-8 lg:flex lg:flex-col">
        <Link
          to={homeTo}
          className="mb-9 px-4 text-3xl font-black tracking-normal text-primary"
        >
          {brand}
        </Link>
        <SidebarNav items={navItems} label={navLabel} />
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
          items={navItems}
          label={navLabel}
          bordered={mobileNavBorder}
        />
        <div className={contentClassName}>{children}</div>
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
        "flex gap-2 overflow-x-auto bg-white px-4 pb-3 pt-3 lg:hidden",
        bordered && "border-b border-slate-200"
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
                "flex h-11 shrink-0 items-center gap-2 rounded-xl border-2 border-transparent px-3 text-sm font-black uppercase text-slate-500",
                isActive && "border-primary/40 bg-primary/10 text-primary"
              )
            }
          >
            <Icon className="size-4 stroke-[3]" />
            <span>{item.label}</span>
          </NavLink>
        );
      })}
    </nav>
  );
}
