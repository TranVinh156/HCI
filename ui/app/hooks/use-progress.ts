import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profilesApi } from "~/api/profiles";
import { progressApi } from "~/api/progress";
import type { Lesson, Progress, TopicProgress } from "~/api/types";

function markLessonCompleted(
  progress: Progress | null | undefined,
  lessonId: string
) {
  if (!progress || progress.completed_lesson_ids.includes(lessonId)) {
    return progress;
  }

  return {
    ...progress,
    completed_lesson_ids: [...progress.completed_lesson_ids, lessonId],
  };
}

function markLessonCompletedInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  lessonId: string
) {
  queryClient.setQueryData<{
    profile: unknown;
    progress: Progress | null;
  } | null>(["progress-data"], (current) => {
    if (!current) return current;

    return {
      ...current,
      progress: markLessonCompleted(current.progress, lessonId) ?? null,
    };
  });

  queryClient.setQueryData<{
    user: unknown;
    profile: unknown;
    progress: Progress | null;
  } | null>(["profile-data"], (current) => {
    if (!current) return current;

    return {
      ...current,
      progress: markLessonCompleted(current.progress, lessonId) ?? null,
    };
  });
}

export function useProgressData() {
  return useQuery({
    queryKey: ["progress-data"],
    queryFn: async () => {
      const profiles = await profilesApi.list();
      const profile = profiles[0] ?? null;
      const progress = profile ? await progressApi.get(profile.id) : null;

      return { profile, progress };
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
    onMutate: (variables) => {
      markLessonCompletedInCache(queryClient, variables.lessonId);
    },
    onSuccess: (_badges, variables) => {
      markLessonCompletedInCache(queryClient, variables.lessonId);

      void queryClient.invalidateQueries({
        queryKey: ["progress-data"],
        refetchType: "active",
      });
      void queryClient.invalidateQueries({
        queryKey: ["profile-data"],
        refetchType: "active",
      });
    },
    onError: () => {
      void queryClient.invalidateQueries({ queryKey: ["progress-data"] });
      void queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function useTopicQuizAttempts(profileId?: string, topicId?: string) {
  return useQuery({
    queryKey: ["topic-quiz-attempts", profileId ?? "none", topicId ?? "none"],
    queryFn: () => progressApi.listTopicQuizAttempts(profileId!, topicId!),
    enabled: Boolean(profileId && topicId),
    retry: false,
    staleTime: 60 * 1000,
  });
}

export function useCompleteTopicQuiz() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      profileId,
      topicId,
      correct,
      total,
    }: {
      profileId: string;
      topicId: string;
      correct: number;
      total: number;
    }) => progressApi.completeTopicQuiz(profileId, topicId, correct, total),
    onSuccess: (_attempt, variables) => {
      void queryClient.invalidateQueries({
        queryKey: [
          "topic-quiz-attempts",
          variables.profileId,
          variables.topicId,
        ],
      });
      void queryClient.invalidateQueries({ queryKey: ["progress-data"] });
      void queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function getLessonStatus(
  lessonId: string,
  orderedLessonIds: string[],
  progress: Progress | null | undefined,
  topicProgress?: TopicProgress | null
) {
  const index = orderedLessonIds.indexOf(lessonId);
  if (index < 0) return "locked";

  if (topicProgress) {
    if (index < topicProgress.completed_lesson_count) return "completed";
    if (index === topicProgress.completed_lesson_count) return "current";
    return "locked";
  }

  const completedLessonIds = progress?.completed_lesson_ids ?? [];
  if (completedLessonIds.includes(lessonId)) return "completed";
  if (index === 0) return "current";
  const previousId = orderedLessonIds[index - 1];
  return completedLessonIds.includes(previousId) ? "current" : "locked";
}

export function getTopicProgress(
  progress: Progress | null | undefined,
  topicId: string
) {
  return progress?.topic_progress.find((item) => item.topic_id === topicId) ?? null;
}

export function getLessonStatusFromNeighbors(
  lesson: Lesson,
  progress: Progress | null | undefined
) {
  const completedLessonIds = progress?.completed_lesson_ids ?? [];
  if (completedLessonIds.includes(lesson.id)) return "completed";
  if (!lesson.previous_lesson_id) return "current";
  return completedLessonIds.includes(lesson.previous_lesson_id)
    ? "current"
    : "locked";
}
