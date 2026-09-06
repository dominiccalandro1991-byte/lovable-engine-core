import type { ReactNode } from "react";

export function EngineCard({
  id,
  phi,
  title,
  subtitle,
  status = "ONLINE",
  children,
  className = "",
}: {
  id: string;
  phi: string;
  title: string;
  subtitle: string;
  status?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`flex min-h-0 flex-col border border-border bg-card ${className}`}
    >
      <header className="flex items-center justify-between gap-2 border-b border-border bg-secondary px-3 py-2">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-mono text-[10px] tracking-widest text-muted-foreground">
              {id}
            </span>
            <h2 className="truncate text-xs font-semibold tracking-wide text-foreground">
              {phi} · {title}
            </h2>
          </div>
          <p className="truncate font-mono text-[10px] text-muted-foreground">{subtitle}</p>
        </div>
        <span className="shrink-0 border border-border px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-accent">
          {status}
        </span>
      </header>
      <div className="min-h-0 flex-1 p-3">{children}</div>
    </section>
  );
}
