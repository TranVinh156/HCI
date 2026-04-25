const AUTH_KEY = "sign-ocean-authenticated";

export function isLoggedIn() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(AUTH_KEY) === "true";
}

export function loginMock() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_KEY, "true");
}

export function logoutMock() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_KEY);
}
