import { Activity, DatabaseZap, GitBranchPlus, Layers3 } from "lucide-react";
import type { DeveloperInsights } from "@/types/coral";

type DeveloperInsightsPanelProps = {
  insights: DeveloperInsights | null;
};

export function DeveloperInsightsPanel({
  insights,
}: DeveloperInsightsPanelProps) {
  return (
    <article className="panel-light fade-in-delay rounded-[24px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-200/60 bg-cyan-100 p-3 text-cyan-700">
          <DatabaseZap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Developer Insights</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            Coral activity panel
          </h2>
        </div>
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-600">
        Quick Coral activity metrics for this repository.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4 text-cyan-600" />
            Coral queries executed
          </div>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {insights?.coralQueriesExecuted ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Layers3 className="h-4 w-4 text-cyan-600" />
            Sources used
          </div>
          <p className="mt-3 text-sm text-slate-700">
            {insights && insights.sourcesUsed.length > 0
              ? insights.sourcesUsed.join(" · ")
              : "Unavailable"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <GitBranchPlus className="h-4 w-4 text-cyan-600" />
            Issues analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {insights?.issuesAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <GitBranchPlus className="h-4 w-4 text-cyan-600" />
            Pull requests analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {insights?.pullRequestsAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 md:col-span-2">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Activity className="h-4 w-4 text-cyan-600" />
            Commits analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-slate-900">
            {insights?.commitsAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>
      </div>
    </article>
  );
}
