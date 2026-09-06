import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

type Phase = "idle" | "running" | "pass" | "fail";

export function StructuralValidator() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [pct, setPct] = useState(0);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = () => {
    if (phase === "running") return;
    setPhase("running");
    setPct(0);
    const start = Date.now();
    const iv = window.setInterval(() => {
      const p = Math.min(100, ((Date.now() - start) / 3000) * 100);
      setPct(p);
      if (p >= 100) window.clearInterval(iv);
    }, 60);
    const t = window.setTimeout(() => {
      window.clearInterval(iv);
      setPct(100);
      setPhase(Math.random() > 0.35 ? "pass" : "fail");
    }, 3000);
    timers.current.push(t);
  };

  const stroke =
    phase === "running"
      ? "var(--chart-4)"
      : phase === "pass"
        ? "var(--accent)"
        : phase === "fail"
          ? "var(--destructive)"
          : "var(--muted-foreground)";

  return (
    <EngineCard
      id="ENG-09"
      phi="φ₉"
      title="Structural Integrity Validator"
      subtitle="finite element analysis · rig spec"
      status={
        phase === "running" ? "SOLVING" : phase === "idle" ? "STANDBY" : phase.toUpperCase()
      }
    >
      <div className="flex h-full flex-col gap-2">
        <div className="relative flex-1 border border-border bg-background">
          <svg viewBox="0 0 300 150" className="h-full w-full">
            <g fill="none" stroke={stroke} strokeWidth="1.5" className="transition-colors">
              <rect x="40" y="45" width="220" height="50" />
              <line x1="40" y1="70" x2="260" y2="70" strokeOpacity="0.4" />
              {Array.from({ length: 8 }, (_, i) => (
                <line
                  key={i}
                  x1={40 + i * 27.5}
                  y1="45"
                  x2={67.5 + i * 27.5}
                  y2="95"
                  strokeOpacity="0.35"
                />
              ))}
              <circle cx="85" cy="115" r="20" />
              <circle cx="215" cy="115" r="20" />
              <line x1="85" y1="95" x2="85" y2="95" />
              <path d="M40 60 L15 35 L15 25" />
              <rect x="60" y="25" width="180" height="20" strokeOpacity="0.5" />
            </g>
            {phase === "running" && (
              <line
                x1="0"
                y1="0"
                x2="300"
                y2="0"
                stroke="var(--accent)"
                strokeWidth="2"
                opacity="0.6"
                style={{ transform: `translateY(${(pct / 100) * 150}px)` }}
              />
            )}
          </svg>
          <span className="absolute left-2 top-2 font-mono text-[9px] tracking-widest text-muted-foreground">
            WIREFRAME · UTILITY WAGON REV-C
          </span>
        </div>

        <div className="h-1.5 w-full border border-border bg-background">
          <div
            className="h-full bg-chart-4 transition-[width] duration-100"
            style={{ width: `${pct}%` }}
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={run}
            disabled={phase === "running"}
            className="flex-1 border border-border bg-secondary px-2 py-2 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:cursor-not-allowed disabled:opacity-40"
          >
            {phase === "running" ? "▮ SOLVING FEA…" : "▶ RUN STRESS TEST"}
          </button>
          <span
            className={`shrink-0 border border-border px-2 py-2 font-mono text-[10px] tracking-widest ${
              phase === "pass"
                ? "border-accent text-accent"
                : phase === "fail"
                  ? "border-destructive text-destructive"
                  : "text-muted-foreground"
            }`}
          >
            {phase === "pass" ? "PASS" : phase === "fail" ? "FAIL" : "— — —"}
          </span>
        </div>
      </div>
    </EngineCard>
  );
}
