import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PromptPulseTable from "@/components/promptpulse/PromptPulseTable";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { getVertical, verticals, verticalTldr } from "@/lib/promptPulse";
import { ArrowRight } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

interface Props {
  slug?: string;
}

const Stat = ({ n, label, color }: { n: number | string; label: string; color?: string }) => (
  <div className="rounded-xl border border-border/30 bg-card/40 px-4 py-3">
    <span className="block font-display text-2xl font-bold" style={color ? { color } : undefined}>
      {n}
    </span>
    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</span>
  </div>
);

const PromptPulseVertical = ({ slug: configuredSlug }: Props) => {
  const { vertical: routeSlug } = useParams();
  const v = getVertical(configuredSlug ?? routeSlug);

  useEffect(() => {
    if (!v) return;
    document.title = `Prompt Pulse — ${v.short}: what buyers ask AI (2026) | SolCrys`;
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (desc) {
      desc.content = `The real questions ${v.short} buyers ask AI engines, ranked by demand and trend. Free, updated monthly.`;
    }
  }, [v]);

  if (!v) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <div className="container mx-auto max-w-5xl px-6">
          <nav className="mb-6 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/prompt-pulse/" className="hover:text-foreground">
              Prompt Pulse
            </a>
            <span className="mx-2">/</span>
            <span>{v.short}</span>
          </nav>

          <header className="mb-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(195_90%_55%)]">
              Prompt Pulse · Free AI demand data
            </p>
            <h1 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">
              The prompts {v.short} buyers ask AI
            </h1>
            <p className="max-w-3xl border-l-2 border-[hsl(195_90%_55%)] pl-4 text-lg leading-relaxed text-muted-foreground">
              {verticalTldr(v)}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Stat n={v.stats.prompts} label="prompts" />
              <Stat n={v.stats.rising} label="rising" color="hsl(142 70% 45%)" />
              <Stat n={v.stats.cooling} label="cooling" color="hsl(18 85% 58%)" />
              <Stat n={v.stats.decision} label="purchase-ready" color="hsl(40 85% 55%)" />
              <Stat n={v.updated} label="updated · monthly" />
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Each row is one real question buyers ask AI engines, scored by the SolCrys Prompt
              Pulse index. US / English.
            </p>
          </header>

          {/* Vertical switcher */}
          <div className="mb-8 flex flex-wrap gap-2">
            {verticals.map((other) => (
              <a
                key={other.slug}
                href={`/prompt-pulse/${other.slug}/`}
                className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${
                  other.slug === v.slug
                    ? "border-[hsl(195_90%_55%)] bg-[hsl(195_90%_55%/0.1)] text-foreground"
                    : "border-border/40 text-muted-foreground hover:border-[hsl(195_90%_55%/0.5)] hover:text-foreground"
                }`}
              >
                {other.short}
              </a>
            ))}
          </div>

          <PromptPulseTable vertical={v} />

          {/* About this data (proprietary framing) */}
          <section className="mt-12 rounded-xl border border-border/30 bg-card/40 p-6">
            <h2 className="mb-2 text-xl font-bold tracking-tight">About this data</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <strong className="text-foreground">Prompt Demand Score (0–100)</strong> is SolCrys's
              proprietary measure of how much real buyer demand sits behind each prompt across AI
              answer engines, refreshed monthly. Scores are relative within each vertical. By design
              we publish ranking and movement, not vanity absolute counts.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              The full methodology powers SolCrys's AI-visibility measurement product.{" "}
              <a
                href={AUDIT_URL}
                onClick={() => trackAuditClick("prompt_pulse_about")}
                className="text-[hsl(195_90%_55%)] underline-offset-4 hover:underline"
              >
                Talk to us about coverage →
              </a>
            </p>
          </section>

          {/* CTA */}
          <section className="mt-6 rounded-2xl border border-[hsl(195_90%_55%/0.3)] bg-[hsl(195_90%_55%/0.06)] p-8 text-center">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[hsl(195_90%_55%)]">
              Free AI visibility audit
            </p>
            <h2 className="mb-2 text-2xl font-bold tracking-tight">
              Does AI mention <em>you</em> when buyers ask these?
            </h2>
            <p className="mx-auto mb-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              SolCrys maps these prompts to whether your brand is mentioned, cited, or missing across
              ChatGPT, Perplexity, Gemini and Google AI Overviews — so you know which pages to ship
              next.
            </p>
            <a
              href={AUDIT_URL}
              onClick={() => trackAuditClick("prompt_pulse_vertical")}
              className="inline-flex items-center gap-2 rounded-lg bg-[hsl(195_90%_55%)] px-5 py-2.5 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              Run my free audit
              <ArrowRight className="h-4 w-4" />
            </a>
          </section>

          <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
            Prompt Pulse reports directional demand signals, not exact query counts. Figures are
            SolCrys estimates and may change as models and data refresh. Snapshot {v.updated} · US /
            English · updated monthly.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PromptPulseVertical;
