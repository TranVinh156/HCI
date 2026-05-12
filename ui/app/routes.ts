import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("learn", "routes/learn.tsx"),
  route("translate", "routes/translate.tsx"),
  route("communication", "routes/communication.tsx"),
  route("practice", "routes/practice.tsx"),
  route("path/:topicId", "routes/path.$topicId.tsx"),
  route("lesson/:lessonId", "routes/lesson.$lessonId.tsx"),
  route("quiz/:lessonId", "routes/quiz.$lessonId.tsx"),
  route("result/:lessonId", "routes/result.$lessonId.tsx"),
  route("profile", "routes/profile.tsx"),
  route("admin", "routes/admin.tsx"),
  route("admin/overview", "routes/admin.overview.tsx"),
  route("admin/content", "routes/admin.content.tsx"),
  route("admin/topics", "routes/admin.topics.tsx"),
  route("admin/lessons", "routes/admin.lessons.tsx"),
  route("admin/quizzes", "routes/admin.quizzes.tsx"),
  route("admin/reports", "routes/admin.reports.tsx"),
] satisfies RouteConfig;
