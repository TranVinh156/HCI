/**
 * Format a model prediction label for display.
 * - alphabet: passthrough ("A", "B", ...).
 * - word: kebab-case glosses → space-separated Title Case ("i-love-you" → "I Love You").
 * - landmark: single char (A-Z, 0-9) → passthrough; multi-char → Title Case ("yes" → "Yes").
 */
export function formatLabel(
  label: string,
  kind: "alphabet" | "word" | "landmark",
): string {
  if (kind === "alphabet") return label;
  if (kind === "landmark") {
    if (label.length <= 1) return label;
    return label.charAt(0).toUpperCase() + label.slice(1);
  }
  return label
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
}
