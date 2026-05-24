import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authApi } from "~/api/auth";
import { clearToken, getToken } from "~/api/request";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => authApi.me(),
    enabled: Boolean(getToken()),
    retry: false,
    staleTime: 3 * 60 * 1000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      username,
      password,
    }: {
      username: string;
      password: string;
    }) => {
      await authApi.login(username, password);
      return authApi.me();
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["auth"] });
      void queryClient.invalidateQueries({ queryKey: ["profile-data"] });
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: authApi.register,
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearToken();
    queryClient.clear();
  };
}
