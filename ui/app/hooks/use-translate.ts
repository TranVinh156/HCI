import { useMutation } from "@tanstack/react-query";

import { translateApi } from "~/api/translate";

export function useSignToText() {
  return useMutation({
    mutationFn: ({
      image,
      kind,
    }: {
      image: string;
      kind: "alphabet" | "word";
    }) => translateApi.signToText(image, kind),
  });
}
