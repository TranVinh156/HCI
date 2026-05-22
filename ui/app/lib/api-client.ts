const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const TOKEN_KEY = "sign-ocean-token";

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "API error");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export const api = {
  auth: {
    register: (body: { email: string; username: string; password: string; role?: string }) =>
      request<{ id: string; email: string; username: string; role: string }>("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),

    login: async (username: string, password: string) => {
      const res = await request<{ access_token: string }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });
      setToken(res.access_token);
      return res;
    },

    me: () => request<{ id: string; email: string; username: string; role: string }>("/api/auth/me"),

    logout: () => clearToken(),
  },

  // ── Profiles ────────────────────────────────────────────────────────────────

  profiles: {
    list: () => request<StudentProfile[]>("/api/profiles"),
    create: (body: Omit<StudentProfile, "id" | "user_id">) =>
      request<StudentProfile>("/api/profiles", { method: "POST", body: JSON.stringify(body) }),
    get: (id: string) => request<StudentProfile>(`/api/profiles/${id}`),
    update: (id: string, body: Partial<Omit<StudentProfile, "id" | "user_id">>) =>
      request<StudentProfile>(`/api/profiles/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/api/profiles/${id}`, { method: "DELETE" }),
  },

  // ── Topics ──────────────────────────────────────────────────────────────────

  topics: {
    list: () => request<Topic[]>("/api/topics"),
    get: (id: string) => request<Topic>(`/api/topics/${id}`),
    create: (body: Omit<Topic, "id" | "lesson_count">) =>
      request<Topic>("/api/topics", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Omit<Topic, "id">>) =>
      request<Topic>(`/api/topics/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/api/topics/${id}`, { method: "DELETE" }),
  },

  // ── Lessons ─────────────────────────────────────────────────────────────────

  lessons: {
    list: (topicId?: string) =>
      request<Lesson[]>(`/api/lessons${topicId ? `?topic_id=${topicId}` : ""}`),
    get: (id: string) => request<Lesson>(`/api/lessons/${id}`),
    create: (body: Omit<Lesson, "id">) =>
      request<Lesson>("/api/lessons", { method: "POST", body: JSON.stringify(body) }),
    update: (id: string, body: Partial<Omit<Lesson, "id">>) =>
      request<Lesson>(`/api/lessons/${id}`, { method: "PUT", body: JSON.stringify(body) }),
    delete: (id: string) => request<void>(`/api/lessons/${id}`, { method: "DELETE" }),

    exercises: (lessonId: string) => request<Exercise[]>(`/api/lessons/${lessonId}/exercises`),
    createExercise: (lessonId: string, body: Omit<Exercise, "id" | "lesson_id">) =>
      request<Exercise>(`/api/lessons/${lessonId}/exercises`, { method: "POST", body: JSON.stringify(body) }),

    questions: (lessonId: string) => request<QuizQuestion[]>(`/api/lessons/${lessonId}/questions`),
    createQuestion: (lessonId: string, body: Omit<QuizQuestion, "id" | "lesson_id">) =>
      request<QuizQuestion>(`/api/lessons/${lessonId}/questions`, { method: "POST", body: JSON.stringify(body) }),
  },

  // ── Progress ─────────────────────────────────────────────────────────────────

  progress: {
    get: (profileId: string) => request<Progress>(`/api/progress/${profileId}`),
    complete: (profileId: string, lessonId: string, correct: number, total: number) =>
      request<Badge[]>(`/api/progress/${profileId}/complete`, {
        method: "POST",
        body: JSON.stringify({ lesson_id: lessonId, correct, total }),
      }),
  },

  // ── Translate (sign recognition) ─────────────────────────────────────────────

  translate: {
    signToText: (image: string, kind: "alphabet" | "word" = "alphabet") =>
      request<TranslateResult>("/api/translate/sign-to-text", {
        method: "POST",
        body: JSON.stringify({ image, kind }),
      }),
  },

  // ── Reports ──────────────────────────────────────────────────────────────────

  reports: {
    overview: () => request<OverviewStats>("/api/reports/overview"),
    students: () => request<StudentStat[]>("/api/reports/students"),
    student: (profileId: string) => request<StudentDetail>(`/api/reports/students/${profileId}`),
    lessons: () => request<LessonStat[]>("/api/reports/lessons"),
  },
};

// ── Types ─────────────────────────────────────────────────────────────────────

export type StudentProfile = { id: string; user_id: string; name: string; age: number | null; avatar: string | null; guardian_name: string | null };
export type Topic = { id: string; title: string; description: string | null; icon: string | null; color: string | null; sort_order: number; lesson_count: number };
export type Lesson = { id: string; topic_id: string; type: string; title: string; phrase: string | null; description: string | null; visual: string | null; sign_hint: string | null; difficulty: string; xp: number; sort_order: number };
export type Exercise = { id: string; lesson_id: string; type: string; content: Record<string, unknown>; sort_order: number };
export type QuizQuestion = { id: string; lesson_id: string; prompt: string; type: string; options: string[]; answer: string; hint: string | null };
export type Badge = { id: string; slug: string; title: string; description: string | null; icon: string | null };
export type Progress = { student_profile_id: string; xp: number; stars: number; streak: number; completed_lesson_ids: string[]; earned_badges: Badge[]; attempts: { lesson_id: string; correct: number; total: number; completed_at: string }[] };
export type OverviewStats = { total_students: number; total_topics: number; total_lessons: number; total_questions: number; total_attempts: number };
export type StudentStat = { profile_id: string; name: string; xp: number; stars: number; completed_lessons: number; streak: number };
export type LessonStat = { lesson_id: string; title: string; topic_title: string; attempt_count: number; avg_score: number };
export type StudentDetail = { profile_id: string; name: string; xp: number; stars: number; streak: number; completed_lessons: number; total_attempts: number; avg_accuracy: number };
export type TranslateResult = {
  kind: string;
  label: string;
  confidence: number;
  top_k: { label: string; confidence: number }[];
  model_loaded: boolean;
};
