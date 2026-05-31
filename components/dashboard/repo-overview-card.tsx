import { ExternalLink, FolderGit2, Sparkles, Star } from "lucide-react";
import type { ParsedRepoUrl } from "@/lib/repo-url";
import type { RepositorySummary } from "@/types/repository";

type RepoOverviewCardProps = {
  repoUrl?: string;
  parsedRepository: ParsedRepoUrl | null;
  active: boolean;
  repositorySummary: RepositorySummary | null;
};

export function RepoOverviewCard({
  repoUrl,
  parsedRepository,
  active,
  repositorySummary,
}: RepoOverviewCardProps) {
  const languages =
    repositorySummary && repositorySummary.languages.length > 0
      ? repositorySummary.languages
      : active
        ? ["No language data"]
        : ["Awaiting data"];

  return (
    <article className="glass-panel fade-in-up rounded-[28px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-sky-200/70">Repository Overview</p>
          <h2 className="mt-3 text-2xl font-semibold text-white">
            {repositorySummary
              ? repositorySummary.name
              : active && parsedRepository
                ? `${parsedRepository.owner}/${parsedRepository.repo}`
              : "Waiting for repository context"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            {repositorySummary
              ? `Default branch: ${repositorySummary.defaultBranch}. Live repository details are now coming directly from GitHub.`
              : active
                ? "We found the repository URL and are ready to show GitHub data once the request succeeds."
              : "Submit a repository URL from the landing page and this area will become the main repository snapshot."}
          </p>
        </div>

        {active && repoUrl ? (
          <a
            href={repoUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Open on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <FolderGit2 className="h-4 w-4 text-cyan-300" />
            Description
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-200">
            {repositorySummary?.description
              ? repositorySummary.description
              : active
                ? "No repository description is available for this project."
              : "No repository selected yet."}
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Star className="h-4 w-4 text-cyan-300" />
            Stars
          </div>
          <p className="mt-4 text-3xl font-semibold text-white">
            {repositorySummary ? repositorySummary.stars.toLocaleString() : "0"}
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Live GitHub popularity signal
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Languages
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-100"
              >
                {language}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
