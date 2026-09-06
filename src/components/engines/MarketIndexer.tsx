import { useState } from "react";
import { EngineCard } from "./EngineCard";

const ROWS = [
  { m: "CUSTOM RIG-C", payload: "500 lb", motor: "BLDC 750W ×2", mas: 0.91, own: true },
  { m: "GORILLA GX-4", payload: "1200 lb", motor: "BRUSHED 500W", mas: 0.42, own: false },
  { m: "POLAR HAUL 300", payload: "300 lb", motor: "BLDC 350W", mas: 0.35, own: false },
  { m: "TERRA CART S2", payload: "450 lb", motor: "NONE / MANUAL", mas: 0.18, own: false },
];

type Key = "m" | "payload" | "motor" | "mas";

export function MarketIndexer() {
  const [sort, setSort] = useState<Key>("mas");
  const rows = [...ROWS].sort((a, b) =>
    sort === "mas" ? b.mas - a.mas : String(a[sort]).localeCompare(String(b[sort])),
  );

  return (
    <EngineCard
      id="ENG-10"
      phi="φ₁₀"
      title="Market & Viability Indexer"
      subtitle="commercial cross-reference · 4 models"
      status="INDEXED"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="h-56 min-h-0 flex-1 overflow-auto border border-border bg-background">
          <table className="w-full border-collapse font-mono text-[10px]">
            <thead className="sticky top-0 bg-secondary text-muted-foreground">
              <tr>
                {(
                  [
                    ["m", "MODEL", "text-left"],
                    ["payload", "PAYLOAD LIMIT", "text-right"],
                    ["motor", "MOTOR TYPE", "text-right"],
                    ["mas", "MARKET ABSENCE", "text-right"],
                  ] as [Key, string, string][]
                ).map(([k, label, align]) => (
                  <th
                    key={k}
                    onClick={() => setSort(k)}
                    className={`cursor-pointer whitespace-nowrap border-b border-border px-2 py-1 font-normal tracking-widest hover:text-accent ${align} ${sort === k ? "text-accent" : ""}`}
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.m} className={r.own ? "bg-accent/10" : "odd:bg-secondary/40"}>
                  <td className={`px-2 py-1 ${r.own ? "text-accent" : "text-foreground/80"}`}>
                    {r.m}
                  </td>
                  <td className="px-2 py-1 text-right text-foreground/80 tabular-nums">
                    {r.payload}
                  </td>
                  <td className="whitespace-nowrap px-2 py-1 text-right text-muted-foreground">
                    {r.motor}
                  </td>
                  <td className="px-2 py-1 text-right tabular-nums text-accent">
                    {r.mas.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
          SORT KEY · {sort.toUpperCase()} — MAS 1.00 = NO COMPETING SKU
        </div>
      </div>
    </EngineCard>
  );
}
