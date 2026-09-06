import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

const N = 60;
const W = 320;
const H = 96;

export function AnomalyDetector() {
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    setSeries(Array.from({ length: N }, () => 0.2 + Math.random() * 0.25));
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setSeries((prev) => {
        const last = prev[prev.length - 1] ?? 0.3;
        const spike = Math.random() > 0.94 ? Math.random() * 0.5 : 0;
        const next = Math.min(
          1,
          Math.max(0, last + (Math.random() - 0.5) * 0.12 + spike - (last > 0.7 ? 0.08 : 0)),
        );
        return [...prev.slice(1), next];
      });
    }, 500);
    return () => clearInterval(i);
  }, []);

  const current = series[series.length - 1] ?? 0;
  const peak = series.length ? Math.max(...series) : 0;
  const mean = series.length ? series.reduce((a, b) => a + b, 0) / series.length : 0;
  const alarm = current > 0.75;

  const pts = series.length
    ? series.map((v, i) => `${(i / (N - 1)) * W},${H - v * H}`).join(" ")
    : `${0},${H} ${W},${H}`;

  return (
    <EngineCard
      id="ENG-04"
      phi="φ₄"
      title="Anomaly Detector"
      subtitle="vector deviation monitor · σ-scaled"
      status={alarm ? "DEVIATION" : "NOMINAL"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="border border-border bg-background p-2">
          <svg viewBox={`0 0 ${W} ${H}`} className="h-24 w-full" preserveAspectRatio="none">
            {[0.25, 0.5, 0.75].map((g) => (
              <line
                key={g}
                x1="0"
                x2={W}
                y1={H - g * H}
                y2={H - g * H}
                stroke="var(--border)"
                strokeWidth="1"
              />
            ))}
            <line
              x1="0"
              x2={W}
              y1={H - 0.75 * H}
              y2={H - 0.75 * H}
              stroke="var(--destructive)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
            <polyline
              points={pts}
              fill="none"
              stroke={alarm ? "var(--destructive)" : "var(--accent)"}
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <div className="mt-1 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>T-30s</span>
            <span>1.0 / 0.0</span>
            <span>NOW</span>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["SCORE", current.toFixed(3)],
            ["PEAK", peak.toFixed(3)],
            ["MEAN", mean.toFixed(3)],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <div className="text-muted-foreground">{k}</div>
              <div className={alarm && k === "SCORE" ? "text-destructive" : "text-accent"}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </EngineCard>
  );
}
