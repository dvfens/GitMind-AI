import Link from "next/link";
import { ArrowLeft, Github, LayoutDashboard, SlidersHorizontal } from "lucide-react";
import type { ParsedRepoUrl } from "@/lib/repo-url";
import type {
  ContributorReadinessReport,
  DeveloperInsights,
  CoralRepoInsights,
} from "@/types/coral";
import type { RepositorySummary } from "@/types/repository";
import { AiAnalysisPanel } from "@/components/dashboard/ai-analysis-panel";
import { ContributorReadinessCard } from "@/components/dashboard/contributor-readiness-card";
import { CoralInsightsCard } from "@/components/dashboard/coral-insights-card";
import { DeveloperInsightsPanel } from "@/components/dashboard/developer-insights-panel";
import { FirstContributionRoadmapCard } from "@/components/dashboard/first-contribution-roadmap-card";
import { RepoOverviewCard } from "@/components/dashboard/repo-overview-card";
import { StatusCard } from "@/components/dashboard/status-card";

type DashboardShellProps = {
  repoUrl?: string;
  parsedRepository: ParsedRepoUrl | null;
  repositorySummary: RepositorySummary | null;
  coralInsights: CoralRepoInsights | null;
  contributorReadinessReport: ContributorReadinessReport | null;
  developerInsights: DeveloperInsights | null;
  repositoryError: string | null;
};

export function DashboardShell({
  repoUrl,
  parsedRepository,
  repositorySummary,
  coralInsights,
  contributorReadinessReport,
  developerInsights,
  repositoryError,
}: DashboardShellProps) {
  const hasRepo = Boolean(repoUrl && parsedRepository);

  return (
    <section className="flex flex-1 flex-col gap-8">
      <header className="panel-light fade-in-up flex flex-col gap-5 rounded-[28px] px-6 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <LayoutDashboard className="h-4 w-4" />
            HellScript AI Dashboard
          </div>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            Repository analysis workspace
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            A modular dashboard for repository context, AI explanations, and
            contribution guidance.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200/70 px-4 py-2 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            New repository
          </Link>
        </div>
      </header>

      {!hasRepo ? (
        <StatusCard
          title="Paste a repository URL to get started"
          description="The dashboard is ready, but there is no repository in the query string yet. Go back to the landing page and submit a GitHub repository URL."
          icon={<Github className="h-5 w-5" />}
        />
      ) : null}

      {hasRepo && repositoryError ? (
        <StatusCard
          title="We could not load GitHub data"
          description={repositoryError}
          icon={<Github className="h-5 w-5" />}
          tone="error"
        />
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col gap-6">
          <RepoOverviewCard
            parsedRepository={parsedRepository}
            repoUrl={repoUrl}
            active={hasRepo}
            repositorySummary={repositorySummary}
          />
          <CoralInsightsCard
            insights={coralInsights}
            repoFullName={repositorySummary?.name}
          />
          <ContributorReadinessCard
            report={contributorReadinessReport}
            repoFullName={repositorySummary?.name}
          />
        </div>

        <div className="flex flex-col gap-6">
          <AiAnalysisPanel
            repositorySummary={repositorySummary}
            coralInsights={coralInsights}
            repositoryError={repositoryError}
          />
          <FirstContributionRoadmapCard
            repositorySummary={repositorySummary}
            coralInsights={coralInsights}
            repositoryError={repositoryError}
          />
          <DeveloperInsightsPanel insights={developerInsights} />
        </div>
      </div>
    </section>
  );
}
