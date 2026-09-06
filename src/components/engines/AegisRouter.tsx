import { useState } from "react";
import { EngineCard } from "./EngineCard";

const R = 52;
const C = 2 * Math.PI * R;

export function AegisRouter() {
  const [health, setHealth] = useState(0.97);
  const [log, setLog] = useState<string[]>([]);
  const armed = health < 0.85;

  const degrade = () => setHealth((h) => Math.max(0.12, +(h - 0.07).toFixed(3)));
  const repair = () => {
    setLog((l) => [
      `${new Date().toISOString().slice(11, 19)}  DISPATCH repair_query → AEGIS`,
      ...l.slice(0, 3),
    ]);
    setHealth(0.99);
  };

  const color = armed ? "var(--destructive)" : health < 0.93 ? "var(--chart-4)" : "var(--accent)";

  return (
    <EngineCard
      id="ENG-05"
      phi="φ₅"
      title="AEGIS Router"
      subtitle="autonomous repair dispatch"
      status={armed ? "ARMED" : "STANDBY"}
    >
      <div className="flex h-full flex-col items-center gap-3">
        <button
          onClick={degrade}
          aria-label="Apply load to system health gauge"
          className="relative outline-none"
        >
          <svg width="132" height="132" viewBox="0 0 132 132" className="-rotate-90">
            <circle cx="66" cy="66" r={R} fill="none" stroke="var(--border)" strokeWidth="10" />
            <circle
              cx="66"
              cy="66"
              r={R}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - health)}
              strokeLinecap="butt"
              className="transition-all duration-300"
            />
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono text-2xl tabular-nums" style={{ color }}>
              {(health * 100).toFixed(1)}
            </span>
            <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
              H_sys
            </span>
          </div>
        </button>
        <p className="font-mono text-[9px] tracking-wide text-muted-foreground">
          CLICK GAUGE TO SIMULATE DEGRADATION · THRESHOLD 0.85
        </p>
        <button
          disabled={!armed}
          onClick={repair}
          className="w-full border border-border bg-secondary px-2 py-2 font-mono text-[10px] tracking-widest text-muted-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40 enabled:border-destructive enabled:bg-destructive/10 enabled:text-destructive enabled:hover:bg-destructive/20"
        >
          {armed ? "▶ EXECUTE AUTONOMOUS REPAIR" : "🔒 EXECUTE AUTONOMOUS REPAIR"}
        </button>
        <div className="min-h-0 w-full flex-1 overflow-y-auto border border-border bg-background p-2 font-mono text-[9px] text-accent">
          {log.length === 0 ? (
            <span className="text-muted-foreground">no dispatch events</span>
          ) : (
            log.map((l) => <div key={l}>{l}</div>)
          )}
        </div>
      </div>
    </EngineCard>
  );
}
