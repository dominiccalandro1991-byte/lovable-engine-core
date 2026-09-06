import { EngineCard } from "./EngineCard";
import { Check } from "lucide-react";

const SYNTAX = [
  "Token balance",
  "Bracket pairing",
  "Semicolon policy",
  "Reserved words",
  "Encoding UTF-8",
];

const LOGIC = [
  "No infinite loops",
  "Unreachable code",
  "Null dereference",
  "Type coherence",
  "Return coverage",
];

function Column({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="min-w-0 border border-border bg-background">
      <div className="border-b border-border bg-secondary px-2 py-1 font-mono text-[9px] tracking-widest text-muted-foreground">
        {title}
      </div>
      <ul>
        {items.map((i) => (
          <li
            key={i}
            className="flex items-center gap-1.5 px-2 py-1 font-mono text-[10px] text-foreground/80 odd:bg-secondary/30"
          >
            <Check className="h-3 w-3 shrink-0 text-accent" strokeWidth={3} />
            <span className="truncate">{i}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SyntaxLogicValidator() {
  return (
    <EngineCard
      id="ENG-13"
      phi="φ₁₃"
      title="Syntax & Logic Validator"
      subtitle="static analysis sweep · 10 assertions"
      status="ALL PASS"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="grid flex-1 grid-cols-2 gap-2">
          <Column title="SYNTAX CHECKS" items={SYNTAX} />
          <Column title="LOGIC CHECKS" items={LOGIC} />
        </div>
        <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
          10 / 10 CLEARED · 0 WARNINGS · 0 BLOCKERS
        </div>
      </div>
    </EngineCard>
  );
}
