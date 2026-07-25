import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Sparkline from "@/components/promptpulse/Sparkline";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import {
  risingAcrossVerticals,
  trendArrow,
  trendColor,
  fmtTrend,
  verticals,
} from "@/lib/promptPulse";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";

const PromptPulseHub = () => {
  useEffect(() => {
    document.title = "Prompt Pulse — what your market is asking AI | SolCrys";
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc) {
      desc.content =
        "AI demand data: the real prompts buyers ask ChatGPT, Perplexity and AI Overviews across industries — ranked by demand and what's rising. Updated monthly.";
    }
  }, []);

  const rising = risingAcrossVerticals(12);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-5xl px-6">
          <header className="mb-10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-accent))]">
              Prompt Pulse · AI demand data
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              See what your market is asking AI
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground">
              The real questions buyers ask ChatGPT, Perplexity, and Google AI Overviews — by
              industry, ranked by demand, and showing what's heating up.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">US / English</p>
          </header>

          {/* Vertical directory — primary action: self-select your industry */}
          <section className="mb-12">
            <h2 className="mb-4 text-2xl font-bold tracking-tight">Browse by industry</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {verticals.map((v) => {
                const topRiser = v.prompts.find(
                  (p) => p.trend.label === "Rising" || p.trend.label === "New",
                );
                return (
                  <a
                    key={v.slug}
                    href={`/prompt-pulse/${v.slug}/`}
                    className="group rounded-xl border border-border/30 bg-card/40 p-5 transition-colors hover:border-[hsl(var(--brand-accent)/0.4)]"
                  >
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold group-hover:text-[hsl(var(--brand-accent))]">
                        {v.short}
                      </h3>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-[hsl(var(--brand-accent))]" />
                    </div>
                    <p className="mb-3 text-sm text-muted-foreground">{v.blurb}</p>
                    <p className="text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground">{v.stats.prompts}</span> prompts
                      {v.stats.rising > 0 ? (
                        <>
                          {" · "}
                          <span style={{ color: "hsl(var(--brand-accent))" }}>{v.stats.rising} rising</span>
                        </>
                      ) : null}
                      {" · "}
                      <span style={{ color: "hsl(var(--brand-accent))" }}>{v.stats.decision} purchase-ready</span>
                    </p>
                    {topRiser ? (
                      <p className="mt-2 truncate text-xs text-muted-foreground">
                        ▲ Hot: “{topRiser.prompt}”
                      </p>
                    ) : null}
                  </a>
                );
              })}
            </div>
          </section>

          {/* Cross-vertical rising leaderboard (secondary showcase — the "pulse") */}
          <section className="mb-12">
            <h2 className="mb-1 text-2xl font-bold tracking-tight">🔥 Rising across all industries</h2>
            <p className="mb-4 text-sm text-muted-foreground">
              The fastest-growing questions in AI answers right now, across every vertical we track.
            </p>
            <div className="overflow-x-auto rounded-xl border border-border/30">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-card/60">
                  <tr>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Prompt
                    </th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Trend
                    </th>
                    <th className="px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Industry
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rising.map((p) => (
                    <tr
                      key={`${p.vSlug}-${p.prompt}`}
                      className="border-t border-border/30 hover:bg-[hsl(var(--brand-accent)/0.04)]"
                    >
                      <td className="max-w-[460px] px-3 py-3 font-medium text-foreground">
                        {p.prompt}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Sparkline values={p.spark} color={trendColor(p.trend.label)} />{" "}
                        <span className="text-xs" style={{ color: trendColor(p.trend.label) }}>
                          {trendArrow(p.trend.label)} {fmtTrend(p.trend)}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <a
                          href={`/prompt-pulse/${p.vSlug}/`}
                          className="text-[hsl(var(--brand-accent))] underline-offset-4 hover:underline"
                        >
                          {p.vShort}
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* About */}
          <section className="mb-6 rounded-xl border border-border/30 bg-card/40 p-6">
            <h2 className="mb-2 text-xl font-bold tracking-tight">About this data</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Prompt Pulse runs on SolCrys's proprietary AEO methodology — the same framework behind
              our AI-visibility measurement — distilled from the real questions buyers ask across AI
              answer engines and the community sources they cite. Signals are relative within each
              industry and directional by design.{" "}
              <a
                href="/resources/"
                className="text-[hsl(var(--brand-accent))] underline-offset-4 hover:underline"
              >
                See the methodology in our resources →
              </a>
            </p>
          </section>

          {/* CTA */}
          <section className="rounded-2xl border border-[hsl(var(--brand-accent)/0.3)] bg-[hsl(var(--brand-accent)/0.06)] p-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent))]">
              Free · No credit card
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Want this for your brand and prompts?
            </h2>
            <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              See whether AI engines mention, cite, or miss you on the prompts your buyers actually
              ask — across ChatGPT, Perplexity, Gemini and Google AI Overviews.
            </p>
            <a
              href={AUDIT_URL}
              onClick={() => trackAuditClick("prompt_pulse_hub")}
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(var(--brand-accent))] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Track ChatGPT Visibility, Free
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptPulseHub;
