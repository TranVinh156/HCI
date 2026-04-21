import { createContext, useContext, useEffect, useMemo, useState } from "react";

export const ACCOUNT_ROLES = [
  "student",
  "teacher",
  "faculty",
  "student_affair_officer",
] as const;

export type AccountRole = (typeof ACCOUNT_ROLES)[number];

export type AuthSession = {
  username: AccountRole;
  role: AccountRole;
  label: string;
  description: string;
  signedInAt: string;
};

type AuthResult = {
  ok: boolean;
  error?: string;
};

type AuthContextValue = {
  isHydrated: boolean;
  isAuthenticated: boolean;
  user: AuthSession | null;
  availableRoles: typeof ACCOUNT_ROLES;
  login: (username: string, password: string) => AuthResult;
  register: (username: string, password: string) => AuthResult;
  logout: () => void;
};

type RoleMeta = {
  label: string;
  description: string;
};

const AUTH_STORAGE_KEY = "insightful-lens-auth-session";

const ROLE_META: Record<AccountRole, RoleMeta> = {
  student: {
    label: "Student",
    description: "Sinh vien truy cap thong tin lop hoc va phien hoc.",
  },
  teacher: {
    label: "Teacher",
    description: "Giang vien quan sat lop hoc va phan tich theo tiet hoc.",
  },
  faculty: {
    label: "Faculty",
    description: "Khoa vien theo doi tong quan cac lop thuoc don vi.",
  },
  student_affair_officer: {
    label: "Student Affair Officer",
    description: "Can bo cong tac sinh vien theo doi tinh hinh hoc tap.",
  },
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(value: string): AccountRole | null {
  const normalized = value.trim().toLowerCase();
  return ACCOUNT_ROLES.find((role) => role === normalized) ?? null;
}

function buildSession(role: AccountRole): AuthSession {
  return {
    username: role,
    role,
    label: ROLE_META[role].label,
    description: ROLE_META[role].description,
    signedInAt: new Date().toISOString(),
  };
}

function persistSession(session: AuthSession | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function readPersistedSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<AuthSession>;
    const role = normalizeRole(parsed.role ?? "");
    if (!role) {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
      return null;
    }

    return buildSession(role);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
}

export function getRoleMeta(role: AccountRole): RoleMeta {
  return ROLE_META[role];
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthSession | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setUser(readPersistedSession());
    setIsHydrated(true);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      isHydrated,
      isAuthenticated: user !== null,
      user,
      availableRoles: ACCOUNT_ROLES,
      login: (username: string, password: string) => {
        if (!password.trim()) {
          return {
            ok: false,
            error: "Mat khau duoc phep bat ky, nhung khong nen de trong.",
          };
        }

        const role = normalizeRole(username);
        if (!role) {
          return {
            ok: false,
            error:
              "Username hop le hien tai chi gom: student, teacher, faculty, student_affair_officer.",
          };
        }

        const nextSession = buildSession(role);
        setUser(nextSession);
        persistSession(nextSession);
        return { ok: true };
      },
      register: (username: string, password: string) => {
        if (!password.trim()) {
          return {
            ok: false,
            error: "Mat khau duoc phep bat ky, nhung khong nen de trong.",
          };
        }

        const role = normalizeRole(username);
        if (!role) {
          return {
            ok: false,
            error:
              "Dang ky tam thoi chi ho tro username bang loai tai khoan: student, teacher, faculty, student_affair_officer.",
          };
        }

        const nextSession = buildSession(role);
        setUser(nextSession);
        persistSession(nextSession);
        return { ok: true };
      },
      logout: () => {
        setUser(null);
        persistSession(null);
      },
    }),
    [isHydrated, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
