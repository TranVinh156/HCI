import { useQuery } from "@tanstack/react-query";
import { lessonsApi, type LessonListParams } from "~/api/lessons";

export function useGetLessons(params?: LessonListParams) {
    return useQuery({
        queryKey: ["lessons", "list", params ?? {}],
        queryFn: () => lessonsApi.list(params),
        staleTime: 3 * 60 * 1000,
        retry: false
    })
}

export function useGetLessonsPage(params?: LessonListParams) {
    return useQuery({
        queryKey: ["lessons", "page", params ?? {}],
        queryFn: () => lessonsApi.listPage(params),
        staleTime: 3 * 60 * 1000,
        retry: false
    })
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
