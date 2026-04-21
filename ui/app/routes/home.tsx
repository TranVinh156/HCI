import { Link } from "react-router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";
import { ASSIGNED_CLASSES, type ManagedClass } from "../features/classes/data";
import { useAuth } from "../auth";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { cn } from "../lib/utils";

const CLASS_STATUS_COPY: Record<
  ManagedClass["status"],
  { label: string; tone: string; stripe: string }
> = {
  ONGOING: {
    label: "Ongoing",
    tone: "bg-emerald-100 text-emerald-700",
    stripe: "from-emerald-500/20 via-emerald-500/10 to-transparent",
  },
  UPCOMING: {
    label: "Upcoming",
    tone: "bg-amber-100 text-amber-700",
    stripe: "from-amber-500/20 via-amber-500/10 to-transparent",
  },
};

export function meta() {
  return [
    { title: "Live Dashboard - Assigned Classes" },
    {
      name: "description",
      content: "Choose a class first, then open live classroom analytics.",
    },
  ];
}

export default function Home() {
  const { user } = useAuth();
  const pageTitle = user?.role === "teacher" ? "Assigned Classes" : "Classroom Workspace";
  const bannerLabel =
    user?.role === "teacher"
      ? "SELECT A CLASS TO OPEN LIVE SESSION"
      : `SIGNED IN AS ${user?.username.toUpperCase() ?? "USER"}`;

  return (
    <DashboardShell
      title={pageTitle}
      subtitle={user ? `${user.label} workspace` : undefined}
      rightSlot={
        <Badge variant="secondary" className="gap-2 rounded-full px-3 py-1 text-sky-700">
          <span className="material-symbols-outlined text-sm">school</span>
          {bannerLabel}
        </Badge>
      }
    >
      <Card>
        <CardContent className="p-5">
        <SectionHeading
          title="Danh Sach Lop Duoc Phan Cong"
          description="Chon lop hoc de mo live session va cac khung phan tich lien quan."
          eyebrow={`${ASSIGNED_CLASSES.length} classes`}
          className="mb-5"
        />

        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2 2xl:grid-cols-3">
          {ASSIGNED_CLASSES.map((item) => {
            const status = CLASS_STATUS_COPY[item.status];

            return (
              <Card
                key={item.id}
                className="relative overflow-hidden border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className={cn("pointer-events-none absolute inset-x-0 top-0 h-20 ", status.stripe)} />
                <CardContent className="relative flex h-full flex-col gap-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="rounded-full border-sky-200 bg-sky-50 px-2.5 py-1 font-semibold text-sky-800">
                          {item.code}
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold leading-tight text-slate-900">{item.subject}</h4>
                      </div>
                    </div>

                    <Badge variant="secondary" className={cn("shrink-0 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide", status.tone)}>
                      {status.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="material-symbols-outlined text-sm">door_front</span>
                        Room
                      </p>
                      <p className="text-sm font-semibold text-slate-800">{item.room}</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 sm:col-span-2">
                      <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Schedule
                      </p>
                      <p className="text-sm font-semibold text-slate-800">{item.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-dashed border-slate-200 bg-slate-50/80 px-3 py-2.5">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Attendance Scope</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">{item.studentCount} enrolled students</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-full bg-white text-primary ring-1 ring-slate-200">
                      <span className="material-symbols-outlined">groups</span>
                    </div>
                  </div>

                  <div className="mt-auto grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <Button asChild size="lg" className="h-11 rounded-xl font-semibold shadow-sm">
                      <Link to={`/live?class=${encodeURIComponent(item.code)}`}>
                        <span className="material-symbols-outlined text-sm">play_circle</span>
                        Open Live
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="h-11 rounded-xl font-semibold">
                      <Link to={`/session-analytics?class=${encodeURIComponent(item.code)}`}>
                        <span className="material-symbols-outlined text-sm">analytics</span>
                        View Analytics
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
