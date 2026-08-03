import { ArrowRight } from "lucide-react";
import {
  promptPulse,
  risingAcrossVerticals,
  trendArrow,
  trendColor,
  fmtTrend,
} from "@/lib/promptPulse";

// Free lead-gen surface on the homepage: a teaser for Prompt Pulse. Pulls a few
// of the fastest-rising prompts (round-robined across industries) straight from
// the published data so it stays fresh without manual edits.
const PromptPulseSection = () => {
  const rising = risingAcrossVerticals(4);
  const industries = promptPulse.verticals.length;

  return (
    <section id="prompt-pulse" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
              Prompt Pulse · AI demand data
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              See what your market is asking AI.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
              Demand data — a different lens from visibility tracking: the real questions buyers
              ask AI, sourced from ChatGPT, Perplexity, and Google AI Overviews signals across{" "}
              {industries} industries, ranked by demand.
            </p>
          </div>
          <a
            href="/prompt-pulse/"
            className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-accent))] hover:text-foreground transition-colors"
          >
            Explore Prompt Pulse
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {rising.map((p) => (
            <a
              key={`${p.vSlug}-${p.prompt}`}
              href={`/prompt-pulse/${p.vSlug}/`}
              className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-5 transition-all duration-300 hover:border-[hsl(var(--brand-accent)/0.35)] hover:-translate-y-1"
            >
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="text-xs uppercase tracking-wider text-muted-foreground">{p.vShort}</span>
                <span className="text-xs font-medium" style={{ color: trendColor(p.trend.label) }}>
                  {trendArrow(p.trend.label)} {fmtTrend(p.trend)}
                </span>
              </div>
              <p className="text-sm font-medium leading-relaxed text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                {p.prompt}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PromptPulseSection;
