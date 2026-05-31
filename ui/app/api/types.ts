export type UserRole = "admin" | "guardian";

export type User = {
  id: string;
  email: string;
  username: string;
  role: UserRole;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export type StudentProfile = {
  id: string;
  user_id: string;
  name: string;
  age: number | null;
  avatar: string | null;
  guardian_name: string | null;
};

export type Topic = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  sort_order: number;
  lesson_count: number;
};

export type Exercise = {
  id: string;
  lesson_id: string;
  type: string;
  content: Record<string, unknown>;
  sort_order: number;
};

export type QuizQuestion = {
  id: string;
  lesson_id: string;
  topic_id: string;
  prompt: string;
  type: string;
  options: string[];
  answer: string;
  video_url: string | null;
  hint: string | null;
};

export type TopicQuizAttempt = {
  id: string;
  student_profile_id: string;
  topic_id: string;
  correct: number;
  total: number;
  completed_at: string;
};

export type TopicProgress = {
  topic_id: string;
  last_completed_lesson_id: string | null;
  completed_lesson_count: number;
  total_lessons: number;
  completion_percentage: number;
};

export type Lesson = {
  id: string;
  topic_id: string;
  type: string;
  title: string;
  phrase: string | null;
  description: string | null;
  visual: string | null;
  sign_hint: string | null;
  difficulty: string;
  xp: number;
  sort_order: number;
  exercises?: Exercise[];
  questions?: QuizQuestion[];
  previous_lesson_id?: string | null;
  next_lesson_id?: string | null;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  pages: number;
};

export type Badge = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  icon: string | null;
};

export type Progress = {
  student_profile_id: string;
  xp: number;
  stars: number;
  streak: number;
  total_lessons: number;
  completion_percentage: number;
  completed_lesson_ids: string[];
  topic_progress: TopicProgress[];
  earned_badges: Badge[];
  attempts: {
    lesson_id: string;
    lesson_title: string | null;
    correct: number;
    total: number;
    completed_at: string;
  }[];
};

export type OverviewStats = {
  total_students: number;
  total_topics: number;
  total_lessons: number;
  total_questions: number;
  total_attempts: number;
};

export type StudentStat = {
  profile_id: string;
  name: string;
  xp: number;
  stars: number;
  completed_lessons: number;
  streak: number;
};

export type LessonStat = {
  lesson_id: string;
  title: string;
  topic_title: string;
  attempt_count: number;
  avg_score: number;
};

export type StudentDetail = {
  profile_id: string;
  name: string;
  xp: number;
  stars: number;
  streak: number;
  completed_lessons: number;
  total_attempts: number;
  avg_accuracy: number;
};

export type TranslateResult = {
  kind: string;
  label: string;
  confidence: number;
  top_k: { label: string; confidence: number }[];
  model_loaded: boolean;
};

export type GeminiSignGradeResult = {
  expected_label: string;
  is_correct: boolean;
  confidence: number;
  reasoning: string;
};
