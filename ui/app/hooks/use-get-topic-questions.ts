import { useQuery } from "@tanstack/react-query";

import { questionsApi } from "~/api/questions";

export function useGetQuestions() {
  return useQuery({
    queryKey: ["quiz", "questions"],
    queryFn: () => questionsApi.list(),
    retry: false,
    staleTime: 3 * 60 * 1000,
  });
}

export function useGetTopicQuestions(topicId?: string) {
  return useQuery({
    queryKey: ["quiz", "topic", topicId ?? "none"],
    queryFn: () => questionsApi.list(topicId),
    enabled: Boolean(topicId),
    retry: false,
    staleTime: 3 * 60 * 1000,
  });
}
