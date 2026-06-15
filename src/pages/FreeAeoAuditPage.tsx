import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  Search,
  ClipboardList,
  Wrench,
  RefreshCw,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { trackEvent } from "@/lib/analytics";

/**
 * Free AEO Audit — keyword-targeted marketing landing page.
 *
 * The execution-intent sibling of /free-chatgpt-visibility-tracker/. Demand
 * research (2026-06-12): "free aeo audit" + "free geo audit tool" are
 * autocomplete-confirmed clusters with a fragmented SERP whose biggest
 * player (HubSpot's AEO Grader) is measure-only — while "execution engine"
 * (our category term) has zero query demand. So this page anchors on the
 * user's word ("audit") and delivers the execution-engine story in the
 * body: every finding ships with the fix attached.
 *
 * Same architecture as FreeTrackerPage: the actual run lives in the app
 * (app.solcrys.com/audit, the free workspace); this page describes it,
 * captures a domain, and hands off. Static HTML + JSON-LD are emitted at
 * build time by scripts/prerender.mjs; the useEffect below only handles
 * SPA navigations.
 */

const PAGE_TITLE =
  "Free AEO Audit Tool — Get the Fix, Not Just the Score | SolCrys";
const PAGE_DESCRIPTION =
  "Free AEO audit: score any page across 40+ AI-search checks and get the exact fix to ship — the schema block, the meta rewrite, the points each fix recovers. Free workspace, no credit card.";
const CANONICAL = "https://solcrys.com/free-aeo-audit/";

// Same loose URL-shape check the tracker LP + /audit AuditFlow use.
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
    body: "Your free workspace opens with a ChatGPT visibility read: 10 buyer-intent prompts, where you show up, who gets named instead.",
  },
  {
    Icon: ClipboardList,
    title: "Run your free content audit",
    body: "Point it at the page behind your weakest prompt. It scores 40+ checks across content quality, credibility, technical readability, and discoverability.",
  },
  {
    Icon: Wrench,
    title: "Get the fixes, not homework",
    body: "Every finding ships with the current state, the update to make, the code or copy to paste, and the points it recovers.",
  },
  {
    Icon: RefreshCw,
    title: "Ship, then re-test",
    body: "Re-audit the page to watch the score recover — your next monthly audit on free, on demand on paid plans.",
  },
];

const CATEGORIES = [
  {
    name: "Content quality",
    weight: "30%",
    body: "Does the page answer in the first 50 words, define terms, emphasize key numbers, and structure sections the way answer engines extract them?",
  },
  {
    name: "Credibility",
    weight: "35%",
    body: "Sourced statistics, authoritative external citations, author and expert attribution, promotional-language density — the signals engines weigh before citing you.",
  },
  {
    name: "Technical readability",
    weight: "20%",
    body: "JSON-LD present and matching the content type, schema completeness, text-to-HTML ratio, content visible without JavaScript.",
  },
  {
    name: "Discoverability",
    weight: "15%",
    body: "Meta description, internal and outbound links, canonical, sitemap presence, descriptive URL slug, crawler access for all major AI bots.",
  },
];

const FAQS = [
  {
    q: "What is an AEO audit?",
    a: "An AEO (Answer Engine Optimization) audit scores a page on how well AI engines like ChatGPT, Perplexity, and Google AI can retrieve, trust, cite, and summarize it — then tells you what to change. SolCrys's free audit runs 40+ checks across content quality, credibility, technical readability, and discoverability, and returns each finding with the concrete fix attached.",
  },
  {
    q: "What does the audit check?",
    a: "Four weighted categories: content quality (30%) — direct answers, term definitions, emphasized data; credibility (35%) — sourced statistics, external citations, author attribution; technical readability (20%) — JSON-LD that matches the content type, schema completeness, content visible without JavaScript; discoverability (15%) — meta description, links, canonical, sitemap, AI-crawler access.",
  },
  {
    q: "Is it really free?",
    a: "Yes. The free workspace includes one content audit per month with the full findings and fixes, plus 10 tracked ChatGPT prompts and one deep analysis. No credit card — email verification is all it takes. Paid plans add more engines, daily tracking, and more audits.",
  },
  {
    q: "AEO audit vs GEO audit — what's the difference?",
    a: "Same audit, different name. Some teams say GEO (Generative Engine Optimization), others say AEO (Answer Engine Optimization); both mean optimizing for AI-generated answers. The checks — schema, credibility signals, answer-ready structure, crawler access — are identical, so this free audit covers both.",
  },
  {
    q: "Do I get a score or the actual fix?",
    a: "Both, and that's the point. Most free AEO graders return a score and generic tips. Every SolCrys finding ships with the current state, the update to make, the code or copy to paste (the JSON-LD block, the meta rewrite), and the points it recovers — so you leave with a fix, not homework.",
  },
  {
    q: "What should I do after the audit?",
    a: "Ship the highest-point fixes first — each finding shows its points recoverable, so the priority order is explicit. Then re-test: re-auditing the same page shows the score recovery. On free that's your next monthly audit; paid plans re-test on demand and track the answer itself across engines daily.",
  },
  {
    q: "How is this different from a free AEO grader?",
    a: "Graders measure; this audit executes. We surveyed 16 free AEO tools against the loop — measure, diagnose, execute, verify — and the free offerings all stop at a score or a gap list. The SolCrys free workspace is the only free tier we found that reaches execute: it hands you the fix itself. The honest boundary: re-testing on free uses your next monthly audit.",
  },
  {
    q: "Do I need to sign up?",
    a: "Enter your domain to start. To run the audit, keep the findings, and track changes over time, you create a free workspace — email verification, no credit card.",
  },
];

const FreeAeoAuditPage = () => {
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
    trackAuditClick("free_aeo_audit_lp");
    trackEvent("request_audit_open_with_domain", {
      surface: "free_aeo_audit_lp",
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
              Free AEO audit
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight mb-5">
              Free AEO Audit —{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">
                get the fix, not just the score
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
              Most free AEO graders score you and stop. This audit runs 40+
              AI-search checks on your pages and returns every finding with the
              change to ship attached — the schema block, the meta rewrite, the
              points it recovers.
            </p>

            <form
              onSubmit={handleSubmit}
              noValidate
              className="max-w-2xl mx-auto mb-3"
            >
              <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus-within:border-[hsl(var(--brand-accent)/0.6)] focus-within:ring-4 focus-within:ring-[hsl(var(--brand-accent)/0.12)] transition-all">
                <label htmlFor="aeo-audit-domain" className="sr-only">
                  Your website URL
                </label>
                <input
                  id="aeo-audit-domain"
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
          </div>
        </section>

        {/* What it checks — the four real scoring categories */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              What a free AEO audit checks — 40+ checks, four weighted
              categories
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto text-center mb-10">
              AI engines decide what to cite using signals your Google rank
              never measured. The audit scores the four families that decide
              whether an answer engine retrieves, trusts, cites, and summarizes
              your page:
            </p>
            <div className="grid gap-5 md:grid-cols-2">
              {CATEGORIES.map((c) => (
                <div
                  key={c.name}
                  className="rounded-2xl border border-border/60 bg-card/40 p-6"
                >
                  <p className="font-display text-lg font-semibold mb-1">
                    {c.name}{" "}
                    <span className="text-sm font-normal text-muted-foreground">
                      · {c.weight} of the score
                    </span>
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {c.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works — the loop */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-5xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-12 text-center">
              How the free AEO audit works
            </h2>
            <div className="grid gap-8 md:grid-cols-4">
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
            <p className="text-sm text-muted-foreground text-center mt-10 max-w-2xl mx-auto">
              That cycle — measure, diagnose, execute, verify — is{" "}
              <a href="/#loop" className="text-[hsl(var(--brand-accent))] hover:underline">
                the SolCrys Loop
              </a>
              . The free workspace runs one full pass a month.
            </p>
          </div>
        </section>

        {/* The artifact — real findings with the fix attached */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              Findings come with the fix attached
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed text-center max-w-2xl mx-auto mb-8">
              Real findings from running this audit on our own About page — it
              scored 60/100, and yes, we publish that:
            </p>
            <div className="rounded-2xl border border-border/60 bg-card/40 p-6 md:p-8 text-left">
              <p className="text-sm font-semibold mb-1">
                Finding: meta description too thin to stand alone (109
                characters)
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                AI engines lean on the meta description to judge page relevance
                when they don't parse the full body. The audit hands you the
                rewrite — <strong>14 points recoverable</strong>:
              </p>
              <pre className="rounded-xl border border-border/50 bg-background/60 p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-foreground/90">
                <code>{`<meta name="description" content="Meet the SolCrys
team — AI search strategists, enterprise marketers,
and engineers building tools to measure and improve
brand visibility in AI-generated answers." />`}</code>
              </pre>
              <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-accent))]" />
                  <span>
                    Descriptive URL slug + the 301 redirect config to ship —{" "}
                    <strong className="text-foreground/90">
                      15 points recoverable
                    </strong>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(var(--brand-accent))]" />
                  <span>
                    Rephrase one H2 as a question so engines map it to user
                    queries — with the suggested heading —{" "}
                    <strong className="text-foreground/90">
                      15 points recoverable
                    </strong>
                  </span>
                </li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-6 max-w-2xl mx-auto">
              Current state, the update to make, the code to paste, the points
              it recovers — every finding, in that form.
            </p>
          </div>
        </section>

        {/* Positioning — audit vs grader */}
        <section className="border-t border-border/40 py-16 md:py-20 bg-card/20">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">
              Graders measure. This audit executes.
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-5">
              We surveyed 16 free AEO tools against the full loop — measure →
              diagnose → execute → verify. The free graders and checkers all
              stop at a score or a gap list; even the biggest one returns five
              scored dimensions and generic tips. The SolCrys free workspace is
              the only free tier we found that reaches <em>execute</em>: the
              audit hands you the fix itself. The honest boundary: re-testing
              on free uses your next monthly audit; on-demand re-tests and
              multi-engine tracking are the paid part.
            </p>
            <p className="text-sm text-muted-foreground">
              See the evidence:{" "}
              <a
                href="/free-aeo-tools-that-fix-not-just-score/"
                className="text-[hsl(var(--brand-accent))] hover:underline"
              >
                16 free AEO tools, compared by the loop →
              </a>{" "}
              · Just want visibility first?{" "}
              <a
                href="/free-chatgpt-visibility-tracker/"
                className="text-[hsl(var(--brand-accent))] hover:underline"
              >
                Free ChatGPT visibility tracker →
              </a>
            </p>
          </div>
        </section>

        {/* Honest free-vs-paid limits */}
        <section className="border-t border-border/40 py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-center">
              Exactly what's free — no fine print
            </h2>
            <div className="overflow-x-auto mt-8">
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
                    <td className="py-3 pr-4 text-foreground/90">
                      Content audits (with the fix)
                    </td>
                    <td className="py-3 pr-4">1 / month</td>
                    <td className="py-3">4–10 / month</td>
                  </tr>
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
              Free AEO audit — FAQ
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
                Audit a page. Ship the fix. Watch the score recover.
              </h2>
              <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
                Set up your free workspace — your first visibility read runs in
                about 5 minutes, and your free monthly audit comes with the
                fixes. Free, no credit card.
              </p>
              <Button
                asChild
                variant="hero"
                size="lg"
                className="text-base px-8 py-6"
              >
                <a
                  href={AUDIT_URL}
                  onClick={() => trackAuditClick("free_aeo_audit_lp_footer")}
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

export default FreeAeoAuditPage;
