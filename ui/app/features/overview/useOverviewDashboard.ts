import { useEffect, useMemo, useState } from "react";
import { ALL_CLASSES, FACULTIES, avg, type ClassRecord, type Faculty } from "./data";

export type OverviewMode = "school" | "faculty";
export type OverviewSortKey = "avgEngagement" | "avgFocus" | "avgAttendance" | "totalAnomalies";

type OverviewGroup = {
  id: string;
  name: string;
  shortName: string;
  color: string;
  bgColor: string;
  textColor: string;
  icon: string;
};

type OverviewGroupStats = OverviewGroup & {
  classCount: number;
  studentCount: number;
  score: number;
  excellentCount: number;
  needsWorkCount: number;
  avgEngagement: number;
  avgFocus: number;
  avgAttendance: number;
  totalAnomalies: number;
};

const DEPARTMENT_STYLES = [
  { color: "#0ea5e9", bgColor: "bg-sky-50", textColor: "text-sky-700", icon: "apartment" },
  { color: "#10b981", bgColor: "bg-emerald-50", textColor: "text-emerald-700", icon: "account_tree" },
  { color: "#f59e0b", bgColor: "bg-amber-50", textColor: "text-amber-700", icon: "lan" },
  { color: "#8b5cf6", bgColor: "bg-violet-50", textColor: "text-violet-700", icon: "schema" },
  { color: "#ef4444", bgColor: "bg-rose-50", textColor: "text-rose-700", icon: "hub" },
] as const;

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function toShortName(value: string) {
  const parts = value.split(/[^A-Za-zÀ-ỹ0-9]+/u).filter(Boolean);
  const initials = parts.slice(0, 4).map((part) => part[0]?.toUpperCase() ?? "").join("");
  return initials || value.slice(0, 3).toUpperCase();
}

function buildDepartmentGroups(classes: ClassRecord[]): OverviewGroup[] {
  return Array.from(new Set(classes.map((item) => item.department))).map((department, index) => {
    const style = DEPARTMENT_STYLES[index % DEPARTMENT_STYLES.length];
    return {
      id: slugify(department),
      name: department,
      shortName: toShortName(department),
      color: style.color,
      bgColor: style.bgColor,
      textColor: style.textColor,
      icon: style.icon,
    };
  });
}

function getGroupIdForClass(mode: OverviewMode, classRecord: ClassRecord) {
  return mode === "school" ? classRecord.facultyId : slugify(classRecord.department);
}

function getGroupNameForClass(mode: OverviewMode, classRecord: ClassRecord, facultyById: Map<string, Faculty>) {
  if (mode === "school") {
    return facultyById.get(classRecord.facultyId)?.name ?? classRecord.facultyId;
  }

  return classRecord.department;
}

export function useOverviewDashboard({
  mode,
  lockedFacultyId,
}: {
  mode: OverviewMode;
  lockedFacultyId?: string;
}) {
  const [activeGroup, setActiveGroup] = useState("all");
  const [sortKey, setSortKey] = useState<OverviewSortKey>("avgEngagement");
  const [sortDesc, setSortDesc] = useState(true);

  const facultyContext = useMemo(() => {
    if (mode !== "faculty") {
      return null;
    }

    return FACULTIES.find((item) => item.id === lockedFacultyId) ?? FACULTIES[0];
  }, [lockedFacultyId, mode]);

  const scopedClasses = useMemo(() => {
    if (mode !== "faculty") {
      return ALL_CLASSES;
    }

    const facultyId = facultyContext?.id ?? FACULTIES[0].id;
    return ALL_CLASSES.filter((item) => item.facultyId === facultyId);
  }, [facultyContext, mode]);

  const groups = useMemo<OverviewGroup[]>(() => {
    if (mode === "school") {
      return FACULTIES;
    }

    return buildDepartmentGroups(scopedClasses);
  }, [mode, scopedClasses]);

  useEffect(() => {
    setActiveGroup("all");
  }, [mode, facultyContext?.id]);

  const facultyById = useMemo(() => new Map(FACULTIES.map((item) => [item.id, item])), []);
  const groupById = useMemo(() => new Map(groups.map((item) => [item.id, item])), [groups]);

  const groupStats = useMemo<OverviewGroupStats[]>(() => {
    return groups
      .map((group) => {
        const classes = scopedClasses.filter((item) => getGroupIdForClass(mode, item) === group.id);
        const score = avg(
          classes.map((item) => Math.round((item.avgEngagement + item.avgFocus + item.avgAttendance) / 3)),
        );

        return {
          ...group,
          classCount: classes.length,
          studentCount: classes.reduce((total, item) => total + item.studentCount, 0),
          score,
          excellentCount: classes.filter((item) => (item.avgEngagement + item.avgFocus + item.avgAttendance) / 3 >= 88)
            .length,
          needsWorkCount: classes.filter((item) => (item.avgEngagement + item.avgFocus + item.avgAttendance) / 3 < 72)
            .length,
          avgEngagement: avg(classes.map((item) => item.avgEngagement)),
          avgFocus: avg(classes.map((item) => item.avgFocus)),
          avgAttendance: avg(classes.map((item) => item.avgAttendance)),
          totalAnomalies: classes.reduce((total, item) => total + item.totalAnomalies, 0),
        };
      })
      .sort((left, right) => right.score - left.score);
  }, [groups, mode, scopedClasses]);

  const filteredClasses = useMemo(() => {
    const base =
      activeGroup === "all"
        ? scopedClasses
        : scopedClasses.filter((item) => getGroupIdForClass(mode, item) === activeGroup);

    return [...base].sort((left, right) => {
      const leftValue = left[sortKey];
      const rightValue = right[sortKey];
      return sortDesc ? rightValue - leftValue : leftValue - rightValue;
    });
  }, [activeGroup, mode, scopedClasses, sortDesc, sortKey]);

  const totalStudents = scopedClasses.reduce((total, item) => total + item.studentCount, 0);
  const totalSessions = scopedClasses.reduce((total, item) => total + item.sessionsHeld, 0);
  const totalAnomalies = scopedClasses.reduce((total, item) => total + item.totalAnomalies, 0);
  const averageEngagement = avg(scopedClasses.map((item) => item.avgEngagement));
  const averageFocus = avg(scopedClasses.map((item) => item.avgFocus));

  const topClasses = useMemo(() => {
    return [...scopedClasses]
      .sort(
        (left, right) =>
          (right.avgEngagement + right.avgFocus + right.avgAttendance) / 3 -
          (left.avgEngagement + left.avgFocus + left.avgAttendance) / 3,
      )
      .slice(0, 3);
  }, [scopedClasses]);

  const comparisonChartData = groupStats.map((group) => ({
    name: group.shortName,
    "Tương tác": group.avgEngagement,
    "Tập trung": group.avgFocus,
    "Điểm danh": group.avgAttendance,
  }));

  const radarData = [
    {
      metric: "Tương tác",
      ...Object.fromEntries(groupStats.map((group) => [group.shortName, group.avgEngagement])),
    },
    {
      metric: "Tập trung",
      ...Object.fromEntries(groupStats.map((group) => [group.shortName, group.avgFocus])),
    },
    {
      metric: "Điểm danh",
      ...Object.fromEntries(groupStats.map((group) => [group.shortName, group.avgAttendance])),
    },
    {
      metric: "Chất lượng",
      ...Object.fromEntries(groupStats.map((group) => [group.shortName, group.score])),
    },
    {
      metric: "Ít sự cố",
      ...Object.fromEntries(
        groupStats.map((group) => {
          const safeScore =
            group.classCount === 0 ? 100 : Math.max(0, 100 - Math.round((group.totalAnomalies / group.classCount / 50) * 100));
          return [group.shortName, safeScore];
        }),
      ),
    },
  ];

  const labels =
    mode === "school"
      ? {
          pageTitle: "Tổng quan Nhà trường",
          pageBadge: "HK1 · 2024–2025",
          pageBadgeIcon: "account_balance",
          groupLabel: "Khoa / Viện",
          groupLabelShort: "Khoa",
          groupRankingTitle: "Xếp hạng Khoa / Viện",
          compareTitle: "So sánh Chỉ số theo Khoa",
          radarTitle: "Biểu đồ Radar – Chất lượng Đa chiều",
          topTitle: "Chúc mừng – Top lớp học xuất sắc!",
          topDescription: "Những lớp dẫn đầu về chất lượng giảng dạy kỳ này",
          tableTitle: "Danh sách Lớp học",
          summaryTitle: "Tổng quan theo khoa / viện",
          allFilterLabel: "Tất cả",
        }
      : {
          pageTitle: `Tổng quan ${facultyContext?.name ?? "Khoa"}`,
          pageBadge: `${facultyContext?.shortName ?? "KHOA"} · Faculty Scope`,
          pageBadgeIcon: "domain",
          groupLabel: "Bộ môn",
          groupLabelShort: "Bộ môn",
          groupRankingTitle: "Xếp hạng Bộ môn",
          compareTitle: "So sánh Chỉ số theo Bộ môn",
          radarTitle: "Biểu đồ Radar – Chất lượng trong khoa",
          topTitle: "Top lớp học nổi bật trong khoa",
          topDescription: "Các lớp đang dẫn đầu chất lượng giảng dạy trong phạm vi khoa",
          tableTitle: "Danh sách Lớp thuộc khoa",
          summaryTitle: "Tổng quan theo bộ môn",
          allFilterLabel: "Tất cả bộ môn",
        };

  function toggleSort(nextSortKey: OverviewSortKey) {
    if (sortKey === nextSortKey) {
      setSortDesc((current) => !current);
      return;
    }

    setSortKey(nextSortKey);
    setSortDesc(true);
  }

  return {
    labels,
    mode,
    facultyContext,
    activeGroup,
    setActiveGroup,
    sortKey,
    sortDesc,
    toggleSort,
    groups,
    groupById,
    groupStats,
    filteredClasses,
    topClasses,
    comparisonChartData,
    radarData,
    averageEngagement,
    averageFocus,
    totalStudents,
    totalSessions,
    totalAnomalies,
    getGroupIdForClass: (classRecord: ClassRecord) => getGroupIdForClass(mode, classRecord),
    getGroupNameForClass: (classRecord: ClassRecord) => getGroupNameForClass(mode, classRecord, facultyById),
  };
}
