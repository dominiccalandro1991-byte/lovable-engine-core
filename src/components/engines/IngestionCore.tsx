import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

type LogLine = { id: number; t: string; body: string; level: "ok" | "warn" | "err" };

const ROUTES = ["/v1/ingest", "/v1/stream", "/v1/batch", "/v1/replay"];
const LEVELS: LogLine["level"][] = ["ok", "ok", "ok", "warn", "ok", "err"];

let seq = 0;
function makeLine(): LogLine {
  const now = new Date();
  const level: LogLine["level"] =
    LEVELS[Math.floor(Math.random() * LEVELS.length)] ?? "ok";
  const payload = {
    route: ROUTES[Math.floor(Math.random() * ROUTES.length)],
    bytes: Math.floor(256 + Math.random() * 8192),
    lat_ms: +(Math.random() * 42).toFixed(2),
    shard: `s-${Math.floor(Math.random() * 8)}`,
  };
  return {
    id: seq++,
    t: now.toISOString().slice(11, 23),
    body: JSON.stringify(payload),
    level,
  };
}

export function IngestionCore() {
  const [lines, setLines] = useState<LogLine[]>([]);
  const [count, setCount] = useState(1042);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines(Array.from({ length: 12 }, makeLine));
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setLines((prev) => [...prev.slice(-120), makeLine()]);
      setCount((c) => c + 1);
    }, 700);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <EngineCard
      id="ENG-01"
      phi="φ₁"
      title="Ingestion Core"
      subtitle="async payload routing · buffer depth 4096"
    >
      <div className="flex h-full flex-col gap-2">
        <div
          ref={scrollRef}
          className="h-56 min-h-0 flex-1 overflow-y-auto border border-border bg-background p-2 font-mono text-[10px] leading-[1.5]"
        >
          {lines.map((l) => (
            <div key={l.id} className="flex gap-2 whitespace-pre">
              <span className="text-muted-foreground">{l.t}</span>
              <span
                className={
                  l.level === "err"
                    ? "text-destructive"
                    : l.level === "warn"
                      ? "text-chart-4"
                      : "text-accent"
                }
              >
                {l.level.toUpperCase().padEnd(4)}
              </span>
              <span className="text-foreground/80">{l.body}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            BUF <span className="text-foreground">{lines.length}</span> / 4096 · RX{" "}
            <span className="text-foreground">{count}</span>
          </div>
          <button
            onClick={() => setLines([])}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent"
          >
            FLUSH BUFFER
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
