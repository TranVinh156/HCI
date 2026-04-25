import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("learn", "routes/learn.tsx"),
  route("topics", "routes/topics.tsx"),
  route("path/:topicId", "routes/path.$topicId.tsx"),
  route("lesson/:lessonId", "routes/lesson.$lessonId.tsx"),
  route("quiz/:lessonId", "routes/quiz.$lessonId.tsx"),
  route("result/:lessonId", "routes/result.$lessonId.tsx"),
  route("profile", "routes/profile.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
