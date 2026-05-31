"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Github, Settings2 } from "lucide-react";
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODEL_STORAGE_KEY,
} from "@/lib/model-storage";
import { parseGitHubRepoUrl } from "@/lib/repo-url";

const EXAMPLE_REPO = "https://github.com/vercel/next.js";

export function RepoInput() {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState(EXAMPLE_REPO);
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
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

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsed = parseGitHubRepoUrl(repoUrl);

    if (!parsed) {
      setError("Paste a valid public GitHub repository URL to continue.");
      return;
    }

    setError(null);

    startTransition(() => {
      router.push(`/dashboard?repo=${encodeURIComponent(parsed.normalizedUrl)}`);
    });
  }

  return (
    <form id="repo-input" className="space-y-4" onSubmit={handleSubmit}>
      <label className="block">
        <span className="mb-2 block text-sm text-slate-300">
          Repository URL
        </span>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 transition focus-within:border-sky-400/40">
          <Github className="h-5 w-5 text-slate-500" />
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
            className="w-full border-none bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            aria-label="GitHub repository URL"
          />
        </div>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          type="submit"
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 font-medium text-slate-950 transition hover:translate-y-[-1px] hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Preparing dashboard..." : "Launch dashboard"}
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => {
            setRepoUrl(EXAMPLE_REPO);
            setError(null);
          }}
          className="rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
        >
          Use example repo
        </button>
      </div>

      {error ? (
        <div className="flex items-start gap-2 rounded-2xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-400">
          <p className="leading-6">
            Current AI model: <span className="text-slate-200">{model}</span>
          </p>
          <Link
            href="/models"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-slate-300 transition hover:border-white/20 hover:text-white"
          >
            <Settings2 className="h-4 w-4" />
            Change model
          </Link>
        </div>
      )}
    </form>
  );
}
