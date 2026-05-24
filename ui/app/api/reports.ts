import { request } from "./request";
import type {
  LessonStat,
  OverviewStats,
  StudentDetail,
  StudentStat,
} from "./types";

export const reportsApi = {
  overview: () => request<OverviewStats>("/api/reports/overview"),

  students: () => request<StudentStat[]>("/api/reports/students"),

  student: (profileId: string) =>
    request<StudentDetail>(`/api/reports/students/${profileId}`),

  lessons: () => request<LessonStat[]>("/api/reports/lessons"),
};
