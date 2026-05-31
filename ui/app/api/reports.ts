import { request } from "./request";
import type { OverviewStats } from "./types";

export const reportsApi = {
  overview: () => request<OverviewStats>("/api/reports/overview"),
};
