import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Search, BarChart3, Target, Wrench } from "lucide-react";
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
  "Free ChatGPT visibility tracker. See whether ChatGPT mentions, cites, or skips your brand on the prompts your buyers actually ask — then get the exact fix to ship, not just a score. About 5 minutes, no credit card.";
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
  {
    Icon: Wrench,
    title: "Get the fix, not just the score",
    body: "In the same free workspace, run a free content audit on a page: it hands you the exact change to ship — the JSON-LD block, the heading rewrite — with the points each fix recovers.",
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
    q: "Does it just give me a score, or help me fix it?",
    a: "Both. The visibility check is the measure step. In the same free workspace, a free content audit hands you the concrete fix to ship — the schema block, the heading rewrite — not just a score. That's what makes SolCrys a closed loop instead of a scoreboard: measure, diagnose, execute, verify. Re-testing at scale across every engine is the paid part.",
  },
  {
    q: "What should I do after I get my results?",
    a: "Run the loop. Pick the page behind your weakest prompt and run your free content audit on it — it returns the specific findings, the code or copy to ship, and the points each fix recovers. Ship the fix, then re-test: your next monthly audit (or a paid plan, on demand) re-scores the page so you can see the recovery. Score → fix → proof, instead of score → screenshot → forgotten.",
  },
  {
    q: "What's included in the free workspace?",
    a: "10 tracked prompts on ChatGPT with manual checks (3 per month), one content audit per month (with the concrete fixes), one deep analysis per month, and the Action Hub that turns findings into a task queue. Free forever, no credit card — email verification is all it takes. Paid plans add more engines, daily tracking, and more audits.",
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
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[hsl(var(--brand-accent)/0.2)] via-[hsl(var(--brand-accent)/0.1)] to-transparent blur-[120px]" />
          </div>
          <div className="container mx-auto px-6 max-w-4xl text-center relative z-10">
            <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent))]">
              Free ChatGPT visibility tracker
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
              Free ChatGPT{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">
                Visibility Tracker
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              See whether ChatGPT mentions, cites, or skips your brand on the
              prompts your buyers actually ask — or names a competitor instead.
              Then, unlike a scoreboard, the free workspace hands you the exact
              fix to ship. Results in about 5 minutes.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="max-w-2xl mx-auto mb-3"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus-within:border-[hsl(var(--brand-accent)/0.6)] focus-within:ring-4 focus-within:ring-[hsl(var(--brand-accent)/0.12)] transition-all">
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
                  Start Free
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
              {error ? (
                <p role="alert" className="mt-2.5 text-sm text-[hsl(var(--brand-accent))]">
                  {error}
                </p>
              ) : null}
            </form>

            <p className="text-sm text-muted-foreground/85">
              Free
              <span className="mx-2 text-muted-foreground/50">·</span>
              No credit card
              <span className="mx-2 text-muted-foreground/50">·</span>
              Includes your free workspace
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
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[hsl(var(--brand-accent)/0.12)] text-[hsl(var(--brand-accent))]">
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
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-accent))]" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground text-center mt-8 max-w-2xl mx-auto">
              Your report is saved to your free workspace — 10 tracked prompts,
              one content audit and one deep analysis a month, and the Action
              Hub that turns findings into fixes. No credit card.
            </p>
          </div>
        </section>

        {/* The artifact — show the actual fix (no competitor page does this) */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              Here's the fix you actually get
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed text-center max-w-2xl mx-auto mb-8">
              Every free checker we've tested ends at a score. A SolCrys audit
              ends with the change to ship. These are real findings from
              running the free content audit on our own About page — it scored
              60/100, and yes, we publish that:
            </p>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-6 md:p-8 text-left">
              <p className="text-sm font-semibold mb-1">
                Finding: schema type doesn't match the content
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                The page emits AboutPage + Organization markup; the template AI
                engines expect here is BlogPosting. The audit hands you the
                block to paste — <strong>14 points recoverable</strong>:
              </p>
              <pre className="rounded-xl border border-border/50 bg-card/40 p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-foreground/90">
                <code>{`{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "About SolCrys — AI Search and AEO Team",
  "author": {
    "@type": "Person",
    "name": "SolCrys Team",
    "worksFor": { "@type": "Organization", "name": "SolCrys" }
  },
  "dateModified": "2026-05-15"
}`}</code>
              </pre>
              <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-accent))]" />
                  <span>
                    Add source links to statistics and claims — the audit lists
                    which sentences, with before/after —{" "}
                    <strong className="text-foreground/90">
                      35 points recoverable
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-accent))]" />
                  <span>
                    Wrap key numbers in <code>&lt;strong&gt;</code> so AI
                    engines extract them —{" "}
                    <strong className="text-foreground/90">
                      20 points recoverable
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
              Every audit returns findings in this form: the current state, the
              update to make, the code to paste, and the points it recovers.
              You leave with a fix, not homework.
            </p>
          </div>
        </section>

        {/* Closed loop — positioning vs the scoreboard category */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Most free checkers stop at the score. This one reaches the fix.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              We surveyed 16 free AEO tools against the full loop — measure →
              diagnose → execute → verify. Free-forever trackers, one-shot
              graders, and trials all stop at measure or diagnose: a score and
              a gap list, then you're on your own. The SolCrys free workspace
              is the only free tier we found that reaches{" "}
              <em>execute</em> — it hands you the fix itself. The honest
              boundary: re-testing that the fix moved the answer uses your next
              monthly audit on free; on-demand re-tests and multi-engine
              tracking are the paid part.
            </p>
            <p className="text-sm text-muted-foreground">
              See the full comparison:{" "}
              <a
                href="/free-aeo-tools-that-fix-not-just-score/"
                className="text-[hsl(var(--brand-accent))] hover:underline"
              >
                16 free AEO tools, compared by the loop →
              </a>
            </p>
          </div>
        </section>

        {/* Honest free-vs-paid limits */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              Exactly what's free — no fine print
            </h2>
            <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
              Most free tools never state their limits. Here are ours,
              precisely:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-border/60 text-left">
                    <th className="py-3 pr-4 font-semibold"> </th>
                    <th className="py-3 pr-4 font-semibold">Free workspace</th>
                    <th className="py-3 font-semibold">Paid plans</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  <tr className="border-b border-border/40">
                    <td className="py-3 pr-4 text-foreground/90">Engines</td>
                    <td className="py-3 pr-4">ChatGPT — manual checks (3/mo)</td>
                    <td className="py-3">Up to 5 engines, tracked daily</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-3 pr-4 text-foreground/90">
                      Tracked prompts
                    </td>
                    <td className="py-3 pr-4">10</td>
                    <td className="py-3">20–60</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-3 pr-4 text-foreground/90">
                      Content audits (with the fix)
                    </td>
                    <td className="py-3 pr-4">1 / month</td>
                    <td className="py-3">4–10 / month</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-3 pr-4 text-foreground/90">
                      Deep analyses
                    </td>
                    <td className="py-3 pr-4">1 / month</td>
                    <td className="py-3">12–40 / month</td>
                  </tr>
                  <tr className="border-b border-border/40">
                    <td className="py-3 pr-4 text-foreground/90">
                      Action Hub (the fix itself)
                    </td>
                    <td className="py-3 pr-4">Included</td>
                    <td className="py-3">Included</td>
                  </tr>
                  <tr>
                    <td className="py-3 pr-4 text-foreground/90">
                      Re-test to verify the fix
                    </td>
                    <td className="py-3 pr-4">Next month's audit</td>
                    <td className="py-3">On demand, at scale</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-6">
              Full plan details on the{" "}
              <a
                href="https://app.solcrys.com/pricing"
                className="text-[hsl(var(--brand-accent))] hover:underline"
              >
                pricing page
              </a>
              .
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
            <div className="rounded-2xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.06)] p-10 md:p-14">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
                See if ChatGPT recommends you — then fix it.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Set up your free workspace: your first audit runs in about 5
                minutes, and the findings come with the fixes. Free, no credit
                card.
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
                  Start Free
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
