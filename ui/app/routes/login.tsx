import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useCurrentUser, useLogin } from "~/hooks/use-auth";

export default function LoginRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const registerTo = redirectTo
    ? `/register?redirectTo=${encodeURIComponent(redirectTo)}`
    : "/register";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const loginMutation = useLogin();
  const { data: currentUser } = useCurrentUser();
  const isSubmitting = loginMutation.isPending;

  useEffect(() => {
    if (!currentUser) return;
    navigate(resolveRedirect(redirectTo, currentUser.role), { replace: true });
  }, [currentUser, navigate, redirectTo]);

  async function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    try {
      const user = await loginMutation.mutateAsync({ username, password });
      navigate(resolveRedirect(redirectTo, user.role), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to log in");
    }
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <Link to="/" className="mx-auto mb-6 flex items-center gap-2">
          <div className="grid size-11 place-items-center rounded-2xl bg-primary text-lg font-black text-white">
            SO
          </div>
          <span className="text-xl font-black">SignOcean</span>
        </Link>

        <Card className="rounded-[2rem] border-slate-200 bg-white/95">
          <CardHeader className="text-center">

            <CardTitle className="text-3xl font-black">Welcome back</CardTitle>
            <CardDescription className="text-base font-semibold">
              Use your SignOcean account to continue learning.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitLogin}>
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Username
                </span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    className="h-12 rounded-2xl pl-9 font-semibold"
                    autoComplete="username"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Password
                </span>
                <div className="relative">
                  <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="h-12 rounded-2xl pl-9 font-semibold"
                    autoComplete="current-password"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </label>

              {error && (
                <p className="rounded-2xl border-2 border-rose-200 bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">
                  {error}
                </p>
              )}

              <Button
                className="h-13 w-full rounded-2xl text-base font-black"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing in..." : "Continue to app"}
                <ArrowRight className="size-5" />
              </Button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm font-bold">
              <Link className="text-primary hover:underline" to="/">
                Choose profile
              </Link>
              <Link className="text-primary hover:underline" to={registerTo}>
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function resolveRedirect(redirectTo: string | null, role: string) {
  if (redirectTo?.startsWith("/") && !redirectTo.startsWith("//")) {
    if (redirectTo.startsWith("/admin") && role !== "admin") return "/learn";
    return redirectTo;
  }

  return role === "admin" ? "/admin" : "/learn";
}
