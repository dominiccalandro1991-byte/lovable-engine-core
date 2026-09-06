import { useState } from "react";
import { EngineCard } from "./EngineCard";

const INCIDENTS = [
  { id: "INC-0912", stack: "TypeError undefined id", patch: "add optional chain", base: 0.06 },
  { id: "INC-0877", stack: "ETIMEDOUT postgres", patch: "raise pool timeout", base: 0.21 },
  { id: "INC-0841", stack: "TS2345 arg mismatch", patch: "widen param type", base: 0.34 },
  { id: "INC-0803", stack: "JS heap OOM", patch: "stream large payload", base: 0.58 },
] as const;

const THRESHOLD = 0.15;

export function IncidentDojo() {
  const [q, setQ] = useState("TypeError undefined id");
  type Ranked = { id: string; stack: string; patch: string; base: number; d: number };
  const [ranked, setRanked] = useState<Ranked[]>(
    INCIDENTS.map((i) => ({ ...i, d: i.base as number })).sort((a, b) => a.d - b.d),
  );

  const search = () => {
    const term = q.trim().toLowerCase();
    setRanked(
      INCIDENTS.map((i) => {
        const overlap = term
          ? i.stack.toLowerCase().split(" ").filter((w) => term.includes(w)).length
          : 0;
        const d = Math.max(0.02, i.base - overlap * 0.12 + (term ? 0 : 0.1));
        return { ...i, d: Number(d.toFixed(3)) };
      }).sort((a, b) => a.d - b.d),
    );
  };

  const top = ranked[0]!;
  const hit = top.d < THRESHOLD;

  return (
    <EngineCard
      id="ENG-23"
      phi="φ₂₃"
      title="IncidentDojo"
      subtitle="pgvector post-mortem KB · HNSW O(log N)"
      status={hit ? "LLM BYPASSED" : "INFER REQUIRED"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="flex gap-px border border-border bg-border">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="normalized error stack…"
            className="min-w-0 flex-1 bg-background px-2 py-1.5 font-mono text-[10px] text-foreground outline-none placeholder:text-muted-foreground"
          />
          <button
            onClick={search}
            className="bg-secondary px-2 py-1.5 font-mono text-[9px] tracking-widest text-foreground hover:text-accent"
          >
            EMBED + SEARCH
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto border border-border bg-background">
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr className="bg-secondary text-left text-muted-foreground">
                <th className="px-2 py-1 font-normal">INCIDENT</th>
                <th className="px-2 py-1 font-normal">REMEDIATION</th>
                <th className="px-2 py-1 text-right font-normal">cos δ</th>
              </tr>
            </thead>
            <tbody>
              {ranked.map((r) => (
                <tr key={r.id} className="border-t border-border odd:bg-secondary/30">
                  <td className="px-2 py-1 text-foreground">{r.id}</td>
                  <td className="max-w-0 truncate px-2 py-1 text-foreground/70">{r.patch}</td>
                  <td
                    className={`px-2 py-1 text-right tabular-nums ${r.d < THRESHOLD ? "text-accent" : "text-muted-foreground"}`}
                  >
                    {r.d.toFixed(3)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border border-border bg-card px-2 py-1.5 font-mono text-[10px]">
          <span className="text-muted-foreground">δ &lt; {THRESHOLD} → </span>
          <span className={hit ? "text-accent" : "text-destructive"}>
            {hit ? `return ${top.id} patch_diff (0 tokens)` : "dispatch OpenRouter inference"}
          </span>
        </div>
      </div>
    </EngineCard>
  );
}
