import { Bot, BrainCircuit, Rocket } from "lucide-react";

type AiPanelPlaceholderProps = {
  active: boolean;
  repositoryName: string;
};

const insightCards = [
  {
    title: "Beginner explanation",
    description:
      "A plain-language walkthrough that explains what the repository does and who it is for.",
    icon: BrainCircuit,
  },
  {
    title: "Contribution opportunities",
    description:
      "A prioritized list of places a beginner or contributor can start making progress.",
    icon: Rocket,
  },
];

export function AiPanelPlaceholder({
  active,
  repositoryName,
}: AiPanelPlaceholderProps) {
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

      <p className="mt-4 text-sm leading-7 text-slate-300">
        {active
          ? `This panel will turn ${repositoryName} into a contributor-friendly guide once OpenRouter analysis is connected.`
          : "Choose a repository first. The AI panel is already shaped for explanation, summaries, and guided next steps."}
      </p>

      <div className="mt-6 space-y-4">
        {insightCards.map(({ title, description, icon: Icon }) => (
          <div
            key={title}
            className="rounded-3xl border border-white/10 bg-white/5 p-4"
          >
            <div className="flex items-center gap-3">
              <Icon className="h-4 w-4 text-cyan-300" />
              <p className="font-medium text-white">{title}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-400">{description}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
