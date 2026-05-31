"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Check, ExternalLink, Save } from "lucide-react";
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODEL_STORAGE_KEY,
} from "@/lib/model-storage";

const SUGGESTED_MODELS = [
  "openai/gpt-4o-mini",
  "anthropic/claude-3.5-sonnet",
  "google/gemini-2.0-flash-001",
];

export function ModelSettingsForm() {
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedModel = window.localStorage.getItem(
      OPENROUTER_MODEL_STORAGE_KEY,
    );

    if (storedModel) {
      setModel(storedModel);
    }
  }, []);

  function handleSave(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedModel = model.trim();
    const nextModel = trimmedModel || DEFAULT_OPENROUTER_MODEL;

    window.localStorage.setItem(OPENROUTER_MODEL_STORAGE_KEY, nextModel);
    setModel(nextModel);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="glass-panel rounded-[28px] p-6 md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm text-sky-200/70">OpenRouter Model</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">
            Choose the AI model for analysis
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Enter any OpenRouter model ID. HellScript AI will use this saved
            value whenever you run repository analysis from the dashboard.
          </p>
        </div>

        <Link
          href="https://openrouter.ai/models"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Browse models
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>

      <form className="mt-8 space-y-4" onSubmit={handleSave}>
        <label className="block">
          <span className="mb-2 block text-sm text-slate-300">Model ID</span>
          <input
            value={model}
            onChange={(event) => setModel(event.target.value)}
            placeholder={DEFAULT_OPENROUTER_MODEL}
            className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
          />
        </label>

        <div className="flex flex-wrap gap-2">
          {SUGGESTED_MODELS.map((suggestedModel) => (
            <button
              key={suggestedModel}
              type="button"
              onClick={() => setModel(suggestedModel)}
              className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs text-cyan-100 transition hover:border-cyan-300/40"
            >
              {suggestedModel}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100"
          >
            <Save className="h-4 w-4" />
            Save model
          </button>

          <p className="text-sm text-slate-400">
            {saved
              ? "Model saved. The dashboard will use this for AI analysis."
              : `Default fallback: ${DEFAULT_OPENROUTER_MODEL}`}
          </p>
        </div>

        {saved ? (
          <div className="flex items-start gap-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>Your model preference has been saved in this browser.</span>
          </div>
        ) : null}
      </form>
    </div>
  );
}
