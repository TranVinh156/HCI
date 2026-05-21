import { Award, Star, Trophy, Zap } from "lucide-react";

import { badges } from "~/lib/learning-data";
import type { ProgressState } from "~/lib/progress";

type RewardSummaryProps = {
  progress: ProgressState;
  correct: number;
  total: number;
};

export function RewardSummary({ progress, correct, total }: RewardSummaryProps) {
  const earnedBadges = badges.filter((badge) =>
    progress.earnedBadgeIds.includes(badge.id)
  );

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-[1.5rem] bg-white p-5 text-center ring-1 ring-slate-200">
        <Zap className="mx-auto size-8 text-amber-500" />
        <p className="mt-2 text-2xl font-black text-slate-900">{progress.xp}</p>
        <p className="text-sm font-bold text-slate-500">Experience points</p>
      </div>
      <div className="rounded-[1.5rem] bg-white p-5 text-center ring-1 ring-slate-200">
        <Star className="mx-auto size-8 fill-amber-400 text-amber-400" />
        <p className="mt-2 text-2xl font-black text-slate-900">
          {progress.stars}
        </p>
        <p className="text-sm font-bold text-slate-500">Stars</p>
      </div>
      <div className="rounded-[1.5rem] bg-white p-5 text-center ring-1 ring-slate-200">
        <Trophy className="mx-auto size-8 text-emerald-500" />
        <p className="mt-2 text-2xl font-black text-slate-900">
          {correct}/{total}
        </p>
        <p className="text-sm font-bold text-slate-500">Correct answers</p>
      </div>
      <div className="rounded-[1.5rem] bg-white p-5 ring-1 ring-slate-200 sm:col-span-3">
        <div className="mb-3 flex items-center gap-2 text-lg font-black text-slate-900">
          <Award className="size-5 text-primary" />
          Badges
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
            <span className="text-sm font-semibold text-slate-500">
              Complete more lessons to unlock badges.
            </span>
          ) : null}
        </div>
      </div>
    </div>
  );
}
