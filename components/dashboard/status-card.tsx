type StatusCardProps = {
  title: string;
  description: string;
  icon: React.ReactNode;
};

export function StatusCard({ title, description, icon }: StatusCardProps) {
  return (
    <div className="glass-panel fade-in-up flex items-start gap-4 rounded-[28px] p-6">
      <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 p-3 text-cyan-100">
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
