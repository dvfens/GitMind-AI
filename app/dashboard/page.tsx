import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SiteShell } from "@/components/layout/site-shell";
import {
  createCoralExecutionTrace,
  fetchContributorReadinessReport,
  fetchCoralRepoInsights,
} from "@/lib/coral";
import { fetchRepositorySummary } from "@/lib/github";
import { parseGitHubRepoUrl } from "@/lib/repo-url";
import type {
  ContributorReadinessReport,
  DeveloperInsights,
  CoralRepoInsights,
} from "@/types/coral";
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
  let coralInsights: CoralRepoInsights | null = null;
  let contributorReadinessReport: ContributorReadinessReport | null = null;
  let developerInsights: DeveloperInsights | null = null;
  let repositoryError: string | null = null;

  if (parsedRepository) {
    try {
      const coralTrace = createCoralExecutionTrace();

      [repositorySummary, coralInsights, contributorReadinessReport] =
        await Promise.all([
        fetchRepositorySummary(
          parsedRepository.owner,
          parsedRepository.repo,
          coralTrace,
        ),
        fetchCoralRepoInsights(
          parsedRepository.owner,
          parsedRepository.repo,
          coralTrace,
        ).catch(
          () => null,
        ),
        fetchContributorReadinessReport(
          parsedRepository.owner,
          parsedRepository.repo,
          coralTrace,
        ).catch(() => null),
      ]);

      const sourcesUsed = Array.from(
        new Set(coralTrace.queries.flatMap((query) => query.sourceTables)),
      );

      developerInsights = {
        coralQueriesExecuted: coralTrace.queries.length,
        sourcesUsed,
        issuesAnalyzed: coralInsights?.openIssueCount ?? 0,
        pullRequestsAnalyzed: coralInsights?.openPullRequestCount ?? 0,
        commitsAnalyzed: repositorySummary?.recentCommits.length ?? 0,
        executedQueries: coralTrace.queries,
      };
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
        coralInsights={coralInsights}
        contributorReadinessReport={contributorReadinessReport}
        developerInsights={developerInsights}
        repositoryError={repositoryError}
      />
    </SiteShell>
  );
}
