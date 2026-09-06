import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

const BARS = 20;
const TEMP_MAX = 180;

export function TorqueThermal() {
  const [kw, setKw] = useState<number[]>([]);
  const [temp, setTemp] = useState<number[]>([]);

  useEffect(() => {
    setKw(Array.from({ length: BARS }, () => 1 + Math.random() * 2));
    setTemp(Array.from({ length: BARS }, () => 60 + Math.random() * 40));
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setKw((p) => [
        ...p.slice(1),
        Math.min(4.5, Math.max(0.4, (p[p.length - 1] ?? 2) + (Math.random() - 0.5) * 1.2)),
      ]);
      setTemp((p) => [
        ...p.slice(1),
        Math.min(TEMP_MAX, Math.max(45, (p[p.length - 1] ?? 90) + (Math.random() - 0.45) * 18)),
      ]);
    }, 600);
    return () => clearInterval(i);
  }, []);

  const curKw = kw[kw.length - 1] ?? 0;
  const curTemp = temp[temp.length - 1] ?? 0;
  const hot = curTemp > 150;

  return (
    <EngineCard
      id="ENG-08"
      phi="φ₈"
      title="Torque & Thermal Matrix"
      subtitle="power draw · thermal dissipation"
      status={hot ? "THERMAL LIMIT" : "ONLINE"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="border border-border bg-background p-2">
          <div className="mb-1 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>BATTERY DRAIN (kW)</span>
            <span className="text-accent tabular-nums">{curKw.toFixed(2)}</span>
          </div>
          <div className="flex h-12 items-end gap-px">
            {kw.map((v, i) => (
              <div
                key={i}
                className="flex-1 bg-accent/70 transition-[height] duration-300"
                style={{ height: `${(v / 4.5) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="border border-border bg-background p-2">
          <div className="mb-1 flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>MOTOR TEMP (°C) · MAX {TEMP_MAX}</span>
            <span className={hot ? "text-destructive tabular-nums" : "text-chart-4 tabular-nums"}>
              {curTemp.toFixed(1)}
            </span>
          </div>
          <div className="flex h-12 items-end gap-px">
            {temp.map((v, i) => (
              <div
                key={i}
                className={`flex-1 transition-[height] duration-300 ${v > 150 ? "bg-destructive/80" : "bg-chart-4/70"}`}
                style={{ height: `${(v / TEMP_MAX) * 100}%` }}
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border font-mono text-[10px]">
          <div className="bg-card px-2 py-1.5">
            <div className="text-muted-foreground">TORQUE</div>
            <div className="text-foreground tabular-nums">{(curKw * 42).toFixed(0)} N·m</div>
          </div>
          <div className="bg-card px-2 py-1.5">
            <div className="text-muted-foreground">DISSIPATION</div>
            <div className="text-foreground tabular-nums">
              {((TEMP_MAX - curTemp) / TEMP_MAX * 100).toFixed(0)}% HEADROOM
            </div>
          </div>
        </div>
      </div>
    </EngineCard>
  );
}
