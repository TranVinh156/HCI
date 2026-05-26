import { request } from "./request";
import type { QuizQuestion } from "./types";

export const questionsApi = {
  list: (topicId?: string) =>
    request<QuizQuestion[]>(
      `/api/questions${topicId ? `?topic_id=${topicId}` : ""}`
    ),
};
