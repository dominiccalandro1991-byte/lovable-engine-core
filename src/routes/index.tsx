import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IngestionCore } from "@/components/engines/IngestionCore";
import { HeuristicIndexer } from "@/components/engines/HeuristicIndexer";
import { PriorArtValidator } from "@/components/engines/PriorArtValidator";
import { AnomalyDetector } from "@/components/engines/AnomalyDetector";
import { AegisRouter } from "@/components/engines/AegisRouter";
import { KinematicLoad } from "@/components/engines/KinematicLoad";
import { TerrainAnalyzer } from "@/components/engines/TerrainAnalyzer";
import { TorqueThermal } from "@/components/engines/TorqueThermal";
import { StructuralValidator } from "@/components/engines/StructuralValidator";
import { MarketIndexer } from "@/components/engines/MarketIndexer";
import { CodeGenOrchestrator } from "@/components/engines/CodeGenOrchestrator";
import { AstParser } from "@/components/engines/AstParser";
import { SyntaxLogicValidator } from "@/components/engines/SyntaxLogicValidator";
import { RefactorEngine } from "@/components/engines/RefactorEngine";
import { TestHarness } from "@/components/engines/TestHarness";
import { TargetNodeSelector } from "@/components/engines/TargetNodeSelector";
import { EdgeLatencyMatrix } from "@/components/engines/EdgeLatencyMatrix";
import { CommitOrchestrator } from "@/components/engines/CommitOrchestrator";
import { MobileViewportAttestation } from "@/components/engines/MobileViewportAttestation";
import { ProductionBuildCompiler } from "@/components/engines/ProductionBuildCompiler";
import { CausalRail } from "@/components/engines/CausalRail";
import { ProofPatch } from "@/components/engines/ProofPatch";
import { IncidentDojo } from "@/components/engines/IncidentDojo";
import { ScopeShield } from "@/components/engines/ScopeShield";
import { KeyHarbor } from "@/components/engines/KeyHarbor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Diagnostic Console — 25 Engine Macro Platform" },
      {
        name: "description",
        content:
          "Segmented operations console for Engines 1-25: research ingestion, engineering simulation, code generation, deployment telemetry, and the micro-developer ecosystem.",
      },
      { property: "og:title", content: "Diagnostic Console — 25 Engine Macro Platform" },
      {
        property: "og:description",
        content:
          "High-density dark telemetry dashboard with five selectable macro batches covering all 25 diagnostic engines.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Clock() {
  const [t, setT] = useState("--:--:--");
  useEffect(() => {
    const tick = () => setT(new Date().toISOString().slice(11, 19) + "Z");
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);
  return <span className="tabular-nums text-foreground">{t}</span>;
}

const BATCHES = [
  {
    id: "b1",
    tab: "B1 · RESEARCH",
    label: "RESEARCH MACRO · BATCH 1",
    sublabel: "engines 01–05 · ingestion, indexing, prior-art, anomaly, aegis routing",
    range: "01–05",
  },
  {
    id: "b2",
    tab: "B2 · INVENTOR",
    label: "INVENTOR MACRO · BATCH 2",
    sublabel: "engines 06–10 · kinematic load, terrain, torque, structural, market index",
    range: "06–10",
  },
  {
    id: "b3",
    tab: "B3 · CODER",
    label: "CODER MACRO · BATCH 3",
    sublabel: "engines 11–15 · codegen, AST parse, validation, refactor, test harness",
    range: "11–15",
  },
  {
    id: "b4",
    tab: "B4 · DEPLOY",
    label: "DEPLOY MACRO · BATCH 4",
    sublabel: "engines 16–20 · target node, edge latency, commits, viewport, build compiler",
    range: "16–20",
  },
  {
    id: "b5",
    tab: "B5 · ECOSYSTEM",
    label: "MICRO-DEVELOPER ECOSYSTEM · BATCH 5",
    sublabel:
      "engines 21–25 · causalrail, proofpatch, incidentdojo, scopeshield, keyharbor",
    range: "21–25",
  },
] as const;

type BatchId = (typeof BATCHES)[number]["id"];

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-3 lg:grid-cols-6">{children}</div>;
}

function Index() {
  const [active, setActive] = useState<BatchId>("b5");
  const meta = BATCHES.find((b) => b.id === active)!;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-secondary/90 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2 px-3 py-2">
          <div>
            <h1 className="text-sm font-semibold tracking-widest">
              DIAGNOSTIC PLATFORM · MACRO DASHBOARD
            </h1>
            <p className="font-mono text-[10px] text-muted-foreground">
              engines 01–25 · segmented macro view · operations console
            </p>
          </div>
          <div className="flex items-center gap-3 font-mono text-[10px] text-muted-foreground">
            <span>
              LINK <span className="text-accent">STABLE</span>
            </span>
            <span>
              NODE <span className="text-foreground">aegis-04</span>
            </span>
            <Clock />
          </div>
        </div>

        <nav
          aria-label="Macro batch selector"
          className="mx-auto flex max-w-[1600px] gap-px overflow-x-auto border-t border-border bg-border"
        >
          {BATCHES.map((b) => {
            const on = b.id === active;
            return (
              <button
                key={b.id}
                onClick={() => setActive(b.id)}
                aria-current={on ? "page" : undefined}
                className={`flex-1 whitespace-nowrap px-3 py-2 text-left font-mono text-[10px] tracking-widest transition-colors ${
                  on
                    ? "bg-accent/15 text-accent"
                    : "bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="block">{b.tab}</span>
                <span className="block text-[9px] opacity-70">ENG {b.range}</span>
              </button>
            );
          })}
        </nav>
      </header>

      <main className="space-y-3">
        <div className="border-b border-border bg-secondary/50 px-3 py-2">
          <div className="mx-auto flex max-w-[1600px] items-center justify-between gap-2">
            <div>
              <h2 className="text-xs font-semibold tracking-widest">{meta.label}</h2>
              <p className="font-mono text-[10px] text-muted-foreground">{meta.sublabel}</p>
            </div>
            <span className="font-mono text-[9px] tracking-widest text-accent">ACTIVE</span>
          </div>
        </div>

        <div className="mx-auto max-w-[1600px] p-3">
          <div className={active === "b1" ? "" : "hidden"}>
            <Grid>
              <div className="lg:col-span-3">
                <IngestionCore />
              </div>
              <div className="lg:col-span-3">
                <HeuristicIndexer />
              </div>
              <div className="lg:col-span-2">
                <PriorArtValidator />
              </div>
              <div className="lg:col-span-2">
                <AnomalyDetector />
              </div>
              <div className="lg:col-span-2">
                <AegisRouter />
              </div>
            </Grid>
          </div>

          <div className={active === "b2" ? "" : "hidden"}>
            <Grid>
              <div className="lg:col-span-3">
                <KinematicLoad />
              </div>
              <div className="lg:col-span-3">
                <TerrainAnalyzer />
              </div>
              <div className="lg:col-span-2">
                <TorqueThermal />
              </div>
              <div className="lg:col-span-2">
                <StructuralValidator />
              </div>
              <div className="lg:col-span-2">
                <MarketIndexer />
              </div>
            </Grid>
          </div>

          <div className={active === "b3" ? "" : "hidden"}>
            <Grid>
              <div className="lg:col-span-3">
                <CodeGenOrchestrator />
              </div>
              <div className="lg:col-span-3">
                <AstParser />
              </div>
              <div className="lg:col-span-2">
                <SyntaxLogicValidator />
              </div>
              <div className="lg:col-span-2">
                <RefactorEngine />
              </div>
              <div className="lg:col-span-2">
                <TestHarness />
              </div>
            </Grid>
          </div>

          <div className={active === "b4" ? "" : "hidden"}>
            <Grid>
              <div className="lg:col-span-3">
                <TargetNodeSelector />
              </div>
              <div className="lg:col-span-3">
                <CommitOrchestrator />
              </div>
              <div className="lg:col-span-2">
                <EdgeLatencyMatrix />
              </div>
              <div className="lg:col-span-2">
                <MobileViewportAttestation />
              </div>
              <div className="lg:col-span-2">
                <ProductionBuildCompiler />
              </div>
            </Grid>
          </div>

          <div className={active === "b5" ? "" : "hidden"}>
            <Grid>
              <div className="lg:col-span-3">
                <CausalRail />
              </div>
              <div className="lg:col-span-3">
                <ProofPatch />
              </div>
              <div className="lg:col-span-2">
                <IncidentDojo />
              </div>
              <div className="lg:col-span-2">
                <ScopeShield />
              </div>
              <div className="lg:col-span-2">
                <KeyHarbor />
              </div>
            </Grid>
          </div>
        </div>
      </main>

      <footer className="border-t border-border px-3 py-2 text-center font-mono text-[9px] tracking-widest text-muted-foreground">
        MOCK TELEMETRY · NO PERSISTENT STORE · CLIENT-STATE SIMULATION
      </footer>
    </div>
  );
}
