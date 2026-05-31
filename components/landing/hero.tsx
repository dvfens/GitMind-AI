import { RepoInput } from "@/components/repository/repo-input";

export function Hero() {
  return (
    <section className="flex min-h-screen w-full flex-1 items-center justify-center px-6 py-16">
      <div className="w-full max-w-5xl text-slate-900">
        <div className="fade-in-up flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-500">
            GitAI
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            Repository intelligence
          </div>

          <p className="mt-6 text-xs uppercase tracking-[0.35em] text-slate-400">
            New way to generate
          </p>
          <h1
            className="mt-4 text-4xl font-semibold text-slate-900 md:text-5xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-orange-400 bg-clip-text text-transparent">
              Repository clarity,
            </span>{" "}
            in minutes.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            GitAI transforms repository signals into a readable map for
            contributors. Paste a GitHub URL and get a guided path forward.
          </p>
        </div>

        <div className="fade-in-delay mt-10 grid gap-6 md:grid-cols-[1.4fr_0.6fr]">
          <div className="rounded-[32px] bg-white/80 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.12)] md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                  Repository intake
                </p>
                <h2
                  className="mt-3 text-2xl font-semibold text-slate-900"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Start with a GitHub URL
                </h2>
              </div>
              <div className="rounded-full bg-slate-900 px-3 py-1 text-[11px] uppercase tracking-[0.3em] text-white">
                Live
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-600">
              One repository in. Dashboard out.
            </p>
            <div className="mt-6">
              <RepoInput tone="light" />
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-[24px] bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Beginner map
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Plain-language explanations and starter areas.
              </p>
            </div>
            <div className="rounded-[24px] bg-white/75 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Contribution guide
              </p>
              <p className="mt-2 text-sm text-slate-600">
                Actionable next steps from repo activity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
