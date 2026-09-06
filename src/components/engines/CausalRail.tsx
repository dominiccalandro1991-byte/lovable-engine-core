import { useState } from "react";
import { EngineCard } from "./EngineCard";

type Trace = {
  hash: string;
  signature: string;
  freq: number;
  cls: string;
};

const SIGNATURES = [
  { sig: "TypeError: cannot read 'id' of undefined", cls: "NULL-DEREF" },
  { sig: "ETIMEDOUT connect 10.0.0.4:5432", cls: "NET-TIMEOUT" },
  { sig: "error TS2345: argument type mismatch", cls: "TYPE-ERROR" },
  { sig: "OOM: JS heap out of memory", cls: "MEM-PRESSURE" },
] as const;

const SEED: Trace[] = [
  { hash: "9f13c0a4", signature: SIGNATURES[0].sig, freq: 3, cls: SIGNATURES[0].cls },
  { hash: "41ba7d29", signature: SIGNATURES[1].sig, freq: 1, cls: SIGNATURES[1].cls },
];

function pseudoHash(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0).toString(16).padStart(8, "0");
}

export function CausalRail() {
  const [traces, setTraces] = useState<Trace[]>(SEED);
  const [last, setLast] = useState<"NEW" | "DEDUPE" | null>(null);
  const [runs, setRuns] = useState(4);

  const ingest = () => {
    const pick = SIGNATURES[Math.floor(Math.random() * SIGNATURES.length)]!;
    const normalized = pick.sig.replace(/0x[0-9a-f]+|\d{2}:\d{2}:\d{2}/g, "<EPH>");
    const hash = pseudoHash(normalized);
    setRuns((r) => r + 1);
    setTraces((prev) => {
      const hit = prev.find((t) => t.hash === hash);
      if (hit) {
        setLast("DEDUPE");
        return prev.map((t) => (t.hash === hash ? { ...t, freq: t.freq + 1 } : t));
      }
      setLast("NEW");
      return [{ hash, signature: normalized, freq: 1, cls: pick.cls }, ...prev].slice(0, 6);
    });
  };

  return (
    <EngineCard
      id="ENG-21"
      phi="φ₂₁"
      title="CausalRail"
      subtitle="CI failure attribution · SHA-256 dedupe · O(L) normalize"
      status={last === "DEDUPE" ? "CACHE HIT" : "INGESTING"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["WORKFLOW_RUNS", String(runs)],
            ["UNIQUE TRACES", String(traces.length)],
            ["INFER SAVED", `${traces.reduce((a, t) => a + t.freq - 1, 0)}×`],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <div className="text-muted-foreground">{k}</div>
              <div className="tabular-nums text-accent">{v}</div>
            </div>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto border border-border bg-background">
          <table className="w-full font-mono text-[10px]">
            <thead>
              <tr className="bg-secondary text-left text-muted-foreground">
                <th className="px-2 py-1 font-normal">H(trace)</th>
                <th className="px-2 py-1 font-normal">CLASS</th>
                <th className="px-2 py-1 text-right font-normal">n</th>
              </tr>
            </thead>
            <tbody>
              {traces.map((t) => (
                <tr key={t.hash} className="border-t border-border odd:bg-secondary/30">
                  <td className="px-2 py-1 text-accent">{t.hash}</td>
                  <td className="max-w-0 truncate px-2 py-1 text-foreground/80" title={t.signature}>
                    {t.cls}
                  </td>
                  <td className="px-2 py-1 text-right tabular-nums text-foreground">{t.freq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] text-muted-foreground">
            {last === "DEDUPE"
              ? "IDEMPOTENT · counter incremented O(1)"
              : last === "NEW"
                ? "DISPATCHED → OpenRouter root-cause"
                : "awaiting workflow_run webhook"}
          </span>
          <button
            onClick={ingest}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            INGEST WEBHOOK
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
