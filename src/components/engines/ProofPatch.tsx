import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

const STEPS = [
  "git fetch --depth=1 origin",
  "git checkout -b fix/causalrail-9f13c0a4",
  "git apply patches/counterfactual.diff",
  "nano-sandbox exec -- npm test",
] as const;

export function ProofPatch() {
  const [lines, setLines] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const verify = () => {
    if (running) return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setRunning(true);
    setExitCode(null);
    setLines([]);
    STEPS.forEach((s, i) => {
      timers.current.push(
        setTimeout(() => setLines((p) => [...p, `$ ${s}`]), (i + 1) * 550),
      );
    });
    timers.current.push(
      setTimeout(() => {
        const code = Math.random() < 0.7 ? 0 : 1;
        setExitCode(code);
        setLines((p) => [
          ...p,
          code === 0
            ? "tests: 12 passed, 0 failed → exit 0"
            : "tests: 9 passed, 3 failed → exit 1",
          code === 0
            ? "POST /repos/:o/:r/pulls → PR #418 opened"
            : "branch discarded · counterfactual logged",
        ]);
        setRunning(false);
      }, (STEPS.length + 1) * 550),
    );
  };

  return (
    <EngineCard
      id="ENG-22"
      phi="φ₂₂"
      title="ProofPatch"
      subtitle="ephemeral sandbox verification · binary outcome"
      status={running ? "VERIFYING" : exitCode === null ? "IDLE" : exitCode === 0 ? "PROVEN" : "REJECTED"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="h-40 min-h-0 flex-1 overflow-auto border border-border bg-background p-2 font-mono text-[10px] leading-[1.6]">
          <div className="text-muted-foreground">isolated context · no production mutation</div>
          {lines.map((l, i) => (
            <div
              key={i}
              className={
                l.includes("exit 1") || l.includes("discarded")
                  ? "text-destructive"
                  : l.includes("exit 0") || l.includes("PR #")
                    ? "text-accent"
                    : "text-foreground/80"
              }
            >
              {l}
            </div>
          ))}
          {running && <div className="animate-pulse text-accent">▌</div>}
        </div>

        <div className="grid grid-cols-2 gap-px border border-border bg-border font-mono text-[10px]">
          <div className="bg-card px-2 py-1.5">
            <div className="text-muted-foreground">EXIT CODE</div>
            <div
              className={`tabular-nums ${exitCode === 0 ? "text-accent" : exitCode === 1 ? "text-destructive" : "text-foreground"}`}
            >
              {exitCode === null ? "—" : exitCode}
            </div>
          </div>
          <div className="bg-card px-2 py-1.5">
            <div className="text-muted-foreground">BRANCH</div>
            <div className="truncate text-foreground">fix/causalrail-9f13c0a4</div>
          </div>
        </div>

        <button
          onClick={verify}
          disabled={running}
          className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
        >
          {running ? "VERIFYING…" : "APPLY & VERIFY PATCH"}
        </button>
      </div>
    </EngineCard>
  );
}
