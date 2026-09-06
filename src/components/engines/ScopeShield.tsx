import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

type Rule = { key: string; rule: string; ok: boolean };

const RULES: Rule[] = [
  { key: "DATABASE_URL", rule: "z.string().url()", ok: true },
  { key: "GITHUB_PAT", rule: "HEAD 200 · TTL > 24h", ok: true },
  { key: "OPENROUTER_KEY", rule: "regex ^sk-or-", ok: true },
  { key: "REDIS_URL", rule: "z.string().url()", ok: false },
  { key: "NODE_ENV", rule: "enum[dev,prod]", ok: true },
];

export function ScopeShield() {
  const [phase, setPhase] = useState<"idle" | "running" | "done">("done");
  const [checked, setChecked] = useState(RULES.length);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setPhase("running");
    setChecked(0);
    RULES.forEach((_, i) =>
      timers.current.push(setTimeout(() => setChecked(i + 1), (i + 1) * 220)),
    );
    timers.current.push(setTimeout(() => setPhase("done"), (RULES.length + 1) * 220));
  };

  const failures = RULES.filter((r) => !r.ok);
  const exit = phase === "done" ? (failures.length ? 1 : 0) : null;

  return (
    <EngineCard
      id="ENG-24"
      phi="φ₂₄"
      title="ScopeShield"
      subtitle="pre-flight env validation proxy · fail-fast O(N)"
      status={phase === "running" ? "SCANNING" : exit === 0 ? "EXIT 0" : "EXIT 1"}
    >
      <div className="flex h-full flex-col gap-2">
        <ul className="min-h-0 flex-1 overflow-auto border border-border bg-background">
          {RULES.map((r, i) => {
            const evaluated = i < checked;
            return (
              <li
                key={r.key}
                className="flex items-center justify-between gap-2 border-b border-border px-2 py-1 font-mono text-[10px] last:border-b-0 odd:bg-secondary/30"
              >
                <span className="truncate text-foreground/80">{r.key}</span>
                <span className="shrink-0 text-muted-foreground">{r.rule}</span>
                <span
                  className={`w-10 shrink-0 text-right ${
                    !evaluated ? "text-muted-foreground" : r.ok ? "text-accent" : "text-destructive"
                  }`}
                >
                  {!evaluated ? "…" : r.ok ? "PASS" : "FAIL"}
                </span>
              </li>
            );
          })}
        </ul>

        <pre className="overflow-auto border border-border bg-card px-2 py-1.5 font-mono text-[9px] leading-[1.5] text-foreground/80">
{exit === 1
  ? `{ "exit": 1, "violations": [${failures.map((f) => `"${f.key}"`).join(", ")}] }`
  : exit === 0
    ? `{ "exit": 0, "violations": [] }`
    : `{ "status": "validating", "checked": ${checked}/${RULES.length} }`}
        </pre>

        <button
          onClick={run}
          disabled={phase === "running"}
          className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {phase === "running" ? "VALIDATING…" : "RUN PRE-FLIGHT"}
        </button>
      </div>
    </EngineCard>
  );
}
