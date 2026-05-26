import { useQuery } from "@tanstack/react-query";

import { lessonsApi } from "~/api/lessons";

export function useQuizBank() {
  return useQuery({
    queryKey: ["quiz-bank"],
    queryFn: async () => {
      const lessons = await lessonsApi.listAll({ pageSize: 100 });

      return lessons.flatMap((lesson) =>
        (lesson.questions ?? []).map((question) => ({
          ...question,
          lesson_title: lesson.title,
        }))
      );
    },
    retry: false,
    staleTime: 60 * 1000,
  });
}
