import { useQuery } from "@tanstack/react-query";

import { authApi } from "~/api/auth";
import { lessonsApi } from "~/api/lessons";
import { profilesApi } from "~/api/profiles";
import { progressApi } from "~/api/progress";

export function useProfileData() {
  return useQuery({
    queryKey: ["profile-data"],
    queryFn: async () => {
      const [user, profiles, lessons] = await Promise.all([
        authApi.me(),
        profilesApi.list(),
        lessonsApi.list(),
      ]);
      const profile = profiles[0] ?? null;
      const progress = profile ? await progressApi.get(profile.id) : null;

      return {
        user,
        profile,
        progress,
        lessons,
      };
    },
  });
}
