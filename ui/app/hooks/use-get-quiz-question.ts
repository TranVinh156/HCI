import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "~/api/lessons";

export function useGetQuizQuestions(lessonId?: string) {
    return useQuery({
        queryKey: ["quiz", lessonId ?? "none"],
        queryFn: () => lessonsApi.questions(lessonId ?? ""),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(lessonId),
    });
}