import { useQuery } from "@tanstack/react-query";
import { topicsApi } from "~/api/topics";

export function useGetTopics() {
    return useQuery({
        queryKey: ["topics"],
        queryFn: () => topicsApi.list(),
        staleTime: 3 * 60 * 1000,
        retry: false
    })
}

export function useGetTopic(id?: string) {
    return useQuery({
        queryKey: ["topics", id],
        queryFn: () => topicsApi.get(id ?? ""),
        staleTime: 3 * 60 * 1000,
        retry: false,
        enabled: Boolean(id)
    })
}