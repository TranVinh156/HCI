import { request, setToken } from "./request";
import type { TokenResponse, User } from "./types";

export const authApi = {
  register: (body: {
    email: string;
    username: string;
    password: string;
    role?: string;
  }) =>
    request<User>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: async (username: string, password: string) => {
    const res = await request<TokenResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    setToken(res.access_token);
    return res;
  },

  me: () => request<User>("/api/auth/me"),
};
