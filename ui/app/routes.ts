import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
	layout("routes/auth-layout.tsx", [route("login", "routes/login.tsx")]),
	layout("routes/app-layout.tsx", [
		index("routes/home.tsx"),
		route("live", "routes/live.tsx"),
		route("session-analytics", "routes/session-analytics.tsx"),
		route("student-profiles", "routes/student-profiles.tsx"),
		route("ai-configuration", "routes/ai-configuration.tsx"),
		route("school-overview", "routes/school-overview.tsx"),
	]),
] satisfies RouteConfig;
