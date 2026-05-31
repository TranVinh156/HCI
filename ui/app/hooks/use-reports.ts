import { useQuery } from "@tanstack/react-query";

import { reportsApi } from "~/api/reports";

export function useOverviewStats() {
  return useQuery({
    queryKey: ["reports", "overview"],
    queryFn: reportsApi.overview,
    retry: false,
    staleTime: 3 * 60 * 1000,
  });
}
