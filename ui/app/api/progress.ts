import { request } from "./request";
import type { Badge, Progress, TopicQuizAttempt } from "./types";

export const progressApi = {
  get: (profileId: string) => request<Progress>(`/api/progress/${profileId}`),

  complete: (profileId: string, lessonId: string, correct: number, total: number) =>
    request<Badge[]>(`/api/progress/${profileId}/complete`, {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId, correct, total }),
    }),

  listTopicQuizAttempts: (profileId: string, topicId: string) =>
    request<TopicQuizAttempt[]>(
      `/api/progress/${profileId}/topic-quiz-attempts/${topicId}`
    ),

  completeTopicQuiz: (
    profileId: string,
    topicId: string,
    correct: number,
    total: number
  ) =>
    request<TopicQuizAttempt>(`/api/progress/${profileId}/topic-quiz-attempts`, {
      method: "POST",
      body: JSON.stringify({ topic_id: topicId, correct, total }),
    }),
};
