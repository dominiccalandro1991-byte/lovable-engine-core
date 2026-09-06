import { useMemo, useState } from "react";
import { EngineCard } from "./EngineCard";

const ROWS = [
  { k: "token.entropy", v: "7.9241", type: "f64" },
  { k: "token.count", v: "18,442", type: "u32" },
  { k: "lexeme.unique", v: "3,118", type: "u32" },
  { k: "ngram.window", v: "5", type: "u8" },
  { k: "stem.algo", v: "porter2", type: "str" },
  { k: "vector.dim", v: "1536", type: "u16" },
  { k: "index.shards", v: "8", type: "u8" },
  { k: "index.latency_ms", v: "12.44", type: "f64" },
  { k: "dedupe.ratio", v: "0.0821", type: "f64" },
  { k: "corpus.checksum", v: "b41f9ac2", type: "hex" },
  { k: "heuristic.mode", v: "adaptive", type: "str" },
  { k: "drift.sigma", v: "0.0034", type: "f64" },
];

export function HeuristicIndexer() {
  const [q, setQ] = useState("");
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? ROWS.filter((r) => (r.k + r.v).toLowerCase().includes(s)) : ROWS;
  }, [q]);

  return (
    <EngineCard
      id="ENG-02"
      phi="φ₂"
      title="Heuristic Indexer"
      subtitle="tokenization · structural mapping"
    >
      <div className="flex h-full flex-col gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="filter keys…"
          className="w-full border border-border bg-background px-2 py-1 font-mono text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-accent"
        />
        <div className="h-56 min-h-0 flex-1 overflow-y-auto border border-border bg-background">
          <table className="w-full border-collapse font-mono text-[10px]">
            <thead className="sticky top-0 bg-secondary text-muted-foreground">
              <tr>
                <th className="border-b border-border px-2 py-1 text-left font-normal tracking-widest">
                  KEY
                </th>
                <th className="border-b border-border px-2 py-1 text-right font-normal tracking-widest">
                  VALUE
                </th>
                <th className="border-b border-border px-2 py-1 text-right font-normal tracking-widest">
                  T
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.k} className="odd:bg-secondary/40">
                  <td className="px-2 py-1 text-foreground/80">{r.k}</td>
                  <td className="px-2 py-1 text-right text-accent">{r.v}</td>
                  <td className="px-2 py-1 text-right text-muted-foreground">{r.type}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-2 py-3 text-center text-muted-foreground">
                    NO MATCH
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="font-mono text-[10px] text-muted-foreground">
          {rows.length} / {ROWS.length} PAIRS
        </div>
      </div>
    </EngineCard>
  );
}
