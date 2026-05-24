import { useQuery } from "@tanstack/react-query";

import { lessonsApi } from "~/api/lessons";

export function useQuizBank() {
  return useQuery({
    queryKey: ["quiz-bank"],
    queryFn: async () => {
      const lessons = await lessonsApi.list();
      const questionGroups = await Promise.all(
        lessons.map(async (lesson) => ({
          lesson,
          questions: await lessonsApi.questions(lesson.id),
        }))
      );

      return questionGroups.flatMap(({ lesson, questions }) =>
        questions.map((question) => ({
          ...question,
          lesson_title: lesson.title,
        }))
      );
    },
    retry: false,
    staleTime: 60 * 1000,
  });
}
