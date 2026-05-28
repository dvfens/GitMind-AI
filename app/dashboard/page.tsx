import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SiteShell } from "@/components/layout/site-shell";
import { fetchRepositorySummary } from "@/lib/github";
import { parseGitHubRepoUrl } from "@/lib/repo-url";
import type { RepositorySummary } from "@/types/repository";

type DashboardPageProps = {
  searchParams: Promise<{
    repo?: string;
  }>;
};

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { repo } = await searchParams;
  const parsedRepository = repo ? parseGitHubRepoUrl(repo) : null;
  let repositorySummary: RepositorySummary | null = null;
  let repositoryError: string | null = null;

  if (parsedRepository) {
    try {
      repositorySummary = await fetchRepositorySummary(
        parsedRepository.owner,
        parsedRepository.repo,
      );
    } catch (error) {
      repositoryError =
        error instanceof Error
          ? error.message
          : "Something went wrong while loading repository data.";
    }
  }

  return (
    <SiteShell compact>
      <DashboardShell
        repoUrl={repo}
        parsedRepository={parsedRepository}
        repositorySummary={repositorySummary}
        repositoryError={repositoryError}
      />
    </SiteShell>
  );
}
