import { useState } from "react";
import { EngineCard } from "./EngineCard";

const TERRAIN = [
  { k: "CONCRETE", cf: 0.014, roll: "LOW", drag: 1.0 },
  { k: "GRAVEL", cf: 0.062, roll: "MED", drag: 1.8 },
  { k: "DEEP SAND", cf: 0.285, roll: "HIGH", drag: 4.6 },
] as const;

export function TerrainAnalyzer() {
  const [sel, setSel] = useState(0);
  const t = TERRAIN[sel]!;

  return (
    <EngineCard
      id="ENG-07"
      phi="φ₇"
      title="Terrain Coefficient Analyzer"
      subtitle="environmental friction variables"
      status={t.roll === "HIGH" ? "RESISTIVE" : "NOMINAL"}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-px border border-border bg-border">
          {TERRAIN.map((x, i) => (
            <button
              key={x.k}
              onClick={() => setSel(i)}
              className={`px-1 py-2 font-mono text-[9px] tracking-widest transition-colors ${
                i === sel
                  ? "bg-accent/15 text-accent"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {x.k}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col items-center justify-center border border-border bg-background py-4">
          <span className="font-mono text-[9px] tracking-widest text-muted-foreground">
            FRICTION COEFFICIENT C_f
          </span>
          <span className="font-mono text-4xl tabular-nums text-accent">
            {t.cf.toFixed(3)}
          </span>
          <div className="mt-3 h-1.5 w-40 border border-border">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${Math.min(100, t.cf * 300)}%` }}
            />
          </div>
        </div>

        <dl className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["ROLL RES", t.roll],
            ["DRAG ×", `${t.drag.toFixed(1)}`],
            ["RANGE Δ", `-${Math.round((t.drag - 1) * 12)}%`],
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
