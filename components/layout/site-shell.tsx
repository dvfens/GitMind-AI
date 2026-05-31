import clsx from "clsx";

type SiteShellProps = {
  children: React.ReactNode;
  compact?: boolean;
  fullWidth?: boolean;
  background?: "dark" | "prism";
};

export function SiteShell({
  children,
  compact = false,
  fullWidth = false,
  background = "dark",
}: SiteShellProps) {
  return (
    <div
      className={clsx(
        "relative min-h-screen overflow-hidden",
        background === "prism" && "shell-prism",
      )}
    >
      {background === "dark" ? (
        <>
          <div className="grid-glow pointer-events-none absolute inset-0 opacity-70" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_58%)]" />
        </>
      ) : (
        <>
          <div className="pointer-events-none absolute -left-24 top-[-140px] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(184,140,255,0.45),transparent_70%)]" />
          <div className="pointer-events-none absolute right-[-120px] top-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(255,184,134,0.35),transparent_70%)]" />
        </>
      )}
      <main
        className={clsx(
          "relative z-10 flex min-h-screen w-full flex-col",
          fullWidth ? "px-0" : "mx-auto max-w-7xl px-6",
          compact ? "py-8 md:px-8 lg:px-10" : "py-6 md:px-8 lg:px-10",
          fullWidth ? "py-0" : "",
        )}
      >
        {children}
      </main>
    </div>
  );
}
