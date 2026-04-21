import { Link } from "react-router";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { SectionHeading } from "../components/dashboard/SectionHeading";
import { useAuth } from "../auth";

type AssignedClass = {
  id: string;
  code: string;
  subject: string;
  room: string;
  schedule: string;
  studentCount: number;
  status: "ONGOING" | "UPCOMING";
};

const ASSIGNED_CLASSES: AssignedClass[] = [
  {
    id: "class-ec402",
    code: "ECON-402",
    subject: "Advanced Macroeconomics",
    room: "Room 204",
    schedule: "Mon, Wed 09:30 - 11:00",
    studentCount: 32,
    status: "ONGOING",
  },
  {
    id: "class-st211",
    code: "STAT-211",
    subject: "Applied Statistics",
    room: "Room 112",
    schedule: "Tue, Thu 13:15 - 14:45",
    studentCount: 28,
    status: "UPCOMING",
  },
  {
    id: "class-ba305",
    code: "BA-305",
    subject: "Business Analytics Lab",
    room: "Lab A3",
    schedule: "Fri 08:00 - 10:30",
    studentCount: 24,
    status: "UPCOMING",
  },
  {
    id: "class-fi320",
    code: "FIN-320",
    subject: "Corporate Finance",
    room: "Room 305",
    schedule: "Tue 08:30 - 11:00",
    studentCount: 36,
    status: "UPCOMING",
  },
];

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
        <div className="flex items-center gap-2 px-3 py-1 bg-sky-100 text-sky-700 rounded-full text-xs font-bold">
          <span className="material-symbols-outlined text-sm">school</span>
          {bannerLabel}
        </div>
      }
    >
      <section className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <SectionHeading
          title="Danh Sach Lop Duoc Phan Cong"
          description="Chon lop hoc de mo live session va cac khung phan tich lien quan."
          eyebrow={`${ASSIGNED_CLASSES.length} classes`}
          className="mb-4"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {ASSIGNED_CLASSES.map((item) => (
            <article key={item.id} className="rounded-lg border border-slate-200 bg-slate-50 p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold tracking-wider text-sky-800">{item.code}</p>
                <span
                  className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    item.status === "ONGOING" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {item.status}
                </span>
              </div>
              <h4 className="text-sm font-semibold text-slate-800">{item.subject}</h4>
              <div className="text-xs text-slate-600 space-y-1">
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">door_front</span>
                  {item.room}
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  {item.schedule}
                </p>
                <p className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">groups</span>
                  {item.studentCount} students
                </p>
              </div>
              <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <Link
                  to={`/live?class=${encodeURIComponent(item.code)}`}
                  className="inline-flex items-center justify-center gap-2 bg-linear-to-br from-primary to-primary-container text-on-primary px-4 py-2 rounded-md font-semibold text-sm hover:opacity-90 active:scale-95 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">play_circle</span>
                  Open Live
                </Link>
                <Link
                  to={`/session-analytics?class=${encodeURIComponent(item.code)}`}
                  className="inline-flex items-center justify-center gap-2 border border-slate-200 bg-white text-slate-700 px-4 py-2 rounded-md font-semibold text-sm hover:bg-slate-100 transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">analytics</span>
                  View Analytics
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </DashboardShell>
  );
}
