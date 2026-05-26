import { request } from "./request";
import type { Exercise, Lesson, QuizQuestion } from "./types";

export const lessonsApi = {
  list: (topicId?: string) =>
    request<Lesson[]>(`/api/lessons${topicId ? `?topic_id=${topicId}` : ""}`),

  get: (id: string) => request<Lesson>(`/api/lessons/${id}`),

  create: (body: Omit<Lesson, "id">) =>
    request<Lesson>("/api/lessons", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  update: (id: string, body: Partial<Omit<Lesson, "id">>) =>
    request<Lesson>(`/api/lessons/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  delete: (id: string) =>
    request<void>(`/api/lessons/${id}`, { method: "DELETE" }),

  exercises: (lessonId: string) =>
    request<Exercise[]>(`/api/lessons/${lessonId}/exercises`),

  createExercise: (lessonId: string, body: Omit<Exercise, "id" | "lesson_id">) =>
    request<Exercise>(`/api/lessons/${lessonId}/exercises`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  questions: (lessonId: string) =>
    request<QuizQuestion[]>(`/api/lessons/${lessonId}/questions`),

  createQuestion: (
    lessonId: string,
    body: Omit<QuizQuestion, "id" | "lesson_id" | "topic_id">
  ) =>
    request<QuizQuestion>(`/api/lessons/${lessonId}/questions`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
};
