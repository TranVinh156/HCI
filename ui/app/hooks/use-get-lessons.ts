import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { lessonsApi, type LessonListParams } from "~/api/lessons";

export function useGetLessons(
    params?: LessonListParams,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ["lessons", "list", params ?? {}],
        queryFn: () => lessonsApi.list(params),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: options?.enabled ?? true,
    })
}

export function useGetLessonsPage(
    params?: LessonListParams,
    options?: { enabled?: boolean }
) {
    return useQuery({
        queryKey: ["lessons", "page", params ?? {}],
        queryFn: () => lessonsApi.listPage(params),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: options?.enabled ?? true,
    })
}

export function useInfiniteLessons(
    params?: LessonListParams,
    options?: { enabled?: boolean }
) {
    const pageSize = params?.pageSize ?? 10;

    return useInfiniteQuery({
        queryKey: ["lessons", "infinite", params ?? {}, pageSize],
        queryFn: ({ pageParam }) =>
            lessonsApi.listPage({
                ...params,
                page: pageParam,
                pageSize,
            }),
        initialPageParam: 1,
        getNextPageParam: (lastPage) =>
            lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: options?.enabled ?? true,
    });
}

export function useGetLesson(lessonId?: string) {
    return useQuery({
        queryKey: ["lessons", lessonId],
        queryFn: () => lessonsApi.get(lessonId ?? ""),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(lessonId)
    })
}
