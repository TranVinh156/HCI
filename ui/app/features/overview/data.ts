export type Faculty = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
};

export type ClassRecord = {
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

export const FACULTIES: Faculty[] = [
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

export const ALL_CLASSES: ClassRecord[] = [
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

export function avg(values: number[]) {
  if (!values.length) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

export function qualityRating(engagement: number, focus: number, attendance: number) {
  const score = (engagement + focus + attendance) / 3;

  if (score >= 88) {
    return { label: "Xuất sắc", color: "bg-emerald-100 text-emerald-700" };
  }

  if (score >= 80) {
    return { label: "Tốt", color: "bg-sky-100 text-sky-700" };
  }

  if (score >= 72) {
    return { label: "Khá", color: "bg-amber-100 text-amber-700" };
  }

  return { label: "Cần cải thiện", color: "bg-rose-100 text-rose-700" };
}
