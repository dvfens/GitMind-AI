type StatusCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
  tone?: "default" | "error";
};

export function StatusCard({
  title,
  description,
  icon,
  tone = "default",
}: StatusCardProps) {
  const accentClasses =
    tone === "error"
      ? "border-rose-400/20 bg-rose-400/10 text-rose-100"
      : "border-cyan-400/20 bg-cyan-400/10 text-cyan-100";

  return (
    <div className="glass-panel fade-in-up flex items-start gap-4 rounded-[28px] p-6">
      <div className={`rounded-2xl border p-3 ${accentClasses}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-300">
          {description}
        </p>
      </div>
    </div>
  );
}
