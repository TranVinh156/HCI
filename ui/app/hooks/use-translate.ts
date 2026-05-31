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

export function useSignKeypoints() {
  return useMutation({
    mutationFn: (frames: number[][][]) => translateApi.signKeypoints(frames),
  });
}

export function useGeminiSignGrade() {
  return useMutation({
    mutationFn: ({
      image,
      expectedLabel,
    }: {
      image: string;
      expectedLabel: string;
    }) => translateApi.signGrade(image, expectedLabel),
  });
}
