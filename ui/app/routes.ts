import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("live", "routes/live.tsx"),
	route("session-analytics", "routes/session-analytics.tsx"),
	route("student-profiles", "routes/student-profiles.tsx"),
	route("ai-configuration", "routes/ai-configuration.tsx"),
] satisfies RouteConfig;
