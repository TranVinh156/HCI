import { cn } from "~/lib/utils";

type QuizOptionProps = {
  option: string;
  selected: boolean;
  state: "idle" | "correct" | "wrong";
  onSelect: () => void;
};

export function QuizOption({
  option,
  selected,
  state,
  onSelect,
}: QuizOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "min-h-24 rounded-[1.5rem] border-2 bg-white p-4 text-center text-2xl font-black text-slate-800 transition hover:-translate-y-0.5 hover:border-cyan-300",
        selected && "border-sky-500 bg-sky-50",
        selected && state === "correct" && "border-emerald-500 bg-emerald-50",
        selected && state === "wrong" && "border-rose-400 bg-rose-50"
      )}
    >
      {option}
    </button>
  );
}
