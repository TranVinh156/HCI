import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "~/api/lessons";

export function useGetTopicLessons(topicId?: string) {
    return useQuery({
        queryKey: ["lessons", topicId ?? "all"],
        queryFn: () => lessonsApi.list(topicId),
        staleTime: 3 * 60 * 1000,
        retry: false,
    });
}