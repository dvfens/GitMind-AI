import { Activity, DatabaseZap, GitBranchPlus, Layers3 } from "lucide-react";
import type { DeveloperInsights } from "@/types/coral";

type DeveloperInsightsPanelProps = {
  insights: DeveloperInsights | null;
};

const architectureFlow = [
  "GitHub",
  "Coral SQL",
  "GitMind",
  "OpenRouter",
  "AI Insights",
];

export function DeveloperInsightsPanel({
  insights,
}: DeveloperInsightsPanelProps) {
  return (
    <article className="glass-panel fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-100">
          <DatabaseZap className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-sky-200/70">Developer Insights</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Coral activity panel
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">
        This panel makes Coral&apos;s role visible in the demo by showing the exact
        SQL executed, the source tables used, and the architecture flow that
        powers GitMind-AI.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Activity className="h-4 w-4 text-cyan-300" />
            Coral queries executed
          </div>
          <p className="mt-3 text-3xl font-semibold text-white">
            {insights?.coralQueriesExecuted ?? 0}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Layers3 className="h-4 w-4 text-cyan-300" />
            Sources used
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {(insights?.sourcesUsed ?? []).map((source) => (
              <span
                key={source}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
              >
                {source}
              </span>
            ))}
            {!insights || insights.sourcesUsed.length === 0 ? (
              <span className="text-sm text-slate-400">Unavailable</span>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <GitBranchPlus className="h-4 w-4 text-cyan-300" />
            Issues analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {insights?.issuesAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <GitBranchPlus className="h-4 w-4 text-cyan-300" />
            Pull requests analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {insights?.pullRequestsAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 md:col-span-2">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Activity className="h-4 w-4 text-cyan-300" />
            Commits analyzed
          </div>
          <p className="mt-3 text-2xl font-semibold text-white">
            {insights?.commitsAnalyzed.toLocaleString() ?? "0"}
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">Architecture flow</p>
        <div className="mt-4 flex flex-col items-center gap-2">
          {architectureFlow.map((item, index) => (
            <div key={item} className="flex flex-col items-center gap-2">
              <div
                className={`min-w-44 rounded-2xl border px-4 py-3 text-center text-sm font-medium ${
                  item === "Coral SQL"
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-100"
                    : "border-white/10 bg-slate-950/60 text-slate-200"
                }`}
              >
                {item}
              </div>
              {index < architectureFlow.length - 1 ? (
                <div className="text-cyan-300">↓</div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-sm font-medium text-white">Executed Coral SQL</p>
        <div className="mt-4 space-y-4">
          {(insights?.executedQueries ?? []).map((query, index) => (
            <div
              key={`${query.sql}-${index}`}
              className="rounded-2xl border border-white/10 bg-slate-950/60 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                  Query {index + 1}
                </p>
                <div className="flex flex-wrap gap-2">
                  {query.sourceTables.map((sourceTable) => (
                    <span
                      key={sourceTable}
                      className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] text-cyan-100"
                    >
                      {sourceTable}
                    </span>
                  ))}
                </div>
              </div>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-words text-xs leading-6 text-slate-300">
                <code>{query.sql}</code>
              </pre>
            </div>
          ))}
          {!insights || insights.executedQueries.length === 0 ? (
            <p className="text-sm text-slate-400">
              No Coral SQL has been captured for this repository yet.
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
