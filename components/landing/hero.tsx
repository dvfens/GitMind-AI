import Link from "next/link";
import { ArrowRight, Settings2, Sparkles } from "lucide-react";
import { RepoInput } from "@/components/repository/repo-input";

const highlights = [
  "Beginner-friendly repository walkthroughs",
  "Commit context and contribution guidance",
  "Dashboard-ready architecture for GitHub + AI",
];

export function Hero() {
  return (
    <section className="flex flex-1 flex-col justify-center py-12">
      <div className="fade-in-up inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-sky-100/90">
        <Sparkles className="h-4 w-4 text-cyan-300" />
        HellScript AI for faster repository onboarding
      </div>

      <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="fade-in-up">
          <p className="text-sm uppercase tracking-[0.28em] text-sky-200/70">
            Hackathon MVP
          </p>
          <h1 className="mt-4 max-w-3xl text-5xl font-semibold tracking-tight text-white md:text-6xl">
            Understand any GitHub repository before you write your first line.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            HellScript AI turns raw repository context into clear explanations,
            contribution paths, and developer-friendly insight. Paste a GitHub
            URL and move from confusion to confidence.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-300">
            {highlights.map((item) => (
              <span
                key={item}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2"
              >
                {item}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <Link
              href="#repo-input"
              className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-400/10 px-5 py-3 font-medium text-sky-100 transition hover:border-sky-300/60 hover:bg-sky-400/15"
            >
              Analyze a repository
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/models"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 font-medium text-slate-200 transition hover:border-white/20 hover:text-white"
            >
              <Settings2 className="h-4 w-4" />
              Configure model
            </Link>
            <span>Built for contributors, maintainers, and curious beginners.</span>
          </div>
        </div>

        <div className="fade-in-delay">
          <div className="glass-panel rounded-[28px] p-6 md:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm text-sky-200/70">Repository Intake</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">
                  Start with a GitHub URL
                </h2>
              </div>
              <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-3 py-2 text-xs uppercase tracking-[0.3em] text-cyan-200">
                Phase 1
              </div>
            </div>

            <RepoInput />
          </div>
        </div>
      </div>
    </section>
  );
}
