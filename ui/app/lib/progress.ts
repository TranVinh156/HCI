import { badges, lessons, profiles } from "./learning-data";

const STORAGE_KEY = "sign-ocean-progress";

export type LessonAttempt = {
  lessonId: string;
  correct: number;
  total: number;
  completedAt: string;
};

export type ProgressState = {
  selectedProfileId: string;
  completedLessonIds: string[];
  xp: number;
  stars: number;
  streak: number;
  earnedBadgeIds: string[];
  attempts: LessonAttempt[];
};

export function createDefaultProgress(): ProgressState {
  return {
    selectedProfileId: profiles[0]?.id ?? "minh",
    completedLessonIds: [],
    xp: 0,
    stars: 0,
    streak: 1,
    earnedBadgeIds: [],
    attempts: [],
  };
}

export function readProgress(): ProgressState {
  if (typeof window === "undefined") return createDefaultProgress();

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProgress();
    return { ...createDefaultProgress(), ...JSON.parse(raw) };
  } catch {
    return createDefaultProgress();
  }
}

export function writeProgress(progress: ProgressState) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function selectProfile(profileId: string) {
  const next = { ...readProgress(), selectedProfileId: profileId };
  writeProgress(next);
  return next;
}

export function completeLesson(
  lessonId: string,
  correct: number,
  total: number
) {
  const progress = readProgress();
  const lesson = lessons.find((item) => item.id === lessonId);
  const isFirstCompletion = !progress.completedLessonIds.includes(lessonId);
  const completedLessonIds = isFirstCompletion
    ? [...progress.completedLessonIds, lessonId]
    : progress.completedLessonIds;
  const perfect = total > 0 && correct === total;
  const nextBadgeIds = new Set(progress.earnedBadgeIds);

  if (completedLessonIds.length >= 1) nextBadgeIds.add("first-lesson");
  if (completedLessonIds.length >= 3) nextBadgeIds.add("three-lessons");
  if (perfect) nextBadgeIds.add("perfect-quiz");

  const next: ProgressState = {
    ...progress,
    completedLessonIds,
    xp: progress.xp + (isFirstCompletion ? lesson?.xp ?? 10 : 4),
    stars: progress.stars + Math.max(1, Math.ceil((correct / total) * 3)),
    streak: Math.max(progress.streak, 1),
    earnedBadgeIds: badges
      .map((badge) => badge.id)
      .filter((badgeId) => nextBadgeIds.has(badgeId)),
    attempts: [
      ...progress.attempts.filter((attempt) => attempt.lessonId !== lessonId),
      {
        lessonId,
        correct,
        total,
        completedAt: new Date().toISOString(),
      },
    ],
  };

  writeProgress(next);
  return next;
}

export function getLessonStatus(
  lessonId: string,
  orderedLessonIds: string[],
  progress: ProgressState
) {
  if (progress.completedLessonIds.includes(lessonId)) return "completed";
  const index = orderedLessonIds.indexOf(lessonId);
  if (index === 0) return "current";
  const previousId = orderedLessonIds[index - 1];
  return progress.completedLessonIds.includes(previousId) ? "current" : "locked";
}

export function getSelectedProfile(progress: ProgressState) {
  return (
    profiles.find((profile) => profile.id === progress.selectedProfileId) ??
    profiles[0]
  );
}
