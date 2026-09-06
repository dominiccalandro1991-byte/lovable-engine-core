import { useState } from "react";
import { EngineCard } from "./EngineCard";

export function MobileViewportAttestation() {
  const [width, setWidth] = useState(410);
  const nominal = width >= 400;

  return (
    <EngineCard
      id="ENG-19"
      phi="φ₁₉"
      title="Mobile Viewport Attestation"
      subtitle="responsive DOM scaling validation"
      status={nominal ? "NOMINAL" : "VALIDATING"}
    >
      <div className="flex h-full flex-col gap-3">
        <div className="space-y-1">
          <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
            <span>VIEWPORT WIDTH</span>
            <span className="text-foreground">{width}px</span>
          </div>
          <input
            type="range"
            min={390}
            max={430}
            value={width}
            onChange={(e) => setWidth(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
            <span>390</span>
            <span>430</span>
          </div>
        </div>

        <div className="flex flex-1 flex-col items-center justify-center border border-border bg-background py-3">
          <div className="mb-2 font-mono text-[9px] tracking-widest text-muted-foreground">
            RENDER TARGET
          </div>
          <div
            className="flex items-center justify-center border border-accent/40 bg-accent/10 transition-[width] duration-150"
            style={{ width: `${width / 4.3}%`, minWidth: 80, height: 80 }}
          >
            <span className="font-mono text-[10px] text-accent tabular-nums">
              {width}px
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border border-border bg-background px-2 py-2">
          <span
            className={`inline-block h-2.5 w-2.5 rounded-full ${
              nominal ? "bg-accent" : "bg-yellow-400"
            }`}
            style={{
              boxShadow: `0 0 10px ${
                nominal ? "var(--accent)" : "rgb(250 204 21)"
              }`,
            }}
          />
          <span
            className={`font-mono text-[11px] tracking-widest ${
              nominal ? "text-accent" : "text-yellow-400"
            }`}
          >
            {nominal
              ? "RESPONSIVE SCALING NOMINAL"
              : "VALIDATING RENDERING…"}
          </span>
        </div>
      </div>
    </EngineCard>
  );
}
