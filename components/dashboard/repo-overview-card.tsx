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
    <article className="panel-light fade-in-up rounded-[24px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Repository Overview</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            {repositorySummary
              ? repositorySummary.name
              : active && parsedRepository
                ? `${parsedRepository.owner}/${parsedRepository.repo}`
              : "Waiting for repository context"}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
            {repositorySummary
              ? `Default branch: ${repositorySummary.defaultBranch}. Live repository details are now coming from Coral SQL.`
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
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Open on GitHub
            <ExternalLink className="h-4 w-4" />
          </a>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-slate-50/90 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FolderGit2 className="h-4 w-4 text-cyan-300" />
            Description
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            {repositorySummary?.description
              ? repositorySummary.description
              : active
                ? "No repository description is available for this project."
              : "No repository selected yet."}
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50/90 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Star className="h-4 w-4 text-cyan-300" />
            Stars
          </div>
          <p className="mt-4 text-3xl font-semibold text-slate-900">
            {repositorySummary ? repositorySummary.stars.toLocaleString() : "0"}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Live GitHub popularity signal
          </p>
        </div>

        <div className="rounded-2xl bg-slate-50/90 p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-cyan-300" />
            Languages
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {languages.map((language) => (
              <span
                key={language}
                className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700"
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
