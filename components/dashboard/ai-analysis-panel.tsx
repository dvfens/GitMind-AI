"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { Bot, BrainCircuit, LoaderCircle, Rocket, Sparkles } from "lucide-react";
import type { CoralRepoInsights } from "@/types/coral";
import type { RepositorySummary } from "@/types/repository";
import type { RepositoryAnalysis } from "@/types/analysis";
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODEL_STORAGE_KEY,
} from "@/lib/model-storage";

type AiAnalysisPanelProps = {
  repositorySummary: RepositorySummary | null;
  coralInsights: CoralRepoInsights | null;
  repositoryError: string | null;
};

type AnalyzeResponse = {
  analysis: RepositoryAnalysis;
  model: string;
};

export function AiAnalysisPanel({
  repositorySummary,
  coralInsights,
  repositoryError,
}: AiAnalysisPanelProps) {
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [analysis, setAnalysis] = useState<RepositoryAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [usedModel, setUsedModel] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const storedModel = window.localStorage.getItem(
      OPENROUTER_MODEL_STORAGE_KEY,
    );

    if (storedModel) {
      setModel(storedModel);
    }
  }, []);

  function handleAnalyze() {
    if (!repositorySummary) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const response = await fetch("/api/analyze", {
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
          | AnalyzeResponse
          | { error?: string };

        if (!response.ok || !("analysis" in payload)) {
          throw new Error(
            "error" in payload && payload.error
              ? payload.error
              : "Failed to analyze this repository.",
          );
        }

        setAnalysis(payload.analysis);
        setUsedModel(payload.model);
      } catch (caughtError) {
        setAnalysis(null);
        setUsedModel(null);
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : "Failed to analyze this repository.",
        );
      }
    });
  }

  const disabled = !repositorySummary || Boolean(repositoryError) || isPending;

  return (
    <aside className="glass-panel fade-in-delay rounded-[28px] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-100">
          <Bot className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm text-sky-200/70">AI Workspace</p>
          <h2 className="mt-1 text-2xl font-semibold text-white">
            Insight panel
          </h2>
        </div>
      </div>

      <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
          Selected model
        </p>
        <p className="mt-2 font-medium text-white">{model}</p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            disabled={disabled}
            onClick={handleAnalyze}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? (
              <>
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze repository
              </>
            )}
          </button>

          <Link
            href="/models"
            className="rounded-full border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            Change model
          </Link>
        </div>
      </div>

      {repositoryError ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          Fix the GitHub data error first, then run AI analysis.
        </p>
      ) : null}

      {error ? (
        <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </p>
      ) : null}

      {!analysis ? (
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-4 w-4 text-cyan-300" />
              <p className="font-medium text-white">Beginner explanation</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Run analysis to get a plain-language walkthrough of what the
              repository does and how a new contributor should approach it.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <Rocket className="h-4 w-4 text-cyan-300" />
              <p className="font-medium text-white">Contribution opportunities</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              HellScript AI will suggest practical areas to explore based on
              repository metadata, languages, and recent commits.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
              Analysis model
            </p>
            <p className="mt-2 text-sm text-slate-300">{usedModel}</p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center gap-3">
              <BrainCircuit className="h-4 w-4 text-cyan-300" />
              <p className="font-medium text-white">Beginner explanation</p>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {analysis.beginnerExplanation}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">Commit summary</p>
            <p className="mt-3 text-sm leading-7 text-slate-300">
              {analysis.commitSummary}
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">Suggested contribution areas</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {analysis.contributionAreas.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">How to start contributing</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {analysis.gettingStarted.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
            <p className="font-medium text-white">Architecture notes</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-300">
              {analysis.architectureNotes.map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </aside>
  );
}
