"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { LoaderCircle, Map, Sparkles } from "lucide-react";
import type { CoralRepoInsights } from "@/types/coral";
import type { FirstContributionRoadmap } from "@/types/roadmap";
import type { RepositorySummary } from "@/types/repository";
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODEL_STORAGE_KEY,
} from "@/lib/model-storage";

type FirstContributionRoadmapCardProps = {
  repositorySummary: RepositorySummary | null;
  coralInsights: CoralRepoInsights | null;
  repositoryError: string | null;
};

type RoadmapResponse = {
  roadmap: FirstContributionRoadmap;
  model: string;
};

export function FirstContributionRoadmapCard({
  repositorySummary,
  coralInsights,
  repositoryError,
}: FirstContributionRoadmapCardProps) {
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [roadmap, setRoadmap] = useState<FirstContributionRoadmap | null>(null);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedModel = window.localStorage.getItem(
      OPENROUTER_MODEL_STORAGE_KEY,
    );

    if (storedModel) {
      setModel(storedModel);
    }
  }, []);

  function handleGenerateRoadmap() {
    if (!repositorySummary) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/roadmap", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            repository: repositorySummary,
            coralInsights,
          }),
        });

        const payload = (await response.json()) as
          | RoadmapResponse
          | { error?: string };

        if (!response.ok || !("roadmap" in payload)) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "Failed to generate a roadmap.",
          );
        }

        setRoadmap(payload.roadmap);
        setUsedModel(payload.model);
      } catch (caughtError) {
        setRoadmap(null);
        setUsedModel(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to generate a roadmap.",
        );
      }
    });
  }

  const disabled = !repositorySummary || Boolean(repositoryError) || isPending;

  return (
    <article className="panel-light fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-200/60 bg-cyan-100 p-3 text-cyan-700">
          <Map className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-slate-500">First Contribution Roadmap</p>
          <h2 className="mt-1 text-2xl font-semibold text-slate-900">
            Beginner path builder
          </h2>
        </div>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-600">
        This roadmap uses Coral-backed repository context plus OpenRouter to
        generate a practical five-day first contribution plan for beginners.
      </p>

      <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Selected model
        </p>
        <p className="mt-2 font-medium text-slate-900">{model}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={handleGenerateRoadmap}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Building roadmap...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate roadmap
              </>
            )}
          </button>

          <Link
            href="/models"
            className="rounded-full border border-slate-200/70 px-4 py-3 text-sm text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
          >
            Change model
          </Link>
        </div>
      </div>

      {repositoryError ? (
        <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-700">
          Fix the GitHub data error first, then generate a roadmap.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-700">
          {error}
        </p>
      ) : null}

      {!roadmap ? (
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">What you’ll get</p>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            A day-by-day first contribution plan that helps a beginner
            understand the project, set it up locally, review good starting
            issues, make a first change, and open a pull request.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-slate-200 bg-white p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Roadmap model
            </p>
            <p className="mt-2 text-sm text-slate-600">{usedModel}</p>
          </div>

          {roadmap.days.map((entry) => (
            <div
              key={entry.day}
              className="rounded-3xl border border-slate-200 bg-white p-4"
            >
              <p className="text-xs uppercase tracking-[0.24em] text-cyan-700">
                {entry.day}
              </p>
              <p className="mt-2 font-medium text-slate-900">{entry.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {entry.description}
              </p>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}
