import { ExternalLink, Layers3 } from "lucide-react";
import type { CoralRepoInsights } from "@/types/coral";

type CoralInsightsCardProps = {
  insights: CoralRepoInsights | null;
  repoFullName?: string;
};

export function CoralInsightsCard({
  insights,
  repoFullName,
}: CoralInsightsCardProps) {
  return (
    <article className="panel-light fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-200/60 bg-cyan-100 p-3 text-cyan-700">
          <Layers3 className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Coral Insights</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            Contribution signal layer
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {insights
          ? `Live Coral queries are now enriching ${repoFullName ?? "this repository"} with open issue and pull request signals.`
          : "Coral is connected, but no extra repository insights are available yet for this selection."}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Open issues</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {insights ? insights.openIssueCount.toLocaleString() : "0"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="text-sm text-slate-500">Open pull requests</p>
          <p className="mt-3 text-3xl font-semibold text-slate-900">
            {insights ? insights.openPullRequestCount.toLocaleString() : "0"}
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">Top open issues</p>
          <div className="mt-3 space-y-3">
            {(insights?.topOpenIssues ?? []).slice(0, 3).map((issue) => (
              <a
                key={issue.url}
                href={issue.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                <span>{issue.title}</span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
              </a>
            ))}
            {!insights || insights.topOpenIssues.length === 0 ? (
              <p className="text-sm text-slate-500">
                No open issues surfaced from Coral yet.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">Top open pull requests</p>
          <div className="mt-3 space-y-3">
            {(insights?.topOpenPullRequests ?? []).slice(0, 3).map((pull) => (
              <a
                key={pull.url}
                href={pull.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200 px-3 py-3 text-sm text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
              >
                <span>{pull.title}</span>
                <ExternalLink className="mt-0.5 h-4 w-4 shrink-0" />
              </a>
            ))}
            {!insights || insights.topOpenPullRequests.length === 0 ? (
              <p className="text-sm text-slate-500">
                No open pull requests surfaced from Coral yet.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  );
}
