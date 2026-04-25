import { BarChart3, BookOpen, GraduationCap, LayoutDashboard } from "lucide-react";
import { Link } from "react-router";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Students", icon: GraduationCap },
  { label: "Content", icon: BookOpen },
  { label: "Reports", icon: BarChart3 },
];

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-sky-100 bg-[#064f83] p-5 text-white lg:block">
        <Link to="/learn" className="text-xl font-black">
          SignOcean
        </Link>
        <nav className="mt-8 space-y-2">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-bold ${
                  index === 0 ? "bg-white/15" : "text-sky-100 hover:bg-white/10"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-sky-100 bg-white/90 px-5 py-4 backdrop-blur">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div>
              <p className="text-sm font-bold text-cyan-700">Content admin</p>
              <h1 className="text-2xl font-black">Learning dashboard</h1>
            </div>
            <Link
              to="/learn"
              className="rounded-xl border border-sky-200 px-3 py-2 text-sm font-bold text-sky-700"
            >
              View student app
            </Link>
          </div>
        </header>
        <div className="mx-auto max-w-7xl p-5">{children}</div>
      </main>
    </div>
  );
}
