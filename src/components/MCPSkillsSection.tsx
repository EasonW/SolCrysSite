import { ArrowRight, Github } from "lucide-react";
import siteContent from "@/content/siteContent.json";

// Tool/Skill counts are single-sourced from siteContent.home.mcpStats so the
// homepage and the /solcrys-mcp-and-skills reference can't drift apart.
const { tools: MCP_TOOL_COUNT, skills: SKILL_COUNT } = siteContent.home.mcpStats;

const MCPSkillsSection = () => {
  return (
    <section
      id="mcp"
      className="relative py-20 md:py-24 section-fade overflow-hidden"
    >
      <div className="absolute top-1/4 right-1/4 w-[420px] h-[420px] rounded-full bg-[hsl(var(--brand-accent)/0.04)] blur-[120px]" />
      <div className="absolute bottom-0 left-1/4 w-[360px] h-[360px] rounded-full bg-[hsl(var(--brand-accent)/0.03)] blur-[100px]" />

      <div className="container mx-auto px-6 max-w-3xl relative text-center">
        <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
          MCP &amp; Skills
        </p>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
          Your AEO workspace, readable by AI agents.
        </h2>
        <p className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8">
          {MCP_TOOL_COUNT} MCP tools + {SKILL_COUNT} open-source Skills. Plug SolCrys into Claude, ChatGPT, Cursor, and JetBrains.
        </p>

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
