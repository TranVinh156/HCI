import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { ACCOUNT_ROLES, getRoleMeta, useAuth } from "../auth";

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
    <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-8">
      <div className="mb-6 space-y-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-slate-500">The Insightful Lens</p>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight text-slate-800">Dang nhap he thong</h1>
        <p className="text-sm text-slate-500">
          Username hop le: <span className="font-semibold text-slate-700">student</span>,{" "}
          <span className="font-semibold text-slate-700">teacher</span>,{" "}
          <span className="font-semibold text-slate-700">faculty</span>,{" "}
          <span className="font-semibold text-slate-700">student_affair_officer</span>. Mat khau nhap bat ky.
        </p>
      </div>

      <div className="mb-5 grid gap-2 sm:grid-cols-2">
        {ACCOUNT_ROLES.map((role) => {
          const meta = getRoleMeta(role);
          const isActive = username === role;
          return (
            <button
              key={role}
              type="button"
              onClick={() => setUsername(role)}
              className={`rounded-xl border px-3 py-2.5 text-left transition ${
                isActive
                  ? "border-sky-300 bg-sky-50"
                  : "border-slate-200 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/60"
              }`}
            >
              <p className="text-sm font-semibold text-slate-800">{meta.label}</p>
              <p className="mt-0.5 text-xs text-slate-500">{role}</p>
            </button>
          );
        })}
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Username</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="student | teacher | faculty | student_affair_officer"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Nhap bat ky mat khau nao"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-300 focus:ring-2 focus:ring-sky-200"
          />
        </label>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-br from-primary to-primary-container text-on-primary px-4 py-2.5 text-sm font-semibold transition hover:opacity-90 active:scale-[0.99]"
        >
          <span className="material-symbols-outlined text-base">login</span>
          Dang nhap
        </button>
      </form>

      <p className="mt-5 text-xs text-slate-500">Tai khoan demo duoc cap san theo role username.</p>
    </section>
  );
}
