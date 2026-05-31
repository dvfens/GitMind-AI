import { SiteShell } from "@/components/layout/site-shell";

export default function DashboardLoading() {
  return (
    <SiteShell compact background="prism">
      <section className="flex flex-1 flex-col gap-8">
        <div className="panel-light h-48 animate-pulse rounded-[28px]" />
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col gap-6">
            <div className="panel-light h-[28rem] animate-pulse rounded-[28px]" />
            <div className="panel-light h-[22rem] animate-pulse rounded-[28px]" />
          </div>
          <div className="panel-light h-[28rem] animate-pulse rounded-[28px]" />
        </div>
      </section>
    </SiteShell>
  );
}
