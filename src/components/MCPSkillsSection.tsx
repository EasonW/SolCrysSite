import { ArrowRight, Terminal, Github, BookOpen, Boxes } from "lucide-react";

const tools = [
  "solcrys_list_workspaces",
  "solcrys_get_visibility_insights",
  "solcrys_get_prompts_insights",
  "solcrys_get_citations_insights",
  "solcrys_get_citations",
  "solcrys_get_deep_analysis",
  "solcrys_get_content_audit_reports",
  "solcrys_get_tasks",
  "solcrys_get_prompts",
];

const skills = [
  { name: "weekly-cmo-brief", body: "One-page exec brief: headline KPIs, trends, recommended actions." },
  { name: "domain-influence-report", body: "Citation landscape by source type — Owned, Competitor, Editorial, UGC." },
  { name: "brand-footprint-gap-analysis", body: "Where you surface in AI answers + high-volume prompts you're missing." },
  { name: "action-driven-content", body: "Publication-ready first draft from the action queue, grounded in playbook + audit." },
];

const MCPSkillsSection = () => {
  return (
    <section
      id="mcp"
      className="relative py-24 md:py-32 section-fade overflow-hidden"
    >
      {/* Ambient orbs */}
      <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-[hsl(195_90%_55%/0.04)] blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full bg-[hsl(270_60%_50%/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-3">
            MCP &amp; Skills
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-5">
            Your AEO workspace, readable by AI agents.
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            The SolCrys MCP server turns the platform into a tool surface Claude, ChatGPT,
            Cursor, and JetBrains can call. Four open-source Skills chain those tools into
            CMO briefs, gap analyses, and publish-ready drafts — fork them on GitHub.
          </p>
        </div>

        {/* Install command */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="rounded-2xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40 bg-muted/30">
              <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-[11px] font-medium tracking-wider uppercase text-muted-foreground">
                Add to Claude Code in one command
              </span>
            </div>
            <pre className="px-5 py-4 text-sm md:text-[15px] text-foreground/90 font-mono overflow-x-auto leading-relaxed">
{`claude mcp add --transport http solcrys https://mcp.solcrys.com/mcp`}
            </pre>
          </div>
        </div>

        {/* Two-column: tools left, skills right */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-12">
          {/* MCP tools card */}
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Boxes className="h-4 w-4 text-[hsl(195_90%_55%)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(195_90%_55%)]">
                9 MCP tools, read-only
              </p>
            </div>
            <h3 className="font-heading text-xl text-foreground mb-3">
              Typed, discoverable, scoped to a workspace
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              OAuth on first call or a Personal Access Token for CI. Workspace permissions
              inherit from the dashboard — no superuser tokens, no write surface.
            </p>
            <ul className="grid grid-cols-1 gap-1.5">
              {tools.slice(0, 6).map((t) => (
                <li
                  key={t}
                  className="text-[13px] font-mono text-foreground/80 truncate"
                  title={t}
                >
                  {t}
                </li>
              ))}
              <li className="text-[13px] text-muted-foreground/70">
                + 3 more
              </li>
            </ul>
          </div>

          {/* Skills card */}
          <div className="rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 md:p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-4 w-4 text-[hsl(270_60%_60%)]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[hsl(270_60%_60%)]">
                4 open-source Skills, MIT
              </p>
            </div>
            <h3 className="font-heading text-xl text-foreground mb-3">
              Auto-chain MCP calls into deliverables
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Every Skill references <code className="px-1 py-0.5 rounded bg-muted/60 text-[12px]">soul.md</code> —
              three governance rules that prevent hallucinated metrics and off-goal recommendations.
            </p>
            <ul className="space-y-2">
              {skills.map((s) => (
                <li key={s.name} className="text-[13px] leading-snug">
                  <span className="font-mono text-foreground/90">solcrys-{s.name}</span>
                  <span className="text-muted-foreground"> — {s.body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="/why-we-bet-on-mcp/"
            className="inline-flex items-center gap-2 rounded-full bg-foreground text-background px-5 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
          >
            Read the founder note
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="/solcrys-mcp-and-skills/"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
          >
            Full reference
            <ArrowRight className="h-4 w-4" />
          </a>
          <a
            href="https://github.com/SolCrysAI/SolCrys-AEO-Skills"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/40 px-5 py-2.5 text-sm font-medium text-foreground hover:bg-muted/40 transition-colors"
          >
            <Github className="h-4 w-4" />
            View Skills repo
          </a>
        </div>
      </div>
    </section>
  );
};

export default MCPSkillsSection;
