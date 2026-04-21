import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ACCOUNT_ROLES, getRoleMeta, useAuth } from "../auth";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";

export function meta() {
  return [
    { title: "Login | The Insightful Lens" },
    {
      name: "description",
      content: "Sign in to the classroom monitoring dashboard.",
    },
  ];
}

export default function LoginRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const redirectTo = searchParams.get("redirectTo");
  const nextPath = redirectTo && redirectTo.startsWith("/") ? redirectTo : "/";

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const result = login(username, password);
    if (!result.ok) {
      setError(result.error ?? "Khong the dang nhap voi thong tin hien tai.");
      return;
    }

    setError("");
    navigate(nextPath, { replace: true });
  }

  return (
    <Card className="w-full max-w-xl overflow-hidden">
      <CardHeader className="space-y-3 border-b border-slate-100 bg-slate-50/60 p-7 sm:p-8">
        <Badge variant="secondary" className="self-start rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.24em]">
          The Insightful Lens
        </Badge>
        <CardTitle className="font-headline text-3xl font-extrabold tracking-tight text-slate-800">
          Dang nhap he thong
        </CardTitle>
        <CardDescription className="text-sm text-slate-500">
          Username hop le: <span className="font-semibold text-slate-700">student</span>,{" "}
          <span className="font-semibold text-slate-700">teacher</span>,{" "}
          <span className="font-semibold text-slate-700">faculty</span>,{" "}
          <span className="font-semibold text-slate-700">student_affair_officer</span>. Mat khau nhap bat ky.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5 p-7 sm:p-8">
        <div className="grid gap-2 sm:grid-cols-2">
        {ACCOUNT_ROLES.map((role) => {
          const meta = getRoleMeta(role);
          const isActive = username === role;
          return (
            <Button
              key={role}
              type="button"
              onClick={() => setUsername(role)}
              variant={isActive ? "secondary" : "outline"}
              className="h-auto flex-col items-start gap-0 rounded-xl px-3 py-2.5"
            >
              <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{role}</p>
            </Button>
          );
        })}
        </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <Input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="student | teacher | faculty | student_affair_officer"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <Input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap bat ky mat khau nao"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full"
        >
          <span className="material-symbols-outlined text-base">login</span>
          Dang nhap
        </Button>
      </form>

      <p className="mt-5 text-xs text-slate-500">Tai khoan demo duoc cap san theo role username.</p>
      </CardContent>
    </Card>
  );
}
