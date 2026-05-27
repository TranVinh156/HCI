import { request } from "./request";
import type { Exercise, Lesson, PaginatedResponse, QuizQuestion } from "./types";

export type LessonListParams = {
  topicId?: string;
  page?: number;
  pageSize?: number;
};

const DEFAULT_LIST_PAGE_SIZE = 10;

function normalizeListParams(input?: string | LessonListParams): LessonListParams {
  return typeof input === "string" ? { topicId: input } : input ?? {};
}

function lessonListPath(input?: string | LessonListParams) {
  const params = normalizeListParams(input);
  const query = new URLSearchParams();

  if (params.topicId) query.set("topic_id", params.topicId);
  if (params.page) query.set("page", String(params.page));
  if (params.pageSize) query.set("page_size", String(params.pageSize));

  const queryString = query.toString();
  return `/api/lessons${queryString ? `?${queryString}` : ""}`;
}

export const lessonsApi = {
  listPage: (params?: string | LessonListParams) =>
    request<PaginatedResponse<Lesson>>(lessonListPath(params)),

  list: (params?: string | LessonListParams) => lessonsApi.listAll(params),

  listAll: async (params?: string | LessonListParams) => {
    const normalized = normalizeListParams(params);
    const pageSize = normalized.pageSize ?? DEFAULT_LIST_PAGE_SIZE;
    const firstPage = await lessonsApi.listPage({
      ...normalized,
      page: normalized.page ?? 1,
      pageSize,
    });

    if (firstPage.pages <= firstPage.page) return firstPage.items;

    const remainingPages = await Promise.all(
      Array.from(
        { length: firstPage.pages - firstPage.page },
        (_, index) => firstPage.page + index + 1
      ).map((page) =>
        lessonsApi.listPage({
          ...normalized,
          page,
          pageSize,
        })
      )
    );

    return [
      ...firstPage.items,
      ...remainingPages.flatMap((page) => page.items),
    ];
  },

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
