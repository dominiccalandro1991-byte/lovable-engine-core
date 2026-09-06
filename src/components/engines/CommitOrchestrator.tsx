import { useEffect, useRef, useState } from "react";
import { EngineCard } from "./EngineCard";

const BRANCHES = ["main", "vail-cipher-core", "deploy/edge-prod", "hotfix/auth-rls"] as const;
const MESSAGES = [
  "feat: add edge latency matrix",
  "chore: bump deps for batch 4",
  "fix: viewport attestation bounds",
  "refactor: extract engine card shell",
  "docs: update deployment runbook",
] as const;

function randHash() {
  return Array.from({ length: 7 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("");
}

const INITIAL_LOG = [
  `a3f91c2  main                feat: scaffold deploy macro batch 4`,
  `7d21b08  vail-cipher-core    fix: hydration guards in engine 17`,
  `c4e0f56  deploy/edge-prod    ci: add production build compiler`,
  `1b8ad33  hotfix/auth-rls     docs: changelog for release v2.4.0`,
];

export function CommitOrchestrator() {
  const [log, setLog] = useState<string[]>(INITIAL_LOG);
  const [pushing, setPushing] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [log, pushing]);

  const sync = () => {
    if (pushing) return;
    setPushing(true);
    const branch = BRANCHES[Math.floor(Math.random() * BRANCHES.length)] ?? BRANCHES[0];
    const message = MESSAGES[Math.floor(Math.random() * MESSAGES.length)] ?? MESSAGES[0];
    const pushLines = [
      `Enumerating objects: ${12 + Math.floor(Math.random() * 40)}`,
      `Counting objects: 100%`,
      `Compressing objects: 100%`,
      `Writing objects: 100%`,
      `remote: Resolving deltas: 100%`,
      `remote: Build queued → ${branch}`,
      `${randHash()}  ${branch.padEnd(18)} ${message}`,
    ];

    let idx = 0;
    const interval = setInterval(() => {
      if (idx >= pushLines.length) {
        clearInterval(interval);
        setPushing(false);
        return;
      }
      setLog((prev) => [...prev.slice(-19), pushLines[idx]!]);
      idx++;
    }, 280);
  };

  return (
    <EngineCard
      id="ENG-18"
      phi="φ₁₈"
      title="Commit Orchestrator"
      subtitle="repository branch synchronization"
      status={pushing ? "PUSHING" : "SYNCED"}
    >
      <div className="flex h-full flex-col gap-2">
        <div ref={boxRef} className="h-40 min-h-0 flex-1 overflow-auto border border-border bg-background p-2 font-mono text-[10px] leading-[1.6]">
          <div className="text-muted-foreground">$ git log --oneline --decorate -20</div>
          {log.map((line, i) => (
            <div key={`${i}-${line.slice(0, 7)}`} className="text-foreground/80">
              <span className="text-accent">{line.slice(0, 7)}</span>
              <span className="text-muted-foreground">{line.slice(7)}</span>
            </div>
          ))}
          {pushing && (
            <div className="flex items-center gap-2 text-accent">
              <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span>git push origin HEAD --force-with-lease…</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="font-mono text-[10px] text-muted-foreground">
            BRANCHES <span className="text-foreground">{BRANCHES.length}</span>
          </div>
          <button
            onClick={sync}
            disabled={pushing}
            className="border border-border bg-secondary px-2 py-1 font-mono text-[10px] tracking-widest text-foreground transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
          >
            {pushing ? "PUSHING…" : "SYNC BRANCH"}
          </button>
        </div>
      </div>
    </EngineCard>
  );
}
