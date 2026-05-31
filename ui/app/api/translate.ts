import { request } from "./request";
import type { GeminiSignGradeResult, TranslateResult } from "./types";

export const translateApi = {
  signToText: (image: string, kind: "alphabet" | "word" = "alphabet") =>
    request<TranslateResult>("/api/translate/sign-to-text", {
      method: "POST",
      body: JSON.stringify({ image, kind }),
    }),
  signAlphabetGemini: (image: string) =>
    request<TranslateResult>("/api/translate/sign-alphabet-gemini", {
      method: "POST",
      body: JSON.stringify({ image, kind: "alphabet" }),
    }),
  signKeypoints: (frames: number[][][]) =>
    request<TranslateResult>("/api/translate/sign-keypoints", {
      method: "POST",
      body: JSON.stringify({ frames }),
    }),
  signGrade: (image: string, expectedLabel: string) =>
    request<GeminiSignGradeResult>("/api/translate/sign-grade", {
      method: "POST",
      body: JSON.stringify({ image, expected_label: expectedLabel }),
    }),
};
