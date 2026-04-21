import { Link } from "react-router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";
import { ASSIGNED_CLASSES, type ManagedClass } from "../features/classes/data";
import { useAuth } from "../auth";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
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
              const status = item.status;

              return (
                <Card
                  key={item.id}
                  className="relative overflow-hidden border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <CardContent className="relative flex h-full flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <h4 className="text-lg font-semibold leading-tight text-slate-900">{item.subject}</h4>
                      </div>

                      {status === "LIVE" && (
                        <Badge variant="destructive" className="gap-2 rounded-full px-2 py-3 text-sm font-bold">
                          <span className="material-symbols-outlined text-xs">live_tv</span>
                          LIVE
                        </Badge>
                      )}
                    </div>



                    <div className="grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Class</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{item.code}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Students</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{item.studentCount}</p>
                      </div>
                      <div className="rounded-xl border border-slate-200 bg-white px-3 py-2.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Room</p>
                        <p className="mt-1 text-sm font-semibold text-slate-800">{item.room}</p>
                      </div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
                      <p className="mb-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Schedule
                      </p>
                      <p className="text-sm font-semibold text-slate-800">{item.schedule}</p>
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
