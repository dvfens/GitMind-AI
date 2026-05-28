import clsx from "clsx";

type SiteShellProps = {
  children: React.ReactNode;
  compact?: boolean;
};

export function SiteShell({ children, compact = false }: SiteShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="grid-glow pointer-events-none absolute inset-0 opacity-70" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
      <main
        className={clsx(
          "relative z-10 mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6",
          compact ? "py-8 md:px-8 lg:px-10" : "py-6 md:px-8 lg:px-10",
        )}
      >
        {children}
      </main>
    </div>
  );
}
