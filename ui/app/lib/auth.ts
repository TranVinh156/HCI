import { api, clearToken, getToken, type User } from "./api-client";

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(getToken());
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isLoggedIn()) return null;

  try {
    return await api.auth.me();
  } catch {
    clearToken();
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  clearToken();
}
