import { Compass, Layers3, Sparkles, Workflow } from "lucide-react";
import type { ContributorReadinessReport } from "@/types/coral";

type ContributorReadinessCardProps = {
  report: ContributorReadinessReport | null;
  repoFullName?: string;
};

export function ContributorReadinessCard({
  report,
  repoFullName,
}: ContributorReadinessCardProps) {
  return (
    <article className="panel-light fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-200/60 bg-cyan-100 p-3 text-cyan-700">
          <Workflow className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">Contributor Readiness</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            Coral readiness report
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        {report
          ? `This report is generated from a joined Coral SQL composition across repository metadata, recent commits, open issues, and open pull requests for ${repoFullName ?? "this repository"}.`
          : "Coral could not generate a readiness report for this repository yet."}
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Layers3 className="h-4 w-4 text-cyan-600" />
            Repo health
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {report?.repoHealth ?? "Unavailable"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Sparkles className="h-4 w-4 text-cyan-600" />
            Beginner friendliness
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {report?.beginnerFriendliness ?? "Unavailable"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Workflow className="h-4 w-4 text-cyan-600" />
            Contribution difficulty
          </div>
          <p className="mt-3 text-lg font-semibold text-slate-900">
            {report?.contributionDifficulty ?? "Unavailable"}
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Compass className="h-4 w-4 text-cyan-600" />
            Recommended starting point
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {report?.recommendedStartingPoint ?? "Unavailable"}
          </p>
        </div>
      </div>
    </article>
  );
}
