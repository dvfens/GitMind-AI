"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, ArrowRight, Github, Settings2 } from "lucide-react";
import clsx from "clsx";
import {
  DEFAULT_OPENROUTER_MODEL,
  OPENROUTER_MODEL_STORAGE_KEY,
} from "@/lib/model-storage";
import { parseGitHubRepoUrl } from "@/lib/repo-url";

const EXAMPLE_REPO = "https://github.com/vercel/next.js";

type RepoInputProps = {
  tone?: "dark" | "light";
};

export function RepoInput({ tone = "dark" }: RepoInputProps) {
  const router = useRouter();
  const [repoUrl, setRepoUrl] = useState(EXAMPLE_REPO);
  const [model, setModel] = useState(DEFAULT_OPENROUTER_MODEL);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isLight = tone === "light";

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
        <span
          className={clsx(
            "mb-2 block text-sm",
            isLight ? "text-slate-500" : "text-slate-300",
          )}
        >
          Repository URL
        </span>
        <div
          className={clsx(
            "flex items-center gap-3 rounded-2xl border px-4 py-3 transition",
            isLight
              ? "border-transparent bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.1)] focus-within:shadow-[0_16px_40px_rgba(15,23,42,0.12)]"
              : "border-white/10 bg-slate-950/70 focus-within:border-sky-400/40",
          )}
        >
          <Github
            className={clsx(
              "h-5 w-5",
              isLight ? "text-slate-400" : "text-slate-500",
            )}
          />
          <input
            value={repoUrl}
            onChange={(event) => setRepoUrl(event.target.value)}
            placeholder="https://github.com/owner/repository"
            className={clsx(
              "w-full border-none bg-transparent text-sm outline-none",
              isLight
                ? "text-slate-900 placeholder:text-slate-400"
                : "text-white placeholder:text-slate-500",
            )}
            aria-label="GitHub repository URL"
          />
        </div>
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
        <button
          type="submit"
          disabled={isPending}
          className={clsx(
            "inline-flex items-center gap-2 rounded-full px-5 py-3 font-medium transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:opacity-70",
            isLight
              ? "bg-slate-900 text-white hover:bg-slate-800"
              : "bg-white text-slate-950 hover:bg-slate-100",
          )}
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
          className={clsx(
            "rounded-full border px-4 py-2 transition",
            isLight
              ? "border-transparent bg-white/80 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.1)] hover:text-slate-900"
              : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white",
          )}
        >
          Use example repo
        </button>
      </div>

      {error ? (
        <div
          className={clsx(
            "flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm",
            isLight
              ? "border-transparent bg-rose-500/10 text-rose-700"
              : "border-rose-400/20 bg-rose-400/10 text-rose-100",
          )}
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <div
          className={clsx(
            "flex flex-wrap items-center justify-between gap-3 text-sm",
            isLight ? "text-slate-500" : "text-slate-400",
          )}
        >
          <p className="leading-6">
            Current AI model:{" "}
            <span className={isLight ? "text-slate-700" : "text-slate-200"}>
              {model}
            </span>
          </p>
          <Link
            href="/models"
            className={clsx(
              "inline-flex items-center gap-2 rounded-full border px-4 py-2 transition",
              isLight
                ? "border-transparent bg-white/80 text-slate-600 shadow-[0_10px_30px_rgba(15,23,42,0.1)] hover:text-slate-900"
                : "border-white/10 text-slate-300 hover:border-white/20 hover:text-white",
            )}
          >
            <Settings2 className="h-4 w-4" />
            Change model
          </Link>
        </div>
      )}
    </form>
  );
}
