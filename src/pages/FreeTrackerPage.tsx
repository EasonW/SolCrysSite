import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Search, BarChart3, Target } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { trackEvent } from "@/lib/analytics";

/**
 * Free ChatGPT Visibility Tracker — keyword-targeted marketing landing page.
 *
 * This is the *indexable ranking + AI-citation asset* on solcrys.com for the
 * "free ChatGPT visibility tracker" query cluster. The actual run lives in the
 * app (app.solcrys.com/audit, the free-tier flow); this page describes it,
 * captures a domain, and hands off — mirroring the Ahrefs/Semrush/HubSpot
 * free-tool pattern (rich content + schema on the marketing domain, gated
 * action in-app). Static HTML + JSON-LD are emitted at build time by
 * scripts/prerender.mjs; the useEffect below only handles SPA navigations.
 */

const PAGE_TITLE =
  "Free ChatGPT Visibility Tracker — See If AI Recommends Your Brand | SolCrys";
const PAGE_DESCRIPTION =
  "Free ChatGPT visibility tracker. Enter your domain and see whether ChatGPT mentions, cites, or skips your brand on the prompts your buyers actually ask — about 5 minutes, no credit card.";
const CANONICAL = "https://solcrys.com/free-chatgpt-visibility-tracker/";

// Same loose URL-shape check the hero + /audit AuditFlow use, kept local so
// this page can reject typos before the cross-domain redirect.
function isValidUrlShape(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  const host = withoutProtocol.split(/[/?#]/)[0];
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
}

const STEPS = [
  {
    Icon: Search,
    title: "Enter your domain",
    body: "Start with your website — or a competitor's. No credit card.",
  },
  {
    Icon: BarChart3,
    title: "We ask ChatGPT your buyers' questions",
    body: "SolCrys runs the high-intent prompts people actually use to find products like yours, then reads how ChatGPT answers.",
  },
  {
    Icon: Target,
    title: "See where you show up — and where a rival wins",
    body: "Your visibility score, the prompts where AI skips you, and which competitor it names instead.",
  },
];

const REPORT_INCLUDES = [
  "Your ChatGPT visibility score",
  "The high-intent prompts where AI skips your brand",
  "Which competitor ChatGPT recommends in your place",
  "The citations and sources shaping the answer",
];

const FAQS = [
  {
    q: "Is the ChatGPT visibility tracker really free?",
    a: "Yes. You can check your brand's ChatGPT visibility for free, with no credit card. The free tier covers ChatGPT; paid plans add Gemini, Google AI Overviews, and Perplexity plus automatic daily tracking.",
  },
  {
    q: "Do I need to sign up?",
    a: "Enter your domain to start. To unlock the full report, save it, and track changes over time, you create a free workspace — still no credit card.",
  },
  {
    q: "Which AI engines does it cover?",
    a: "The free tracker checks ChatGPT. SolCrys also tracks Gemini, Google AI Overviews / AI Mode, Perplexity, and Claude on paid plans, so you can see your visibility across every major answer engine.",
  },
  {
    q: "How is this different from my Google ranking?",
    a: "Ranking #1 on Google does not mean AI engines recommend you. ChatGPT synthesizes an answer from many sources and often names a different brand than the top Google result. This tracker shows what AI actually says about you.",
  },
  {
    q: "How accurate is the result?",
    a: "We query the live engine on real buyer prompts and report what it returned, including the citations and competitors it surfaced. AI answers vary run to run, so SolCrys tracks them over time rather than from a single snapshot.",
  },
];

const FreeTrackerPage = () => {
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    const desc = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (desc) desc.content = PAGE_DESCRIPTION;
    const robots = document.querySelector<HTMLMetaElement>(
      'meta[name="robots"]',
    );
    if (robots) robots.content = "index,follow,max-image-preview:large";
    const canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]',
    );
    if (canonical) canonical.href = CANONICAL;
  }, []);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!isValidUrlShape(trimmed)) {
      setError("Please enter a valid URL (e.g., acme.com).");
      return;
    }
    setError(null);
    trackAuditClick("free_tracker_lp");
    trackEvent("request_audit_open_with_domain", {
      surface: "free_tracker_lp",
      domain: trimmed,
    });
    window.location.href = `${AUDIT_URL}?domain=${encodeURIComponent(trimmed)}&autostart=1`;
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24">
        {/* Hero + tool */}
        <section className="relative overflow-hidden pt-10 pb-16 md:pt-16">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent blur-[120px]" />
          </div>
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[hsl(195_90%_55%)]">
              Free ChatGPT visibility tracker
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
              Free ChatGPT{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">
                Visibility Tracker
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              See whether ChatGPT mentions, cites, or skips your brand on the
              prompts your buyers actually ask — or names a competitor instead.
              Results in about 5 minutes.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="max-w-2xl mx-auto mb-3"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus-within:border-[hsl(195_90%_55%/0.6)] focus-within:ring-4 focus-within:ring-[hsl(195_90%_55%/0.12)] transition-all">
                <label htmlFor="tracker-domain" className="sr-only">
                  Your website URL
                </label>
                <input
                  id="tracker-domain"
                  name="domain"
                  type="url"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="yourcompany.com"
                  autoComplete="url"
                  inputMode="url"
                  className="flex-1 min-w-0 px-5 py-4 sm:py-5 text-base sm:text-lg bg-transparent focus:outline-none placeholder:text-muted-foreground/70 text-foreground rounded-xl sm:rounded-l-xl sm:rounded-r-none text-left"
                />
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="text-base px-6 sm:px-7 py-6 sm:py-5 h-auto sm:rounded-l-none sm:rounded-r-xl whitespace-nowrap"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              {error ? (
                <p role="alert" className="mt-2.5 text-sm text-[hsl(0_70%_65%)]">
                  {error}
                </p>
              ) : null}
            </form>

            <p className="text-sm text-muted-foreground/85">
              Free
              <span className="mx-2 text-muted-foreground/50">·</span>
              No credit card
              <span className="mx-2 text-muted-foreground/50">·</span>
              Free workspace to save the report
            </p>

            <div className="mt-14 pt-8 border-t border-white/5">
              <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">
                Trusted by
              </p>
              <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-12 opacity-70">
                <img
                  src="/customers/uipath-logo.svg"
                  alt="UiPath"
                  className="h-6 md:h-7 w-auto"
                  loading="lazy"
                />
                <img
                  src="/customers/nextsilicon-logo.svg"
                  alt="NextSilicon"
                  className="h-4 md:h-5 w-auto invert dark:invert-0"
                  loading="lazy"
                />
                <img
                  src="/customers/wyze-logo.png"
                  alt="Wyze"
                  className="h-5 md:h-6 w-auto"
                  loading="lazy"
                />
                <img
                  src="/customers/clearlykept-logo.png"
                  alt="ClearlyKept"
                  className="h-5 md:h-6 w-auto dark:brightness-0 dark:invert"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </section>

        {/* What it checks — definitional (AEO fuel) */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              What "AI visibility" means — and why your Google rank doesn't cover it
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-center mb-10">
              When a buyer asks ChatGPT "what's the best tool for X," the answer
              names a short list of brands. AI visibility is whether{" "}
              <em>you</em> are on that list. It is decided by citations and
              sources the model trusts — not by where you rank on Google. The
              tracker checks three outcomes for every prompt:
            </p>
            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  label: "Mentioned",
                  body: "ChatGPT names your brand in the answer.",
                },
                {
                  label: "Cited",
                  body: "ChatGPT links to your page as a source.",
                },
                {
                  label: "Skipped",
                  body: "ChatGPT answers without you — often naming a rival.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6"
                >
                  <p className="font-display text-lg font-semibold mb-2">
                    {item.label}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12 text-center">
              How the free ChatGPT visibility tracker works
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {STEPS.map((step, i) => (
                <div key={step.title} className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(195_90%_55%/0.12)] text-[hsl(195_90%_55%)]">
                      <step.Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Step {i + 1}
                    </span>
                  </div>
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {step.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What you get */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-8 text-center">
              What's in your free report
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 max-w-2xl mx-auto">
              {REPORT_INCLUDES.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(195_90%_55%)]" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
              Free covers ChatGPT. Add Gemini, Google AI Overviews, and
              Perplexity — plus automatic daily tracking — on a paid plan when
              you're ready.
            </p>
          </div>
        </section>

        {/* FAQ */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-10 text-center">
              Free ChatGPT visibility tracker — FAQ
            </h2>
            <div className="grid gap-4">
              {FAQS.map((item) => (
                <div
                  key={item.q}
                  className="rounded-xl border border-border/50 bg-background/60 p-6"
                >
                  <h3 className="font-display text-lg font-semibold mb-2">
                    {item.q}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-border/40 py-20 md:py-24">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <div className="rounded-2xl border border-[hsl(195_90%_55%/0.25)] bg-[hsl(195_90%_55%/0.06)] p-10 md:p-14">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                See if ChatGPT recommends you in about 5 minutes.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Free workspace, no credit card. Enter your domain and get your
                ChatGPT visibility report.
              </p>
              <Button
                asChild
                variant="hero"
                size="lg"
                className="text-base px-8 py-6"
              >
                <a
                  href={AUDIT_URL}
                  onClick={() => trackAuditClick("free_tracker_lp_footer")}
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FreeTrackerPage;
