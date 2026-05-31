import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SiteShell } from "@/components/layout/site-shell";
import { ModelSettingsForm } from "@/components/model/model-settings-form";

export default function ModelsPage() {
  return (
    <SiteShell compact>
      <section className="flex flex-1 flex-col gap-8">
        <header className="fade-in-up rounded-[28px] border border-white/10 bg-[rgba(8,12,27,0.82)] px-6 py-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-sky-200/70">Model Settings</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">
                Configure your OpenRouter model
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
                Save the model you want HellScript AI to use for repository
                explanations and contribution guidance.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm text-slate-300 transition hover:border-white/20 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
        </header>

        <ModelSettingsForm />
      </section>
    </SiteShell>
  );
}
