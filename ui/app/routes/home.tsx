import { ArrowRight, LogIn, LogOut, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";

import { Mascot } from "~/components/learning/mascot";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { isLoggedIn, logoutMock } from "~/lib/auth";
import { profiles } from "~/lib/learning-data";
import { readProgress, selectProfile } from "~/lib/progress";

export default function HomeRoute() {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(profiles[0]?.id ?? "");
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setSelectedId(readProgress().selectedProfileId);
    setLoggedIn(isLoggedIn());
  }, []);

  function chooseProfile(profileId: string) {
    selectProfile(profileId);
    navigate("/learn");
  }

  function handleLogout() {
    logoutMock();
    setLoggedIn(false);
    navigate("/login");
  }

  return (
    <main className="min-h-screen px-4 py-8 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col justify-center gap-8">
        <div className="text-center">
          <div className="mx-auto mb-4 grid size-20 place-items-center rounded-[2rem] bg-sky-600 text-2xl font-black text-white">
            SO
          </div>
          <h1 className="text-4xl font-black sm:text-5xl">SignOcean</h1>
          <p className="mx-auto mt-3 max-w-2xl text-lg font-semibold text-slate-600">
            Learn sign language with visuals, playful quizzes, and Sami.
          </p>
        </div>
        <div className="mx-auto">
          <Mascot message="Choose a profile to start learning today." />
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {profiles.map((profile) => (
            <Card
              key={profile.id}
              className={`rounded-[2rem] bg-white ${
                selectedId === profile.id ? "ring-2 ring-sky-500" : ""
              }`}
            >
              <CardContent className="flex flex-col items-center gap-4 p-5 text-center">
                <button type="button" onClick={() => setSelectedId(profile.id)}>
                  <Avatar className="size-24 bg-sky-600 text-white">
                    <AvatarFallback className="bg-transparent text-4xl font-black text-white">
                      {profile.avatar}
                    </AvatarFallback>
                  </Avatar>
                </button>
                <div>
                  <h2 className="text-2xl font-black">{profile.name}</h2>
                  <p className="text-sm font-semibold text-slate-500">
                    Age {profile.age} · Guardian: {profile.guardian}
                  </p>
                </div>
                <Button
                  onClick={() => chooseProfile(profile.id)}
                  className="h-12 w-full rounded-2xl text-base font-black"
                >
                  Start learning
                  <ArrowRight className="size-5" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {loggedIn ? (
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="h-11 rounded-2xl"
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            ) : (
              <Button asChild variant="outline" className="h-11 rounded-2xl">
                <Link to="/login">
                  <LogIn className="size-4" />
                  Login
                </Link>
              </Button>
            )}
            <Button asChild variant="outline" className="h-11 rounded-2xl">
              <Link to="/register">
                <UserPlus className="size-4" />
                Register
              </Link>
            </Button>
            <Button asChild variant="link" className="h-11 text-cyan-700">
              <Link to="/admin">Open admin</Link>
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
