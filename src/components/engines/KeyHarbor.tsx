import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

const CAPACITY = 20;
const REFILL_MS = 1200;
const KEYS = ["kh-prod-a1", "kh-prod-b2", "kh-fallback-c3"] as const;

export function KeyHarbor() {
  const [tokens, setTokens] = useState(CAPACITY);
  const [keyIdx, setKeyIdx] = useState(0);
  const [log, setLog] = useState<{ code: number; text: string }[]>([]);

  useEffect(() => {
    const i = setInterval(() => setTokens((t) => Math.min(CAPACITY, t + 1)), REFILL_MS);
    return () => clearInterval(i);
  }, []);

  const push = (code: number, text: string) =>
    setLog((p) => [{ code, text }, ...p].slice(0, 6));

  const request = (cost: number) => {
    if (tokens < cost) {
      push(429, `429 rate-limited · need ${cost}, have ${tokens}`);
      setKeyIdx((k) => (k + 1) % KEYS.length);
      return;
    }
    setTokens((t) => t - cost);
    const fail = Math.random() < 0.15;
    if (fail) {
      const next = (keyIdx + 1) % KEYS.length;
      setKeyIdx(next);
      push(401, `401 upstream · rotate → ${KEYS[next]}`);
      return;
    }
    push(200, `200 proxied · AES-256-GCM enclave · ${KEYS[keyIdx]}`);
  };

  const pct = (tokens / CAPACITY) * 100;

  return (
    <EngineCard
      id="ENG-25"
      phi="φ₂₅"
      title="KeyHarbor"
      subtitle="L7 least-privilege gateway · token bucket O(1)"
      status={tokens === 0 ? "THROTTLED" : "ROUTING"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="border border-border bg-background px-2 py-2">
          <div className="flex items-baseline justify-between font-mono text-[10px]">
            <span className="text-muted-foreground">BUCKET r=1/1.2s</span>
            <span className="tabular-nums text-accent">
              {tokens}/{CAPACITY}
            </span>
          </div>
          <div className="mt-1.5 h-2 border border-border">
            <div
              className={`h-full transition-[width] duration-300 ${tokens === 0 ? "bg-destructive" : "bg-accent"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[9px]">
          {KEYS.map((k, i) => (
            <div
              key={k}
              className={`px-1.5 py-1.5 ${i === keyIdx ? "bg-accent/15 text-accent" : "bg-card text-muted-foreground"}`}
            >
              <div className="truncate">{k}</div>
              <div>{i === keyIdx ? "ACTIVE" : "STANDBY"}</div>
            </div>
          ))}
        </div>

        <div className="min-h-0 flex-1 overflow-auto border border-border bg-background p-2 font-mono text-[10px] leading-[1.6]">
          {log.length === 0 && <div className="text-muted-foreground">no proxied requests</div>}
          {log.map((l, i) => (
            <div
              key={i}
              className={
                l.code === 200
                  ? "text-accent"
                  : l.code === 429
                    ? "text-destructive"
                    : "text-foreground/80"
              }
            >
              {l.text}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => request(1)}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            PROXY REQ (1)
          </button>
          <button
            onClick={() => request(6)}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            BURST (6)
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
