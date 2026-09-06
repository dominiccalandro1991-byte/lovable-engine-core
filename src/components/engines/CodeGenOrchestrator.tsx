import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

const SRC = `function computeLoadFactor(payload, axles) {
  const perAxle = payload / axles;
  const stress = (perAxle - 150) / 350;
  if (stress > 1) return { ok: false, stress: 1 };
  return { ok: true, stress: Number(stress.toFixed(3)) };
}

export default computeLoadFactor;`;

export function CodeGenOrchestrator() {
  const [n, setN] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const i = setInterval(() => {
      setN((p) => (p >= SRC.length ? 0 : p + 2));
    }, 40);
    return () => clearInterval(i);
  }, [paused]);

  const text = SRC.slice(0, n);
  const pct = ((n / SRC.length) * 100).toFixed(0);

  return (
    <EngineCard
      id="ENG-11"
      phi="φ₁₁"
      title="Code Generation Orchestrator"
      subtitle="task-language emission · stream tokenizer"
      status={paused ? "HALTED" : "EMITTING"}
    >
      <div className="flex h-full flex-col gap-2">
        <pre className="h-56 min-h-0 flex-1 overflow-auto whitespace-pre-wrap break-words border border-border bg-background p-2 font-mono text-[10px] leading-[1.5] text-foreground/80">
          {text}
          <span className="text-accent">▍</span>
        </pre>
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            TOKENS <span className="text-foreground">{n}</span> / {SRC.length} ·{" "}
            <span className="text-accent">{pct}%</span>
          </div>
          <button
            onClick={() => setPaused((p) => !p)}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            {paused ? "RESUME OUTPUT" : "PAUSE OUTPUT"}
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
