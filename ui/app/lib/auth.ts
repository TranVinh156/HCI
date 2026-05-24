import { authApi } from "~/api/auth";
import { clearToken, getToken } from "~/api/request";
import type { User } from "~/api/types";

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return Boolean(getToken());
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isLoggedIn()) return null;

  try {
    return await authApi.me();
  } catch {
    clearToken();
    return null;
  }
}

export function logout() {
  if (typeof window === "undefined") return;
  clearToken();
}
