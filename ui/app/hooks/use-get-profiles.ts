import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { profilesApi } from "~/api/profiles";

export function useGetProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: () => profilesApi.list(),
    retry: false,
    staleTime: 3 * 60 * 1000,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profilesApi.create,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profiles"] });
      void queryClient.invalidateQueries({ queryKey: ["profile-data"] });
      void queryClient.invalidateQueries({ queryKey: ["progress-data"] });
    },
  });
}
