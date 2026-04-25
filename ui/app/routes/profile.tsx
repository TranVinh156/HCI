import { Award, BookOpen, Star, Zap } from "lucide-react";
import { useEffect, useState } from "react";

import { OceanProgress } from "~/components/learning/ocean-progress";
import { StudentShell } from "~/components/learning/student-shell";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { badges, lessons } from "~/lib/learning-data";
import {
  getSelectedProfile,
  readProgress,
  type ProgressState,
} from "~/lib/progress";

export default function ProfileRoute() {
  const [progress, setProgress] = useState<ProgressState>(() => readProgress());

  useEffect(() => {
    setProgress(readProgress());
  }, []);

  const profile = getSelectedProfile(progress);
  const completion = Math.round(
    (progress.completedLessonIds.length / lessons.length) * 100
  );
  const earnedBadges = badges.filter((badge) =>
    progress.earnedBadgeIds.includes(badge.id)
  );

  return (
    <StudentShell>
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-[2rem] bg-white p-6 text-center shadow-sm ring-1 ring-cyan-100">
          <Avatar className="mx-auto size-28 bg-gradient-to-br from-cyan-300 to-sky-600 text-white">
            <AvatarFallback className="bg-transparent text-5xl font-black text-white">
              {profile?.avatar}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-3xl font-black">{profile?.name}</h1>
          <p className="font-semibold text-slate-500">
            Age {profile?.age} · Guardian: {profile?.guardian}
          </p>
          <OceanProgress className="mt-6" value={completion} label="Completed" />
        </aside>
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Lessons done", value: progress.completedLessonIds.length, icon: BookOpen },
              { label: "XP", value: progress.xp, icon: Zap },
              { label: "Stars", value: progress.stars, icon: Star },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-cyan-100"
                >
                  <Icon className="size-7 text-cyan-700" />
                  <p className="mt-3 text-3xl font-black">{item.value}</p>
                  <p className="text-sm font-bold text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-[1.5rem] bg-white p-5 shadow-sm ring-1 ring-cyan-100">
            <div className="mb-4 flex items-center gap-2">
              <Award className="size-5 text-amber-500" />
              <h2 className="text-xl font-black">Badges</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((badge) => (
                <span
                  key={badge.id}
                  className="rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-800"
                >
                  {badge.title}
                </span>
              ))}
              {earnedBadges.length === 0 ? (
                <p className="font-semibold text-slate-500">
                  No badges yet. Complete your first lesson to earn one.
                </p>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </StudentShell>
  );
}
