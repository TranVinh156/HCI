import { useQuery } from "@tanstack/react-query";

import { reportsApi } from "~/api/reports";

export function useOverviewReport() {
  return useQuery({
    queryKey: ["reports", "overview"],
    queryFn: () => reportsApi.overview(),
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useLessonReports() {
  return useQuery({
    queryKey: ["reports", "lessons"],
    queryFn: () => reportsApi.lessons(),
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useStudentReports() {
  return useQuery({
    queryKey: ["reports", "students"],
    queryFn: () => reportsApi.students(),
    retry: false,
    staleTime: 60 * 1000,
  });
}
