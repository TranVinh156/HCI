import type { LucideIcon } from "lucide-react";

import { Card, CardContent } from "~/components/ui/card";

type StatCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
};

export function StatCard({ label, value, detail, icon: Icon }: StatCardProps) {
  return (
    <Card className="rounded-xl border-slate-200 bg-white py-0">
      <CardContent className="p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-bold text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
        </div>
        <div className="grid size-12 place-items-center rounded-xl text-primary">
          <Icon className="size-6" />
        </div>
      </div>
      <p className="mt-4 text-sm font-semibold text-emerald-700">{detail}</p>
      </CardContent>
    </Card>
  );
}
