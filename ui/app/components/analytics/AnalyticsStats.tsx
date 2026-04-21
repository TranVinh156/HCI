import { MetricCard } from "../dashboard/MetricCard";

export function AnalyticsStats({ averages }: { averages: { eng: number; focus: number; att: number; anom: number } }) {
  const items = [
    {
      label: "Avg Engagement",
      value: `${averages.eng}%`,
      icon: "insights",
      iconBgClassName: "bg-sky-50",
      iconClassName: "text-sky-500",
    },
    {
      label: "Avg Focus Score",
      value: averages.focus,
      unit: "/100",
      icon: "psychology",
      iconBgClassName: "bg-emerald-50",
      iconClassName: "text-emerald-500",
    },
    {
      label: "Avg Attendance",
      value: `${averages.att}%`,
      icon: "groups",
      iconBgClassName: "bg-amber-50",
      iconClassName: "text-amber-500",
    },
    {
      label: "Total Anomalies",
      value: averages.anom,
      icon: "warning",
      iconBgClassName: "bg-rose-50",
      iconClassName: "text-rose-500",
      valueClassName: "text-rose-600",
    },
  ] as const;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <MetricCard key={item.label} {...item} />
      ))}
    </div>
  );
}
