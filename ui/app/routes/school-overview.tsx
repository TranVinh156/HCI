import { Sidebar } from "../components/Sidebar";
import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

type Faculty = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
};

type ClassRecord = {
  id: string;
  code: string;
  subject: string;
  teacher: string;
  facultyId: string;
  department: string;
  studentCount: number;
  sessionsHeld: number;
  avgEngagement: number;
  avgFocus: number;
  avgAttendance: number;
  totalAnomalies: number;
  semester: string;
};

// ─── Mock Data ────────────────────────────────────────────────────────────────

const FACULTIES: Faculty[] = [
  {
    id: "it",
    name: "Khoa Công nghệ Thông tin",
    shortName: "CNTT",
    color: "#0ea5e9",
    bgColor: "bg-sky-50",
    textColor: "text-sky-700",
    icon: "computer",
  },
  {
    id: "econ",
    name: "Khoa Kinh tế",
    shortName: "Kinh tế",
    color: "#10b981",
    bgColor: "bg-emerald-50",
    textColor: "text-emerald-700",
    icon: "trending_up",
  },
  {
    id: "biz",
    name: "Khoa Quản trị Kinh doanh",
    shortName: "QTKD",
    color: "#f59e0b",
    bgColor: "bg-amber-50",
    textColor: "text-amber-700",
    icon: "business_center",
  },
  {
    id: "eng",
    name: "Khoa Kỹ thuật",
    shortName: "Kỹ thuật",
    color: "#8b5cf6",
    bgColor: "bg-violet-50",
    textColor: "text-violet-700",
    icon: "engineering",
  },
];

const ALL_CLASSES: ClassRecord[] = [
  // IT Faculty
  {
    id: "c1",
    code: "IT-301",
    subject: "Học máy & AI",
    teacher: "PGS. Nguyễn Minh Tuấn",
    facultyId: "it",
    department: "Khoa học Máy tính",
    studentCount: 38,
    sessionsHeld: 24,
    avgEngagement: 88,
    avgFocus: 85,
    avgAttendance: 94,
    totalAnomalies: 12,
    semester: "HK1 2024-2025",
  },
  {
    id: "c2",
    code: "IT-205",
    subject: "Cấu trúc Dữ liệu & Giải thuật",
    teacher: "TS. Trần Thị Lan",
    facultyId: "it",
    department: "Khoa học Máy tính",
    studentCount: 42,
    sessionsHeld: 28,
    avgEngagement: 82,
    avgFocus: 79,
    avgAttendance: 91,
    totalAnomalies: 18,
    semester: "HK1 2024-2025",
  },
  {
    id: "c3",
    code: "IT-410",
    subject: "Phát triển Ứng dụng Web",
    teacher: "ThS. Lê Văn Hùng",
    facultyId: "it",
    department: "Kỹ thuật Phần mềm",
    studentCount: 35,
    sessionsHeld: 20,
    avgEngagement: 91,
    avgFocus: 88,
    avgAttendance: 96,
    totalAnomalies: 7,
    semester: "HK1 2024-2025",
  },
  {
    id: "c4",
    code: "IT-110",
    subject: "Lập trình Cơ sở",
    teacher: "TS. Phạm Quốc Bảo",
    facultyId: "it",
    department: "Kỹ thuật Phần mềm",
    studentCount: 50,
    sessionsHeld: 30,
    avgEngagement: 74,
    avgFocus: 70,
    avgAttendance: 88,
    totalAnomalies: 35,
    semester: "HK1 2024-2025",
  },
  {
    id: "c5",
    code: "IT-320",
    subject: "An ninh Mạng",
    teacher: "PGS. Vũ Thị Mai",
    facultyId: "it",
    department: "Hệ thống Thông tin",
    studentCount: 30,
    sessionsHeld: 22,
    avgEngagement: 86,
    avgFocus: 83,
    avgAttendance: 93,
    totalAnomalies: 10,
    semester: "HK1 2024-2025",
  },
  // Economics Faculty
  {
    id: "c6",
    code: "ECON-402",
    subject: "Kinh tế Vĩ mô Nâng cao",
    teacher: "GS. Hoàng Đức Vinh",
    facultyId: "econ",
    department: "Kinh tế học",
    studentCount: 32,
    sessionsHeld: 26,
    avgEngagement: 78,
    avgFocus: 75,
    avgAttendance: 89,
    totalAnomalies: 22,
    semester: "HK1 2024-2025",
  },
  {
    id: "c7",
    code: "ECON-211",
    subject: "Thống kê Ứng dụng",
    teacher: "TS. Ngô Thị Thanh",
    facultyId: "econ",
    department: "Thống kê",
    studentCount: 28,
    sessionsHeld: 24,
    avgEngagement: 80,
    avgFocus: 77,
    avgAttendance: 92,
    totalAnomalies: 14,
    semester: "HK1 2024-2025",
  },
  {
    id: "c8",
    code: "ECON-315",
    subject: "Kinh tế Lượng",
    teacher: "TS. Đinh Văn Khoa",
    facultyId: "econ",
    department: "Thống kê",
    studentCount: 25,
    sessionsHeld: 22,
    avgEngagement: 72,
    avgFocus: 68,
    avgAttendance: 85,
    totalAnomalies: 28,
    semester: "HK1 2024-2025",
  },
  {
    id: "c9",
    code: "ECON-501",
    subject: "Tài chính Quốc tế",
    teacher: "PGS. Lý Thị Hoa",
    facultyId: "econ",
    department: "Tài chính - Ngân hàng",
    studentCount: 36,
    sessionsHeld: 28,
    avgEngagement: 84,
    avgFocus: 81,
    avgAttendance: 91,
    totalAnomalies: 16,
    semester: "HK1 2024-2025",
  },
  // Business Faculty
  {
    id: "c10",
    code: "BIZ-305",
    subject: "Phân tích Kinh doanh",
    teacher: "TS. Trương Minh Nhật",
    facultyId: "biz",
    department: "Quản trị",
    studentCount: 24,
    sessionsHeld: 20,
    avgEngagement: 89,
    avgFocus: 86,
    avgAttendance: 95,
    totalAnomalies: 8,
    semester: "HK1 2024-2025",
  },
  {
    id: "c11",
    code: "BIZ-210",
    subject: "Marketing Hiện đại",
    teacher: "ThS. Phan Thị Bích",
    facultyId: "biz",
    department: "Marketing",
    studentCount: 40,
    sessionsHeld: 24,
    avgEngagement: 85,
    avgFocus: 82,
    avgAttendance: 90,
    totalAnomalies: 14,
    semester: "HK1 2024-2025",
  },
  {
    id: "c12",
    code: "BIZ-401",
    subject: "Quản trị Chiến lược",
    teacher: "GS. Nguyễn Anh Tuấn",
    facultyId: "biz",
    department: "Quản trị",
    studentCount: 30,
    sessionsHeld: 18,
    avgEngagement: 76,
    avgFocus: 73,
    avgAttendance: 87,
    totalAnomalies: 20,
    semester: "HK1 2024-2025",
  },
  {
    id: "c13",
    code: "BIZ-150",
    subject: "Nhập môn Kinh doanh",
    teacher: "ThS. Đoàn Thị Linh",
    facultyId: "biz",
    department: "Marketing",
    studentCount: 55,
    sessionsHeld: 26,
    avgEngagement: 69,
    avgFocus: 65,
    avgAttendance: 82,
    totalAnomalies: 42,
    semester: "HK1 2024-2025",
  },
  // Engineering Faculty
  {
    id: "c14",
    code: "ENG-201",
    subject: "Cơ học Kỹ thuật",
    teacher: "PGS. Bùi Văn Thắng",
    facultyId: "eng",
    department: "Cơ - Điện tử",
    studentCount: 45,
    sessionsHeld: 30,
    avgEngagement: 77,
    avgFocus: 74,
    avgAttendance: 88,
    totalAnomalies: 26,
    semester: "HK1 2024-2025",
  },
  {
    id: "c15",
    code: "ENG-350",
    subject: "Kỹ thuật Điều khiển",
    teacher: "TS. Cao Xuân Hiếu",
    facultyId: "eng",
    department: "Cơ - Điện tử",
    studentCount: 38,
    sessionsHeld: 26,
    avgEngagement: 83,
    avgFocus: 80,
    avgAttendance: 92,
    totalAnomalies: 15,
    semester: "HK1 2024-2025",
  },
  {
    id: "c16",
    code: "ENG-420",
    subject: "Thiết kế Hệ thống Nhúng",
    teacher: "TS. Lưu Thị Ngọc",
    facultyId: "eng",
    department: "Điện tử - Viễn thông",
    studentCount: 28,
    sessionsHeld: 22,
    avgEngagement: 87,
    avgFocus: 85,
    avgAttendance: 94,
    totalAnomalies: 9,
    semester: "HK1 2024-2025",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function qualityRating(engagement: number, focus: number, attendance: number) {
  const score = (engagement + focus + attendance) / 3;
  if (score >= 88) return { label: "Xuất sắc", color: "bg-emerald-100 text-emerald-700" };
  if (score >= 80) return { label: "Tốt", color: "bg-sky-100 text-sky-700" };
  if (score >= 72) return { label: "Khá", color: "bg-amber-100 text-amber-700" };
  return { label: "Cần cải thiện", color: "bg-rose-100 text-rose-700" };
}

function avg(arr: number[]) {
  if (!arr.length) return 0;
  return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function KpiCard({
  label,
  value,
  unit,
  icon,
  iconBg,
  iconColor,
}: {
  label: string;
  value: number | string;
  unit?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
}) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-[box-shadow]">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-slate-500 font-bold text-xs uppercase tracking-wider">{label}</h3>
        <div className={`p-2 ${iconBg} rounded-lg`}>
          <span className={`material-symbols-outlined ${iconColor} text-[20px]`}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-1">
        <span className="text-4xl font-extrabold text-slate-800">{value}</span>
        {unit && <span className="text-lg text-slate-400 mb-0.5">{unit}</span>}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function meta() {
  return [
    { title: "School Overview - The Insightful Lens" },
    { name: "description", content: "Thống kê chất lượng giảng dạy toàn trường theo khoa/viện." },
  ];
}

export default function SchoolOverview() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [activeFaculty, setActiveFaculty] = useState<string>("all");
  const [sortKey, setSortKey] = useState<"avgEngagement" | "avgFocus" | "avgAttendance" | "totalAnomalies">(
    "avgEngagement"
  );
  const [sortDesc, setSortDesc] = useState(true);

  const filteredClasses = useMemo(() => {
    const base = activeFaculty === "all" ? ALL_CLASSES : ALL_CLASSES.filter((c) => c.facultyId === activeFaculty);
    return [...base].sort((a, b) => {
      const va = a[sortKey];
      const vb = b[sortKey];
      return sortDesc ? vb - va : va - vb;
    });
  }, [activeFaculty, sortKey, sortDesc]);

  // School-wide KPIs
  const schoolAvgEngagement = avg(ALL_CLASSES.map((c) => c.avgEngagement));
  const schoolAvgFocus = avg(ALL_CLASSES.map((c) => c.avgFocus));
  const schoolAvgAttendance = avg(ALL_CLASSES.map((c) => c.avgAttendance));
  const totalStudents = ALL_CLASSES.reduce((s, c) => s + c.studentCount, 0);
  const totalSessions = ALL_CLASSES.reduce((s, c) => s + c.sessionsHeld, 0);
  const totalAnomalies = ALL_CLASSES.reduce((s, c) => s + c.totalAnomalies, 0);

  // Faculty aggregates for bar chart + radar
  const facultyStats = FACULTIES.map((f) => {
    const classes = ALL_CLASSES.filter((c) => c.facultyId === f.id);
    return {
      name: f.shortName,
      "Mức độ tập trung": avg(classes.map((c) => c.avgEngagement)),
      "Điểm tập trung": avg(classes.map((c) => c.avgFocus)),
      "Điểm danh": avg(classes.map((c) => c.avgAttendance)),
      color: f.color,
    };
  });

  const radarData = [
    { metric: "Tương tác", ...Object.fromEntries(FACULTIES.map((f) => [f.shortName, avg(ALL_CLASSES.filter((c) => c.facultyId === f.id).map((c) => c.avgEngagement))])) },
    { metric: "Tập trung", ...Object.fromEntries(FACULTIES.map((f) => [f.shortName, avg(ALL_CLASSES.filter((c) => c.facultyId === f.id).map((c) => c.avgFocus))])) },
    { metric: "Điểm danh", ...Object.fromEntries(FACULTIES.map((f) => [f.shortName, avg(ALL_CLASSES.filter((c) => c.facultyId === f.id).map((c) => c.avgAttendance))])) },
    { metric: "Chất lượng", ...Object.fromEntries(FACULTIES.map((f) => { const cl = ALL_CLASSES.filter((c) => c.facultyId === f.id); return [f.shortName, avg(cl.map((c) => Math.round((c.avgEngagement + c.avgFocus + c.avgAttendance) / 3)))]; })) },
    { metric: "Ít sự cố", ...Object.fromEntries(FACULTIES.map((f) => { const cl = ALL_CLASSES.filter((c) => c.facultyId === f.id); const maxAnom = 50; return [f.shortName, Math.max(0, 100 - Math.round((cl.reduce((s, c) => s + c.totalAnomalies, 0) / cl.length / maxAnom) * 100))]; })) },
  ];

  // Top 3 classes
  const top3 = [...ALL_CLASSES]
    .sort((a, b) => (b.avgEngagement + b.avgFocus + b.avgAttendance) / 3 - (a.avgEngagement + a.avgFocus + a.avgAttendance) / 3)
    .slice(0, 3);

  // Best faculty
  const facultyRanked = FACULTIES.map((f) => {
    const classes = ALL_CLASSES.filter((c) => c.facultyId === f.id);
    const score = avg(classes.map((c) => Math.round((c.avgEngagement + c.avgFocus + c.avgAttendance) / 3)));
    return { ...f, score, classCount: classes.length };
  }).sort((a, b) => b.score - a.score);

  function toggleSort(key: typeof sortKey) {
    if (sortKey === key) setSortDesc((d) => !d);
    else { setSortKey(key); setSortDesc(true); }
  }

  function SortIcon({ k }: { k: typeof sortKey }) {
    if (sortKey !== k) return <span className="material-symbols-outlined text-slate-300 text-sm">unfold_more</span>;
    return <span className="material-symbols-outlined text-sky-500 text-sm">{sortDesc ? "arrow_downward" : "arrow_upward"}</span>;
  }

  return (
    <main className="bg-background text-on-surface font-body flex overflow-hidden min-h-screen">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} activeTab="school" />

      <section className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* ── Header ── */}
        <header className="w-full top-0 sticky flex justify-between items-center h-16 px-6 bg-slate-50 border-b border-slate-100 z-10">
          <div className="flex items-center gap-4 flex-1">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-200 transition-colors"
                aria-label="Show sidebar"
              >
                <span className="material-symbols-outlined">left_panel_open</span>
              </button>
            )}
            <div>
              <h2 className="font-headline font-bold text-xl text-primary tracking-tight">Tổng quan Nhà trường</h2>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
            <span className="material-symbols-outlined text-sm">account_balance</span>
            HK1 · 2024–2025
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-w-screen-2xl mx-auto w-full">

          {/* ── School KPI Cards ── */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <KpiCard label="Tổng số lớp" value={ALL_CLASSES.length} icon="class" iconBg="bg-sky-50" iconColor="text-sky-500" />
            <KpiCard label="Tổng sinh viên" value={totalStudents} icon="groups" iconBg="bg-emerald-50" iconColor="text-emerald-500" />
            <KpiCard label="Tổng buổi học" value={totalSessions} icon="event_note" iconBg="bg-violet-50" iconColor="text-violet-500" />
            <KpiCard label="TB Tương tác" value={schoolAvgEngagement} unit="%" icon="insights" iconBg="bg-sky-50" iconColor="text-sky-500" />
            <KpiCard label="TB Tập trung" value={schoolAvgFocus} unit="/100" icon="psychology" iconBg="bg-amber-50" iconColor="text-amber-500" />
            <KpiCard label="Cảnh báo (tổng)" value={totalAnomalies} icon="warning" iconBg="bg-rose-50" iconColor="text-rose-500" />
          </div>

          {/* ── Congratulations / Top Performers ── */}
          <div className="bg-gradient-to-br from-sky-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center gap-3 mb-5">
              <span className="material-symbols-outlined text-yellow-300 text-3xl">military_tech</span>
              <div>
                <h3 className="font-headline font-bold text-xl">Chúc mừng – Top lớp học xuất sắc!</h3>
                <p className="text-sky-200 text-sm">Những lớp dẫn đầu về chất lượng giảng dạy kỳ này</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {top3.map((cls, idx) => {
                const faculty = FACULTIES.find((f) => f.id === cls.facultyId)!;
                const medals = ["🥇", "🥈", "🥉"];
                const score = Math.round((cls.avgEngagement + cls.avgFocus + cls.avgAttendance) / 3);
                return (
                  <div key={cls.id} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{medals[idx]}</span>
                      <span className="font-bold text-sm">{cls.code}</span>
                    </div>
                    <p className="font-semibold text-sm leading-snug mb-1">{cls.subject}</p>
                    <p className="text-sky-200 text-xs mb-3">{cls.teacher}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full bg-white/20`}>{faculty.shortName}</span>
                      <span className="text-yellow-300 font-extrabold text-lg">{score}<span className="text-xs font-normal text-white/70">/100</span></span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Faculty Ranking + Radar ── */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            {/* Faculty Cards */}
            <div className="xl:col-span-2 space-y-3">
              <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider mb-1">Xếp hạng Khoa / Viện</h3>
              {facultyRanked.map((f, idx) => (
                <div
                  key={f.id}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                    activeFaculty === f.id
                      ? "border-sky-400 bg-sky-50 shadow-md"
                      : "border-slate-200 bg-white hover:bg-slate-50"
                  }`}
                  onClick={() => setActiveFaculty(activeFaculty === f.id ? "all" : f.id)}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${f.bgColor} flex items-center justify-center`}>
                    <span className={`material-symbols-outlined ${f.textColor}`}>{f.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{f.name}</p>
                    <p className="text-xs text-slate-500">{f.classCount} lớp · TB {f.score}/100</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {idx === 0 && <span className="text-lg">🏆</span>}
                    <div className="w-12 h-12 relative">
                      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15.9"
                          fill="none"
                          stroke={f.color}
                          strokeWidth="3"
                          strokeDasharray={`${f.score} ${100 - f.score}`}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-extrabold text-slate-700">
                        {f.score}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="xl:col-span-3 grid grid-rows-2 gap-6">
              {/* Bar chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 mb-4">So sánh Chỉ số theo Khoa</h3>
                <div className="flex-1 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={facultyStats} margin={{ top: 0, right: 0, left: 0, bottom: 0 }} barSize={16}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#64748b" }} />
                      <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94a3b8" }} width={30} />
                      <Tooltip
                        contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
                      />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                      <Bar dataKey="Mức độ tập trung" fill="#0ea5e9" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="Điểm tập trung" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                      <Bar dataKey="Điểm danh" fill="#f59e0b" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar chart */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <h3 className="text-sm font-bold text-slate-800 mb-3">Biểu đồ Radar – Chất lượng Đa chiều</h3>
                <div className="flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid stroke="#e2e8f0" />
                      <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fill: "#64748b" }} />
                      {FACULTIES.map((f) => (
                        <Radar
                          key={f.id}
                          name={f.shortName}
                          dataKey={f.shortName}
                          stroke={f.color}
                          fill={f.color}
                          fillOpacity={0.08}
                          strokeWidth={2}
                          isAnimationActive={false}
                        />
                      ))}
                      <Legend iconType="circle" wrapperStyle={{ fontSize: "12px" }} />
                      <Tooltip contentStyle={{ borderRadius: "10px", border: "1px solid #e2e8f0" }} />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>

          {/* ── Class Table ── */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider">
                  Danh sách Lớp học
                  {activeFaculty !== "all" && (
                    <span className="ml-2 normal-case font-semibold text-sky-600">
                      · {FACULTIES.find((f) => f.id === activeFaculty)?.name}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {filteredClasses.length} lớp · Nhấn tiêu đề cột để sắp xếp
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveFaculty("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeFaculty === "all" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Tất cả
                </button>
                {FACULTIES.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFaculty(activeFaculty === f.id ? "all" : f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      activeFaculty === f.id
                        ? "bg-sky-600 text-white"
                        : `${f.bgColor} ${f.textColor} hover:opacity-80`
                    }`}
                  >
                    {f.shortName}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Lớp</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Giảng viên</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden md:table-cell">Khoa</th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider hidden sm:table-cell">
                      SV
                    </th>
                    <th
                      className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors"
                      onClick={() => toggleSort("avgEngagement")}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Tương tác <SortIcon k="avgEngagement" />
                      </span>
                    </th>
                    <th
                      className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors hidden lg:table-cell"
                      onClick={() => toggleSort("avgFocus")}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Tập trung <SortIcon k="avgFocus" />
                      </span>
                    </th>
                    <th
                      className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors"
                      onClick={() => toggleSort("avgAttendance")}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Điểm danh <SortIcon k="avgAttendance" />
                      </span>
                    </th>
                    <th
                      className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider cursor-pointer select-none hover:text-sky-600 transition-colors hidden md:table-cell"
                      onClick={() => toggleSort("totalAnomalies")}
                    >
                      <span className="flex items-center justify-center gap-1">
                        Cảnh báo <SortIcon k="totalAnomalies" />
                      </span>
                    </th>
                    <th className="text-center px-4 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Đánh giá</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredClasses.map((cls) => {
                    const faculty = FACULTIES.find((f) => f.id === cls.facultyId)!;
                    const rating = qualityRating(cls.avgEngagement, cls.avgFocus, cls.avgAttendance);
                    const overallScore = Math.round((cls.avgEngagement + cls.avgFocus + cls.avgAttendance) / 3);
                    return (
                      <tr key={cls.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <p className="font-bold text-sky-800 text-xs">{cls.code}</p>
                          <p className="text-slate-700 font-medium text-sm">{cls.subject}</p>
                          <p className="text-xs text-slate-400">{cls.sessionsHeld} buổi</p>
                        </td>
                        <td className="px-5 py-3.5">
                          <p className="text-slate-700 text-sm">{cls.teacher}</p>
                          <p className="text-xs text-slate-400">{cls.department}</p>
                        </td>
                        <td className="px-5 py-3.5 hidden md:table-cell">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${faculty.bgColor} ${faculty.textColor}`}>
                            <span className="material-symbols-outlined text-[14px]">{faculty.icon}</span>
                            {faculty.shortName}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden sm:table-cell">
                          <span className="text-slate-600 font-medium">{cls.studentCount}</span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-slate-800">{cls.avgEngagement}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-sky-400 rounded-full" style={{ width: `${cls.avgEngagement}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden lg:table-cell">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-slate-800">{cls.avgFocus}</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${cls.avgFocus}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="font-bold text-slate-800">{cls.avgAttendance}%</span>
                            <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div className="h-full bg-amber-400 rounded-full" style={{ width: `${cls.avgAttendance}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center hidden md:table-cell">
                          <span
                            className={`font-bold ${
                              cls.totalAnomalies > 30
                                ? "text-rose-600"
                                : cls.totalAnomalies > 15
                                ? "text-amber-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {cls.totalAnomalies}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${rating.color}`}>
                              {rating.label}
                            </span>
                            <span className="text-xs text-slate-400 font-semibold">{overallScore}/100</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Department Summary ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {facultyRanked.map((f) => {
              const classes = ALL_CLASSES.filter((c) => c.facultyId === f.id);
              const excellent = classes.filter((c) => {
                const s = (c.avgEngagement + c.avgFocus + c.avgAttendance) / 3;
                return s >= 88;
              }).length;
              const needsWork = classes.filter((c) => {
                const s = (c.avgEngagement + c.avgFocus + c.avgAttendance) / 3;
                return s < 72;
              }).length;
              const fStudents = classes.reduce((s, c) => s + c.studentCount, 0);

              return (
                <div key={f.id} className={`rounded-2xl border-2 p-5 ${activeFaculty === f.id ? "border-sky-400" : "border-slate-200"} bg-white shadow-sm hover:shadow-md transition-all cursor-pointer`}
                  onClick={() => setActiveFaculty(activeFaculty === f.id ? "all" : f.id)}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${f.bgColor} flex items-center justify-center`}>
                      <span className={`material-symbols-outlined ${f.textColor}`}>{f.icon}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{f.shortName}</h4>
                      <p className="text-xs text-slate-400">{f.classCount} lớp · {fStudents} SV</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Điểm trung bình</span>
                      <span className="font-bold text-slate-800">{f.score}/100</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${f.score}%`, backgroundColor: f.color }} />
                    </div>
                    <div className="flex justify-between pt-1">
                      <span className="text-emerald-600 font-semibold">{excellent} lớp xuất sắc</span>
                      {needsWork > 0 && <span className="text-rose-500 font-semibold">{needsWork} cần cải thiện</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>
    </main>
  );
}
