const feedbackSounds = {
  correct: "/audio/correct.mp3",
  wrong: "/audio/universfield-error-08-206492.mp3",
} as const;

export function playFeedbackSound(result: keyof typeof feedbackSounds) {
  if (typeof window === "undefined") return;

  const audio = new Audio(feedbackSounds[result]);
  audio.volume = 0.65;
  void audio.play().catch(() => {
    // Browsers can block audio if the action is not considered user-initiated.
  });
}
