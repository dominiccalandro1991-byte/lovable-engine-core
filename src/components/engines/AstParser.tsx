import { useState } from "react";
import { EngineCard } from "./EngineCard";

type Node = { id: string; label: string; meta?: string; children?: Node[] };

const TREE: Node = {
  id: "prog",
  label: "Program",
  meta: "sourceType: module",
  children: [
    {
      id: "fn",
      label: "FunctionDeclaration",
      meta: "computeLoadFactor",
      children: [
        { id: "p1", label: "Identifier", meta: "payload" },
        { id: "p2", label: "Identifier", meta: "axles" },
        {
          id: "blk",
          label: "BlockStatement",
          children: [
            {
              id: "v1",
              label: "VariableDeclaration",
              meta: "const perAxle",
              children: [{ id: "bin1", label: "BinaryExpression", meta: "payload / axles" }],
            },
            {
              id: "if1",
              label: "IfStatement",
              children: [
                { id: "test", label: "BinaryExpression", meta: "stress > 1" },
                { id: "ret1", label: "ReturnStatement", meta: "ObjectExpression" },
              ],
            },
            { id: "ret2", label: "ReturnStatement", meta: "ObjectExpression" },
          ],
        },
      ],
    },
    { id: "exp", label: "ExportDefaultDeclaration", meta: "computeLoadFactor" },
  ],
};

function countNodes(n: Node): number {
  return 1 + (n.children ?? []).reduce((a, c) => a + countNodes(c), 0);
}

function TreeNode({
  node,
  depth,
  open,
  toggle,
}: {
  node: Node;
  depth: number;
  open: Record<string, boolean>;
  toggle: (id: string) => void;
}) {
  const hasKids = !!node.children?.length;
  const isOpen = open[node.id] !== false;
  return (
    <div>
      <button
        onClick={() => hasKids && toggle(node.id)}
        className="flex w-full items-baseline gap-1 px-2 py-[2px] text-left font-mono text-[10px] hover:bg-secondary/60"
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        <span className="w-3 shrink-0 text-muted-foreground">
          {hasKids ? (isOpen ? "▾" : "▸") : "·"}
        </span>
        <span className="text-accent">{node.label}</span>
        {node.meta && <span className="truncate text-muted-foreground">{node.meta}</span>}
      </button>
      {hasKids && isOpen && (
        <div>
          {node.children!.map((c) => (
            <TreeNode key={c.id} node={c} depth={depth + 1} open={open} toggle={toggle} />
          ))}
        </div>
      )}
    </div>
  );
}

export function AstParser() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (id: string) => setOpen((o) => ({ ...o, [id]: o[id] === false }));

  return (
    <EngineCard
      id="ENG-12"
      phi="φ₁₂"
      title="AST Parser"
      subtitle="syntax tree decomposition · espree-compatible"
      status="PARSED"
    >
      <div className="flex h-full flex-col gap-2">
        <div className="h-56 min-h-0 flex-1 overflow-auto border border-border bg-background py-1">
          <TreeNode node={TREE} depth={0} open={open} toggle={toggle} />
        </div>
        <div className="font-mono text-[9px] tracking-widest text-muted-foreground">
          NODES <span className="text-foreground">{countNodes(TREE)}</span> · DEPTH 5 · ERRORS 0
        </div>
      </div>
    </EngineCard>
  );
}
