import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { lessonsApi } from "~/api/lessons";
import { profilesApi } from "~/api/profiles";
import { progressApi } from "~/api/progress";
import type { Progress } from "~/api/types";

export function useProgressData() {
  return useQuery({
    queryKey: ["progress-data"],
    queryFn: async () => {
      const [profiles, lessons] = await Promise.all([
        profilesApi.list(),
        lessonsApi.list(),
      ]);
      const profile = profiles[0] ?? null;
      const progress = profile ? await progressApi.get(profile.id) : null;

      return { profile, progress, lessons };
    },
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      lessonId,
      correct,
      total,
    }: {
      profileId: string;
      lessonId: string;
      correct: number;
      total: number;
    }) => progressApi.complete(profileId, lessonId, correct, total),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["progress-data"] });
      void queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function getLessonStatus(
  lessonId: string,
  orderedLessonIds: string[],
  progress: Progress | null | undefined
) {
  const completedLessonIds = progress?.completed_lesson_ids ?? [];
  if (completedLessonIds.includes(lessonId)) return "completed";
  const index = orderedLessonIds.indexOf(lessonId);
  if (index === 0) return "current";
  const previousId = orderedLessonIds[index - 1];
  return completedLessonIds.includes(previousId) ? "current" : "locked";
}
