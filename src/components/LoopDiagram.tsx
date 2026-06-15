import { Fragment } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BarChart3,
  CheckCircle2,
  RotateCw,
  Search,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

type LoopNode = {
  step: string;
  label: string;
  metric: string;
  description: string;
  icon: LucideIcon;
  color: string;
};

const nodes: LoopNode[] = [
  {
    step: "01",
    label: "Measure",
    metric: "20 prompts",
    description: "Across ChatGPT, Gemini, Google AI surfaces, and Perplexity on eligible plans.",
    icon: BarChart3,
    color: "hsl(var(--brand-accent))",
  },
  {
    step: "02",
    label: "Diagnose",
    metric: "3 gaps detected",
    description: "Classified as absence, citation, accuracy, comparison, or action gap.",
    icon: Search,
    color: "hsl(var(--brand-accent))",
  },
  {
    step: "03",
    label: "Execute",
    metric: "1 action queued",
    description: "Brand-safe recommendations and drafts routed for human review.",
    icon: Sparkles,
    color: "hsl(var(--brand-accent))",
  },
  {
    step: "04",
    label: "Verify",
    metric: "+5pp citation rate",
    description: "Re-tested against the same prompt set after the action shipped.",
    icon: CheckCircle2,
    color: "hsl(var(--brand-accent))",
  },
];

const withAlpha = (hsl: string, alpha: number) =>
  hsl.replace(")", ` / ${alpha})`);

const NodeCard = ({ node }: { node: LoopNode }) => {
  const Icon = node.icon;
  return (
    <article
      className="rounded-xl border bg-card/50 backdrop-blur-md p-5 text-left transition-transform duration-300 hover:-translate-y-0.5 relative overflow-hidden"
      style={{ borderColor: withAlpha(node.color, 0.25) }}
    >
      <div
        className="absolute -top-12 -right-12 h-24 w-24 rounded-full blur-3xl"
        style={{ backgroundColor: withAlpha(node.color, 0.1) }}
      />
      <div className="relative">
        <div className="flex items-center gap-2 mb-3">
          <div
            className="h-8 w-8 rounded-md flex items-center justify-center"
            style={{ backgroundColor: withAlpha(node.color, 0.12) }}
          >
            <Icon className="h-4 w-4" style={{ color: node.color }} />
          </div>
          <span
            className="text-[10px] uppercase tracking-widest font-semibold"
            style={{ color: node.color }}
          >
            Step {node.step}
          </span>
        </div>
        <h3 className="font-display text-base font-semibold text-foreground mb-1">
          {node.label}
        </h3>
        <p
          className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2"
          style={{ color: node.color }}
        >
          {node.metric}
        </p>
        <p className="text-xs text-muted-foreground leading-snug">
          {node.description}
        </p>
      </div>
    </article>
  );
};

const ArrowCell = ({
  direction,
  color,
}: {
  direction: "right" | "down" | "left" | "up";
  color: string;
}) => {
  const Icon =
    direction === "right"
      ? ArrowRight
      : direction === "down"
        ? ArrowDown
        : direction === "left"
          ? ArrowLeft
          : ArrowUp;
  return (
    <div className="flex items-center justify-center">
      <Icon className="h-5 w-5" style={{ color: withAlpha(color, 0.55) }} />
    </div>
  );
};

const LoopDiagram = () => {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop: 3-col grid with arrows on edges and a center indicator */}
      <div
        className="hidden md:grid gap-4 items-stretch"
        style={{
          gridTemplateColumns: "1fr 3rem 1fr",
          gridTemplateRows: "auto 3.5rem auto",
        }}
      >
        <NodeCard node={nodes[0]} />
        <ArrowCell direction="right" color={nodes[0].color} />
        <NodeCard node={nodes[1]} />

        <ArrowCell direction="up" color={nodes[3].color} />
        <div className="flex items-center justify-center">
          <div
            className="h-10 w-10 rounded-full border border-border/40 bg-card/60 backdrop-blur-md flex items-center justify-center"
            aria-hidden="true"
          >
            <RotateCw
              className="h-4 w-4 text-muted-foreground/70"
              style={{ animation: "spin 12s linear infinite" }}
            />
          </div>
        </div>
        <ArrowCell direction="down" color={nodes[1].color} />

        <NodeCard node={nodes[3]} />
        <ArrowCell direction="left" color={nodes[2].color} />
        <NodeCard node={nodes[2]} />
      </div>

      {/* Mobile: vertical stack with down arrows + closing-loop hint */}
      <div className="md:hidden flex flex-col gap-3">
        {nodes.map((node, i) => (
          <Fragment key={node.step}>
            <NodeCard node={node} />
            {i < nodes.length - 1 ? (
              <ArrowCell direction="down" color={node.color} />
            ) : null}
          </Fragment>
        ))}
        <p className="text-center text-xs text-muted-foreground/70 mt-1 inline-flex items-center justify-center gap-1.5">
          <RotateCw className="h-3 w-3" />
          Verify feeds back into Measure — the loop closes
        </p>
      </div>

      <p className="mt-6 text-center text-xs text-muted-foreground/60 leading-relaxed">
        Snapshot of one customer workspace. Numbers reflect operational state, not aggregate marketing claims.
      </p>
    </div>
  );
};

export default LoopDiagram;
