import type { ReactNode } from "react";
import { Separator } from "../ui/separator";

type KeyValueItem = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

export function KeyValueList({
  items,
  className,
}: {
  items: KeyValueItem[];
  className?: string;
}) {
  return (
    <div className={`space-y-4 ${className ?? ""}`}>
      {items.map((item, index) => (
        <div key={item.label} className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-slate-600">{item.label}</span>
            <span className={`font-semibold ${item.valueClassName ?? "text-slate-800"}`}>{item.value}</span>
          </div>
          {index < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  );
}
