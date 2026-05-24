import { request } from "./request";
import type { Topic } from "./types";

export const topicsApi = {
  list: () => request<Topic[]>("/api/topics"),

  get: (id: string) => request<Topic>(`/api/topics/${id}`),

  create: (body: Omit<Topic, "id" | "lesson_count">) =>
    request<Topic>("/api/topics", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<Omit<Topic, "id">>) =>
    request<Topic>(`/api/topics/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request<void>(`/api/topics/${id}`, { method: "DELETE" }),
};
