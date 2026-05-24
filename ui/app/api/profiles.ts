import { request } from "./request";
import type { StudentProfile } from "./types";

type StudentProfileBody = Omit<StudentProfile, "id" | "user_id">;

export const profilesApi = {
  list: () => request<StudentProfile[]>("/api/profiles"),

  create: (body: StudentProfileBody) =>
    request<StudentProfile>("/api/profiles", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  get: (id: string) => request<StudentProfile>(`/api/profiles/${id}`),

  update: (id: string, body: Partial<StudentProfileBody>) =>
    request<StudentProfile>(`/api/profiles/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request<void>(`/api/profiles/${id}`, { method: "DELETE" }),
};
