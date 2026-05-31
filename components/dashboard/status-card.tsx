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
      ? "border-rose-400/30 bg-rose-400/15 text-rose-700"
      : "border-cyan-400/30 bg-cyan-400/15 text-cyan-700";

  return (
    <div className="panel-light fade-in-up flex items-start gap-4 rounded-[28px] p-6">
      <div className={`rounded-2xl border p-3 ${accentClasses}`}>
        {icon}
      </div>
      <div>
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
          {description}
        </p>
      </div>
    </div>
  );
}
