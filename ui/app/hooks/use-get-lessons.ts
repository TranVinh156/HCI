import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "~/api/lessons";

export function useGetLessons() {
    return useQuery({
        queryKey: ["lessons"],
        queryFn: () => lessonsApi.list(),
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