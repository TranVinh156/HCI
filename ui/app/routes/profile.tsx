import { Award, BookOpen, Clock, Star, Target, Zap } from "lucide-react";

import { OceanProgress } from "~/components/learning/ocean-progress";
import { StudentShell } from "~/components/learning/student-shell";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Badge } from "~/components/ui/badge";
import { useProfileData } from "~/hooks/use-profile-data";

export default function ProfileRoute() {
  const { data, error, isLoading } = useProfileData();
  const user = data?.user ?? null;
  const profile = data?.profile ?? null;
  const progress = data?.progress ?? null;
  const lessons = data?.lessons ?? [];

  const completedLessonIds = progress?.completed_lesson_ids ?? [];
  const completion = Math.round(
    (completedLessonIds.length / Math.max(lessons.length, 1)) * 100
  );
  const earnedBadges = progress?.earned_badges ?? [];
  const attempts = progress?.attempts ?? [];
  const totalCorrect = attempts.reduce(
    (sum, attempt) => sum + attempt.correct,
    0
  );
  const totalQuestions = attempts.reduce(
    (sum, attempt) => sum + attempt.total,
    0
  );
  const accuracy =
    totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const lessonTitleById = new Map(lessons.map((lesson) => [lesson.id, lesson.title]));
  const displayName = profile?.name ?? user?.username ?? "Learner";
  const avatarLabel = getAvatarLabel(profile?.avatar, displayName);

  return (
    <StudentShell>
      {isLoading ? (
        <p className="rounded-[1.5rem] bg-white p-5 font-bold text-slate-600 ring-1 ring-slate-200">
          Loading profile...
        </p>
      ) : error ? (
        <p className="rounded-[1.5rem] border border-rose-200 bg-rose-50 p-5 font-bold text-rose-700">
          {error instanceof Error ? error.message : "Unable to load profile"}
        </p>
      ) : (
      <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr]">
        <aside className="rounded-[2rem] bg-white p-6 text-center ring-1 ring-slate-200">
          <Avatar className="mx-auto size-28 bg-primary text-white">
            <AvatarFallback className="bg-transparent text-5xl font-black text-white">
              {avatarLabel}
            </AvatarFallback>
          </Avatar>
          <h1 className="mt-4 text-3xl font-black">{displayName}</h1>
          {profile ? (
            <p className="font-semibold text-slate-500">
              {profile.age ? `Age ${profile.age}` : "Age not set"} · Guardian:{" "}
              {profile.guardian_name ?? user?.username ?? "Not set"}
            </p>
          ) : (
            <p className="font-semibold text-slate-500">
              {user?.email ?? "No student profile has been created yet."}
            </p>
          )}
          <OceanProgress className="mt-6" value={completion} label="Completed" />
        </aside>
        <section className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Lessons done", value: completedLessonIds.length, icon: BookOpen },
              { label: "XP", value: progress?.xp ?? 0, icon: Zap },
              { label: "Stars", value: progress?.stars ?? 0, icon: Star },
              { label: "Accuracy", value: `${accuracy}%`, icon: Target },
              { label: "Study time", value: `${Math.max(completedLessonIds.length * 6, 0)}m`, icon: Clock },
              { label: "Streak", value: progress?.streak ?? 0, icon: Award },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200"
                >
                  <Icon className="size-7 text-primary" />
                  <p className="mt-3 text-3xl font-black">{item.value}</p>
                  <p className="text-sm font-bold text-slate-500">{item.label}</p>
                </div>
              );
            })}
          </div>
          <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
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
          <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200">
            <div className="mb-4 flex items-center gap-2">
              <Clock className="size-5 text-primary" />
              <h2 className="text-xl font-black">Learning history</h2>
            </div>
            <div className="space-y-3">
              {attempts.length > 0 ? (
                attempts
                  .slice()
                  .reverse()
                  .map((attempt) => {
                    const attemptAccuracy = Math.round(
                      (attempt.correct / attempt.total) * 100
                    );

                    return (
                      <div
                        key={`${attempt.lesson_id}-${attempt.completed_at}`}
                        className="flex flex-col gap-2 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="font-black text-slate-900">
                            {lessonTitleById.get(attempt.lesson_id) ?? "Unknown lesson"}
                          </p>
                          <p className="text-sm font-semibold text-slate-500">
                            {attempt.correct}/{attempt.total} correct
                          </p>
                        </div>
                        <Badge
                          className={
                            attemptAccuracy >= 80
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }
                        >
                          {attemptAccuracy}%
                        </Badge>
                      </div>
                    );
                  })
              ) : (
                <p className="font-semibold text-slate-500">
                  No quiz attempts yet. Finish a practice quiz to see history.
                </p>
              )}
            </div>
          </div>
        </section>
      </div>
      )}
    </StudentShell>
  );
}

function getAvatarLabel(avatar: string | null | undefined, name: string) {
  if (avatar?.trim()) return avatar.trim();

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";
}
