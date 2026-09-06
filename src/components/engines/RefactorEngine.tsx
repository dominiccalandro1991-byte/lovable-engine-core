import { EngineCard } from "./EngineCard";

const BEFORE = [
  { t: "let out = [];", d: true },
  { t: "for (let i = 0; i < xs.length; i++) {", d: true },
  { t: "  out.push(xs[i] * 2);", d: true },
  { t: "}", d: true },
  { t: "return out;", d: false },
  { t: "", d: false },
];

const AFTER = [
  { t: "const out = xs.map((x) => x * 2);", a: true },
  { t: "", a: false },
  { t: "", a: false },
  { t: "", a: false },
  { t: "return out;", a: false },
  { t: "// alloc: -1 array copy", a: true },
];

function Pane({
  title,
  lines,
  tone,
}: {
  title: string;
  lines: { t: string; hl: boolean }[];
  tone: "del" | "add";
}) {
  return (
    <div className="min-w-0 border border-border bg-background">
      <div className="border-b border-border bg-secondary px-2 py-1 font-mono text-[9px] tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="font-mono text-[10px] leading-[1.6]">
        {lines.map((l, i) => (
          <div
            key={i}
            className={`flex gap-1 whitespace-pre px-2 ${
              l.hl
                ? tone === "del"
                  ? "bg-destructive/15 text-destructive"
                  : "bg-accent/15 text-accent"
                : "text-foreground/70"
            }`}
          >
            <span className="w-3 shrink-0 text-muted-foreground">
              {l.hl ? (tone === "del" ? "-" : "+") : " "}
            </span>
            <span className="truncate">{l.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RefactorEngine() {
  return (
    <EngineCard
      id="ENG-14"
      phi="φ₁₄"
      title="Autonomous Refactoring Engine"
      subtitle="perf + memory-safety rewrite · diff v3"
      status="OPTIMIZED"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2 overflow-auto">
          <Pane
            title="BEFORE"
            tone="del"
            lines={BEFORE.map((l) => ({ t: l.t, hl: l.d }))}
          />
          <Pane title="AFTER" tone="add" lines={AFTER.map((l) => ({ t: l.t, hl: l.a }))} />
        </div>
        <div className="grid grid-cols-3 gap-px border border-border bg-border font-mono text-[10px]">
          {[
            ["-LINES", "4"],
            ["+LINES", "2"],
            ["ΔHEAP", "-18%"],
          ].map(([k, v]) => (
            <div key={k} className="bg-card px-2 py-1.5">
              <div className="text-muted-foreground">{k}</div>
              <div className="text-accent tabular-nums">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </EngineCard>
  );
}
