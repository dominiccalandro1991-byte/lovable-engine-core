import { useState } from "react";
import { EngineCard } from "./EngineCard";

const MIN = 300;
const MAX = 500;

export function KinematicLoad() {
  const [front, setFront] = useState(360);
  const [rear, setRear] = useState(420);

  const total = front + rear;
  const stress = ((total - MIN * 2) / (MAX * 2 - MIN * 2)) * 100;
  const bias = ((rear - front) / (MAX - MIN)) * 100;
  const critical = stress > 75;

  const axis = (
    label: string,
    value: number,
    set: (v: number) => void,
  ) => (
    <div className="space-y-1">
      <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
        <span>{label}</span>
        <span className="text-accent tabular-nums">{value} lb</span>
      </div>
      <input
        type="range"
        min={MIN}
        max={MAX}
        step={1}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        aria-label={label}
        className="w-full accent-[var(--accent)]"
      />
    </div>
  );

  return (
    <EngineCard
      id="ENG-06"
      phi="φ₆"
      title="Kinematic Load Simulator"
      subtitle="weight distribution · payload strain"
      status={critical ? "OVERLOAD" : "NOMINAL"}
    >
      <div className="flex h-full flex-col gap-3">
        {axis("AXIS A · FRONT", front, setFront)}
        {axis("AXIS B · REAR", rear, setRear)}
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>CHASSIS STRESS %</span>
            <span className={critical ? "text-destructive" : "text-accent"}>
              {stress.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 w-full border border-border bg-background">
            <div
              className={`h-full transition-[width] duration-150 ${critical ? "bg-destructive" : "bg-accent"}`}
              style={{ width: `${stress}%` }}
            />
          </div>
        </div>
        <dl className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["TOTAL", `${total} lb`],
            ["BIAS", `${bias >= 0 ? "+" : ""}${bias.toFixed(1)}%`],
            ["SAFETY", `${(2.4 - stress / 100).toFixed(2)}x`],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate text-foreground tabular-nums">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </EngineCard>
  );
}
