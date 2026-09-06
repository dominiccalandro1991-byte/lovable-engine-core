import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

const RADIUS = 38;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function ProductionBuildCompiler() {
  const [progress, setProgress] = useState(0);
  const [building, setBuilding] = useState(false);
  const [live, setLive] = useState(false);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const build = () => {
    if (building) return;
    setBuilding(true);
    setLive(false);
    setProgress(0);
    if (timer.current) clearInterval(timer.current);

    timer.current = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          if (timer.current) clearInterval(timer.current);
          setBuilding(false);
          setLive(true);
          return 100;
        }
        return Math.min(100, p + 2);
      });
    }, 80);
  };

  const dashOffset = CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE;

  return (
    <EngineCard
      id="ENG-20"
      phi="φ₂₀"
      title="Production Build Compiler"
      subtitle="static build + deployment pipeline"
      status={live ? "LIVE" : building ? "BUILDING" : "STANDBY"}
    >
      <div className="flex h-full flex-col items-center justify-center gap-4">
        <div className="relative flex items-center justify-center">
          <svg width="100" height="100" viewBox="0 0 100 100" className="-rotate-90">
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--border)"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="6"
              strokeLinecap="butt"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              className="transition-[stroke-dashoffset] duration-75"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-mono text-lg font-semibold tabular-nums text-foreground">
              {progress.toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <button
            onClick={build}
            disabled={building}
            className="border border-border bg-secondary px-4 py-1.5 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {building ? "COMPILING…" : "INITIATE BUILD"}
          </button>
          {live && (
            <span className="animate-pulse border border-accent bg-accent/15 px-2 py-0.5 font-mono text-[10px] tracking-widest text-accent">
              DEPLOYMENT LIVE
            </span>
          )}
        </div>

        <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
          TARGET <span className="text-foreground">static/export</span>
        </div>
      </div>
    </EngineCard>
  );
}
