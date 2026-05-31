/**
 * Format a model prediction label for display.
 * - alphabet: passthrough ("A", "B", ...).
 * - word: kebab-case glosses → space-separated Title Case ("i-love-you" → "I Love You").
 */
export function formatLabel(
  label: string,
  kind: "alphabet" | "word",
): string {
  if (kind === "alphabet") return label;
  return label
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
