import { useEffect, useState } from "react";
import { EngineCard } from "./EngineCard";

function randHash() {
  const c = "0123456789abcdef";
  return Array.from({ length: 40 }, () => c[Math.floor(Math.random() * 16)]).join("");
}

export function PriorArtValidator() {
  const [progress, setProgress] = useState(0);
  const [valid, setValid] = useState(true);
  const [hash, setHash] = useState("");

  useEffect(() => {
    setHash(randHash());
  }, []);

  useEffect(() => {
    const i = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          setValid(Math.random() > 0.25);
          setHash(randHash());
          return 0;
        }
        return Math.min(100, p + 3 + Math.random() * 7);
      });
    }, 180);
    return () => clearInterval(i);
  }, []);

  return (
    <EngineCard
      id="ENG-03"
      phi="φ₃"
      title="Prior-Art Validator"
      subtitle="cryptographic baseline cross-reference"
      status={valid ? "VERIFIED" : "MISMATCH"}
    >
      <div className="flex h-full flex-col justify-between gap-3">
        <div className="flex items-center gap-2 border border-border bg-background px-2 py-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${valid ? "bg-accent" : "bg-destructive"}`}
            style={{
              boxShadow: `0 0 10px ${valid ? "var(--accent)" : "var(--destructive)"}`,
            }}
          />
          <span
            className={`font-mono text-[11px] tracking-widest ${valid ? "text-accent" : "text-destructive"}`}
          >
            {valid ? "BASELINE MATCH" : "BASELINE DIVERGENCE"}
          </span>
        </div>

        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>SHA-1 VERIFY SEQUENCE</span>
            <span className="text-foreground">{progress.toFixed(0)}%</span>
          </div>
          <div className="h-2 w-full border border-border bg-background">
            <div
              className={`h-full transition-[width] duration-150 ${valid ? "bg-accent" : "bg-destructive"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <dl className="grid grid-cols-2 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["DIGEST", `${hash.slice(0, 16)}…`],
            ["CORPUS", "12,884 refs"],
            ["COLLISIONS", valid ? "0" : "3"],
            ["ROUNDS", "80"],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <dt className="text-muted-foreground">{k}</dt>
              <dd className="truncate text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </EngineCard>
  );
}
