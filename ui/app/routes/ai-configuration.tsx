import type { Route } from "./+types/ai-configuration";
import { ContentCard } from "../components/dashboard/ContentCard";
import { DashboardShell } from "../components/dashboard/DashboardShell";
import { KeyValueList } from "../components/dashboard/KeyValueList";
import { SectionHeading } from "../components/dashboard/SectionHeading";

export function meta({}: Route.MetaArgs) {
  return [{ title: "AI Configuration - The Insightful Lens" }];
}

export default function AIConfiguration() {
  const systemStatus = [
    { label: "Camera Feed", value: "Healthy", valueClassName: "text-secondary" },
    { label: "Recognition Model", value: "Stable", valueClassName: "text-secondary" },
    { label: "Latency", value: "42ms", valueClassName: "text-primary" },
    { label: "GPU Utilization", value: "68%", valueClassName: "text-primary" },
  ];

  return (
    <DashboardShell
      title="AI Configuration"
      rightSlot={
        <div className="relative w-full max-w-md">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400">search</span>
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-100 border-none rounded-lg text-sm font-normal focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Search system settings..."
            type="text"
          />
        </div>
      }
      contentWidthClassName="max-w-7xl"
      contentClassName="space-y-8"
    >
      <SectionHeading
        title="AI Configuration"
        description="Refine your classroom digital twin and camera setup."
        action={
          <>
            <button className="px-6 py-2 bg-surface-container-high text-on-surface font-medium rounded-md hover:brightness-95 transition-all">Export Config</button>
            <button className="px-6 py-2 bg-linear-to-br from-primary to-primary-container text-white font-medium rounded-md shadow-lg shadow-primary/20 active:scale-95 transition-all">Save Changes</button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <ContentCard
          title="Camera Calibration"
          className="col-span-12 lg:col-span-8"
          action={
            <span className="px-3 py-1 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold uppercase tracking-wider">
              Active: Feed 01
            </span>
          }
          bodyClassName="p-6"
        >
          <div className="relative aspect-video rounded-xl bg-slate-900 overflow-hidden">
            <img alt="Live Classroom Feed" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDUF_tB6pfKbagf-q_LZkT-8XsSbbY-7SFXWioh0YGHMBRF7CSj8SvPZsNS89g5uec-KEoWUyGZt9BCgwO3oVvqzjUE5x4f7bmTMocZ7lYX17StYpkg5oQDqCnzlQfoueNfPzvZY0FYGs20rCtgeOjMiZANYCfBewdOm2KXJU2Zob0QwR8mhvCy0DYaye3t3an-i1lsOjPjTx_KKe3iS3neiLCNGM9Pm11LNZsvB5HHW-468cUig7RSO2NsnabrkUJ33oVa5IQCR0li" />
            <div className="absolute inset-0 p-6 pointer-events-none">
              <div className="border-2 border-on-tertiary-container/40 absolute top-1/4 left-1/3 w-32 h-44 rounded-lg"></div>
              <div className="border-2 border-on-tertiary-container/40 absolute top-1/2 left-1/2 w-28 h-36 rounded-lg"></div>
            </div>
          </div>
        </ContentCard>

        <ContentCard title="System Status" className="col-span-12 lg:col-span-4" bodyClassName="p-6">
          <KeyValueList items={systemStatus} />
        </ContentCard>
      </div>
    </DashboardShell>
  );
}
