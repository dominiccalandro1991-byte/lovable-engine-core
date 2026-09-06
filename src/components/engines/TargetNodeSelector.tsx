import { useState } from "react";
import { EngineCard } from "./EngineCard";

const NODES = [
  { label: "VERCEL EDGE", ip: "76.76.21.21" },
  { label: "GITHUB PAGES", ip: "185.199.108.153" },
  { label: "LOCAL DEV", ip: "127.0.0.1:3000" },
] as const;

export function TargetNodeSelector() {
  const [sel, setSel] = useState(0);
  const node = NODES[sel] ?? NODES[0];

  return (
    <EngineCard
      id="ENG-16"
      phi="φ₁₆"
      title="Target Node Selector"
      subtitle="production environment routing"
      status="ROUTED"
    >
      <div className="flex h-full flex-col gap-3">
        <div className="grid grid-cols-3 gap-px border border-border bg-border">
          {NODES.map((n, i) => (
            <button
              key={n.label}
              onClick={() => setSel(i)}
              className={`px-1 py-2 font-mono text-[9px] tracking-widest transition-colors ${
                i === sel
                  ? "bg-accent/15 text-accent"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {n.label}
            </button>
          ))}
        </div>

        <div className="flex flex-1 flex-col justify-center gap-2 border border-border bg-background px-3 py-2">
          <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
            ACTIVE NODE IP
          </div>
          <div className="font-mono text-lg tabular-nums text-foreground">
            {node.ip}
          </div>
          <div className="font-mono text-[10px] text-accent">
            {node.label} · HEALTHY
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["PROTOCOL", "HTTPS"],
            ["TLS", "1.3"],
            ["REGION", "auto"],
            ["HOP", "direct"],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </EngineCard>
  );
}
