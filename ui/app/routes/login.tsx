import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { loginMock } from "~/lib/auth";

const demoLogin = {
  username: "demo.child",
  password: "sign-ocean-123",
};

export default function LoginRoute() {
  const navigate = useNavigate();
  const [username, setUsername] = useState(demoLogin.username);
  const [password, setPassword] = useState(demoLogin.password);

  function submitLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    loginMock();
    navigate("/learn");
  }

  return (
    <main className="min-h-screen bg-cyan-50 px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-md flex-col justify-center">
        <Link to="/" className="mx-auto mb-6 flex items-center gap-2">
          <div className="grid size-11 place-items-center rounded-2xl bg-sky-600 text-lg font-black text-white">
            SO
          </div>
          <span className="text-xl font-black">SignOcean</span>
        </Link>

        <Card className="rounded-[2rem] border-cyan-100 bg-white/95 shadow-xl shadow-cyan-100/70">
          <CardHeader className="text-center">
            <Badge className="mx-auto mb-2 h-8 bg-cyan-100 px-3 text-cyan-800">
              Demo login
            </Badge>
            <CardTitle className="text-3xl font-black">Welcome back</CardTitle>
            <CardDescription className="text-base font-semibold">
              The fields are prefilled for quick testing. Authentication is not
              enabled yet.
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
                  />
                </div>
              </label>

              <Button className="h-13 w-full rounded-2xl text-base font-black">
                Continue to app
                <ArrowRight className="size-5" />
              </Button>
            </form>

            <div className="mt-5 flex items-center justify-between text-sm font-bold">
              <Link className="text-cyan-700 hover:underline" to="/">
                Choose profile
              </Link>
              <Link className="text-cyan-700 hover:underline" to="/register">
                Create account
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
