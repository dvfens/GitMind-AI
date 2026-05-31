import { GitCommitHorizontal } from "lucide-react";
import type { CommitSummary } from "@/types/repository";

type CommitListCardProps = {
  active: boolean;
  commits: CommitSummary[];
  hasError: boolean;
};

export function CommitListCard({
  active,
  commits,
  hasError,
}: CommitListCardProps) {
  const emptyMessage = hasError
    ? "We could not load recent commits for this repository."
    : "No recent commits are available for this repository.";

  return (
    <article className="glass-panel fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <GitCommitHorizontal className="h-5 w-5 text-cyan-300" />
        <div>
          <p className="text-sm text-sky-200/70">Recent Commits</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Commit activity preview
          </h2>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {active && commits.length > 0 ? (
          commits.map((commit) => (
            <div
              key={commit.sha}
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4"
            >
              <p className="text-sm font-medium text-white">{commit.message}</p>
              <p className="mt-1 text-sm text-slate-400">
                {commit.author} committed on {formatCommitDate(commit.date)}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.24em] text-slate-500">
                {commit.sha.slice(0, 7)}
              </p>
            </div>
          ))
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-sm font-medium text-white">
              {active
                ? emptyMessage
                : "Commit history will appear here after GitHub integration."}
            </p>
            <p className="mt-1 text-sm text-slate-400">
              {active
                ? "Try a public repository or verify your GitHub token if requests are being limited."
                : "Connect a repository to populate this section."}
            </p>
          </div>
        )}
      </div>
    </article>
  );
}

function formatCommitDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}
