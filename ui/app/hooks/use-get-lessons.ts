import { useQuery } from "@tanstack/react-query";
import { lessonsApi } from "~/api/lessons";
import { topicsApi } from "~/api/topics";

export function useGetLessons() {
    return useQuery({
        queryKey: ["lessons"],
        queryFn: () => lessonsApi.list(),
        staleTime: 3 * 60 * 1000,
        retry: false
    })
}