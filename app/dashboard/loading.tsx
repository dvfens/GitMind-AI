import { SiteShell } from "@/components/layout/site-shell";

export default function DashboardLoading() {
  return (
    <SiteShell compact>
      <section className="flex flex-1 flex-col gap-8">
        <div className="glass-panel h-48 animate-pulse rounded-[28px]" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <div className="glass-panel h-[28rem] animate-pulse rounded-[28px]" />
            <div className="glass-panel h-[22rem] animate-pulse rounded-[28px]" />
          </div>
          <div className="glass-panel h-[28rem] animate-pulse rounded-[28px]" />
        </div>
      </section>
    </SiteShell>
  );
}
