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

export function useGetTopicLessonsPage(
    topicId?: string,
    page = 1,
    pageSize = 20
) {
    return useQuery({
        queryKey: ["lessons", topicId ?? "all", "page", page, pageSize],
        queryFn: () =>
            lessonsApi.listPage({
                topicId,
                page,
                pageSize,
            }),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(topicId),
    });
}
