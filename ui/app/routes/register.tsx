import { ArrowRight, LockKeyhole, Mail, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { authApi } from "~/api/auth";
import { profilesApi } from "~/api/profiles";

export default function RegisterRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await authApi.register({
        email,
        username,
        password,
      });
      await authApi.login(username, password);

      if (name.trim()) {
        await profilesApi.create({
          name: name.trim(),
          age: null,
          avatar: null,
          guardian_name: null,
        });
      }

      navigate(resolveRedirect(redirectTo), { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to create account");
    } finally {
      setIsSubmitting(false);
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

        <Card className="rounded-[2rem] bg-white/95">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black">Create account</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitRegister}>
              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Learner name
                </span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Minh"
                    className="h-12 rounded-2xl pl-9 font-semibold"
                    autoComplete="name"
                    disabled={isSubmitting}
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-700">Email</span>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="guardian@example.com"
                    className="h-12 rounded-2xl pl-9 font-semibold"
                    autoComplete="email"
                    disabled={isSubmitting}
                    required
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-black text-slate-700">
                  Username
                </span>
                <div className="relative">
                  <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                    placeholder="new.learner"
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
                    placeholder="At least 8 characters"
                    className="h-12 rounded-2xl pl-9 font-semibold"
                    autoComplete="new-password"
                    maxLength={72}
                    minLength={8}
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
                {isSubmitting ? "Creating account..." : "Create account"}
                <ArrowRight className="size-5" />
              </Button>
            </form>

            <div className="mt-5 text-center text-sm font-bold">
              Already have an account?{" "}
              <Link className="text-primary hover:underline" to="/login">
                Log in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

function resolveRedirect(redirectTo: string | null) {
  if (
    redirectTo?.startsWith("/") &&
    !redirectTo.startsWith("//") &&
    !redirectTo.startsWith("/admin")
  ) {
    return redirectTo;
  }

  return "/learn";
}
