import { GitCommitHorizontal } from "lucide-react";

type CommitListCardProps = {
  active: boolean;
};

const placeholderCommits = [
  "Refine repository analysis prompt pipeline",
  "Add dashboard shell and status states",
  "Wire GitHub URL parser and validation flow",
];

export function CommitListCard({ active }: CommitListCardProps) {
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
        {(active ? placeholderCommits : ["Commit history will appear here after GitHub integration."]).map(
          (commit, index) => (
            <div
              key={`${commit}-${index}`}
              className="rounded-3xl border border-white/10 bg-white/5 px-4 py-4"
            >
              <p className="text-sm font-medium text-white">{commit}</p>
              <p className="mt-1 text-sm text-slate-400">
                {active
                  ? "Placeholder commit summary card reserved for Phase 2."
                  : "Connect a repository to populate this section."}
              </p>
            </div>
          ),
        )}
      </div>
    </article>
  );
}
