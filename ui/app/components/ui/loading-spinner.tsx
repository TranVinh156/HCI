import { cn } from "~/lib/utils";

type LoadingSpinnerProps = {
  label?: string;
  className?: string;
  spinnerClassName?: string;
  showLabel?: boolean;
};

function LoadingSpinner({
  label = "Loading",
  className,
  spinnerClassName,
  showLabel = true,
}: LoadingSpinnerProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn(
        "flex items-center justify-center",
        showLabel
          ? "min-h-[60vh] w-full flex-col gap-3"
          : "w-auto flex-row",
        className
      )}
    >
      <img
        aria-hidden="true"
        src="/mascot.svg"
        alt=""
        className={cn(
          "size-48 animate-[mascot-run_0.72s_ease-in-out_infinite] object-contain drop-shadow-sm",
          spinnerClassName
        )}
      />
      <style>
        {`
          @keyframes mascot-run {
            0%, 100% { transform: translateY(0) scaleY(1); }
            50% { transform: translateY(-8px) scaleY(1.02); }
          }
        `}
      </style>
      {showLabel ? (
        <span className="text-sm font-black uppercase tracking-normal text-slate-500">
          {label}...
        </span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
}

export { LoadingSpinner };
