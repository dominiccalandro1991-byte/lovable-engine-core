import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";
import { Loader2 } from "lucide-react";

const SUITES = [
  "core/ingest.spec.ts",
  "core/index.spec.ts",
  "kinematics/load.spec.ts",
  "codegen/ast.spec.ts",
];

export function TestHarness() {
  const [state, setState] = useState<"idle" | "running" | "done">("done");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);

  const run = () => {
    setState("running");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setState("done"), 2200);
  };

  return (
    <EngineCard
      id="ENG-15"
      phi="φ₁₅"
      title="Test Automation Harness"
      subtitle="unit suite execution · vitest runner"
      status={state === "running" ? "RUNNING" : "PASSING"}
    >
      <div className="flex h-full flex-col gap-2">
        <div className="h-56 min-h-0 flex-1 overflow-auto border border-border bg-background p-2 font-mono text-[10px] leading-[1.6]">
          <div className="text-muted-foreground">$ npm run test -- --reporter=dot</div>
          {state === "running" ? (
            <div className="mt-1 flex items-center gap-2 text-accent">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>executing suites…</span>
            </div>
          ) : (
            <>
              {SUITES.map((s) => (
                <div key={s} className="flex gap-2">
                  <span className="text-accent">PASS</span>
                  <span className="text-foreground/80">{s}</span>
                </div>
              ))}
              <div className="mt-1 text-foreground">
                Tests: <span className="text-accent">12 passed</span>, 0 failed, 0 skipped
              </div>
              <div className="text-muted-foreground">Duration: 2.19s · Coverage 94.2%</div>
            </>
          )}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            SUITES <span className="text-foreground">{SUITES.length}</span> · ASSERTS 41
          </div>
          <button
            onClick={run}
            disabled={state === "running"}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {state === "running" ? "RUNNING…" : "RUN SUITE"}
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
