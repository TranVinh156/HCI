import { request } from "./request";
import type { Badge, Progress } from "./types";

export const progressApi = {
  get: (profileId: string) => request<Progress>(`/api/progress/${profileId}`),

  complete: (profileId: string, lessonId: string, correct: number, total: number) =>
    request<Badge[]>(`/api/progress/${profileId}/complete`, {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, correct, total }),
    }),
};
