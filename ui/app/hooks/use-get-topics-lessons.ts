import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "~/api/lessons";

export function useGetTopicLessons(topicId?: string) {
    return useQuery({
        queryKey: ["lessons", "topic", topicId ?? "none"],
        queryFn: () => lessonsApi.list({ topicId: topicId! }),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(topicId),
    });
}

export function useGetTopicLessonsPage(
    topicId?: string,
    page = 1,
    pageSize = 20
) {
    return useQuery({
        queryKey: ["lessons", "topic", topicId ?? "none", "page", page, pageSize],
        queryFn: () =>
            lessonsApi.listPage({
                topicId: topicId!,
                page,
                pageSize,
            }),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(topicId),
    });
}
