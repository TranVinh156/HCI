import { useQuery } from "@tanstack/react-query";

import { questionsApi } from "~/api/questions";

export function useQuizBank() {
  return useQuery({
    queryKey: ["quiz-bank"],
    queryFn: questionsApi.list,
    retry: false,
    staleTime: 60 * 1000,
  });
}
