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
      <svg
        aria-hidden="true"
        viewBox="0 0 96 96"
        className={cn(
          "size-48 animate-bounce text-primary drop-shadow-sm",
          spinnerClassName
        )}
      >
        <ellipse
          cx="48"
          cy="83"
          rx="25"
          ry="5"
          className="fill-slate-900/10"
        />
        <path
          d="M48 14c19.2 0 32 13.1 32 33.3 0 22.5-13.6 35.9-32 35.9S16 69.8 16 47.3C16 27.1 28.8 14 48 14Z"
          className="fill-current"
        />
        <path
          d="M27.5 48.8c-7.7-2-13.3 1.6-15.5 8.5 7.6 1.9 13-.5 16.6-6.8l-1.1-1.7Z"
          className="fill-current opacity-80"
        />
        <path
          d="M68.5 48.8c7.7-2 13.3 1.6 15.5 8.5-7.6 1.9-13-.5-16.6-6.8l1.1-1.7Z"
          className="fill-current opacity-80"
        />
        <path
          d="M29 55.5c0 13 8.1 21.2 19 21.2s19-8.2 19-21.2c0-10.1-7.4-17.5-19-17.5S29 45.4 29 55.5Z"
          className="fill-white/90"
        />
        <circle cx="36" cy="40" r="9.5" className="fill-white" />
        <circle cx="60" cy="40" r="9.5" className="fill-white" />
        <circle
          cx="36"
          cy="41"
          r="4.2"
          className="origin-center animate-pulse fill-slate-950"
        />
        <circle
          cx="60"
          cy="41"
          r="4.2"
          className="origin-center animate-pulse fill-slate-950"
        />
        <path
          d="M43 50h10l-5 5.8L43 50Z"
          className="fill-amber-400 stroke-slate-900/10 stroke-[1.5]"
          strokeLinejoin="round"
        />
        <path
          d="M39 65c4.9 3.8 12.9 3.8 17.8 0"
          className="fill-none stroke-slate-900/45 stroke-[4]"
          strokeLinecap="round"
        />
        <path
          d="M33.5 22.5c-5.6 2.7-9.8 7.5-12.1 13.7M62.5 22.5c5.6 2.7 9.8 7.5 12.1 13.7"
          className="fill-none stroke-white/45 stroke-[5]"
          strokeLinecap="round"
        />
      </svg>
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
