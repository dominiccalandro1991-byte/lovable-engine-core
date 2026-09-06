import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

const REGIONS = [
  { code: "US-EAST", label: "Ashburn, VA" },
  { code: "US-WEST", label: "San Francisco, CA" },
  { code: "EU-CENTRAL", label: "Frankfurt, DE" },
  { code: "AP-TOKYO", label: "Tokyo, JP" },
] as const;

const INITIAL = [28, 34, 42, 56];

function latencyTone(ms: number) {
  if (ms >= 120) return "text-destructive";
  if (ms >= 100) return "text-yellow-400";
  return "text-accent";
}

function latencyBg(ms: number) {
  if (ms >= 120) return "bg-destructive/15";
  if (ms >= 100) return "bg-yellow-400/15";
  return "bg-transparent";
}

export function EdgeLatencyMatrix() {
  const [latencies, setLatencies] = useState<number[]>(INITIAL);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      setLatencies((prev) =>
        prev.map((ms) => {
          const delta = Math.floor(Math.random() * 21) - 10;
          return Math.min(150, Math.max(12, ms + delta));
        })
      );
    };
    const i = setInterval(tick, 900);
    return () => clearInterval(i);
  }, []);

  return (
    <EngineCard
      id="ENG-17"
      phi="φ₁₇"
      title="Edge Latency Matrix"
      subtitle="global edge ping telemetry"
      status="MONITORING"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="border border-border bg-background">
          <div className="grid grid-cols-3 border-b border-border bg-secondary px-2 py-1 font-mono text-[9px] tracking-widest text-muted-foreground">
            <span>REGION</span>
            <span>POP</span>
            <span className="text-right">RTT</span>
          </div>
          {REGIONS.map((r, i) => {
            const ms = (mounted ? latencies[i] : INITIAL[i]) ?? 40;
            return (
              <div
                key={r.code}
                className={`grid grid-cols-3 px-2 py-1.5 font-mono text-[10px] transition-colors ${latencyBg(
                  ms
                )}`}
              >
                <span className="text-foreground">{r.code}</span>
                <span className="text-muted-foreground">{r.label}</span>
                <span className={`text-right tabular-nums ${latencyTone(ms)}`}>
                  {ms}ms
                </span>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>
            SAMPLES <span className="text-foreground">4/4</span>
          </span>
          <span>
            MAX{" "}
            <span className="text-foreground">
              {Math.max(...latencies)}ms
            </span>
          </span>
        </div>

        <div className="flex gap-2 font-mono text-[9px] tracking-widest text-muted-foreground">
          <span className="text-accent">&lt;100ms OK</span>
          <span className="text-yellow-400">100-119ms WARN</span>
          <span className="text-destructive">≥120ms CRIT</span>
        </div>
      </div>
    </EngineCard>
  );
}
