import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import AnnouncementBanner from "./AnnouncementBanner";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import { trackEvent } from "@/lib/analytics";
import siteContent from "@/content/siteContent.json";

/**
 * Loose URL-shape check — accepts apex domains, subdomains, and paths
 * (`https://acme.com/products`). Same regex the /audit AuditFlow uses
 * on the dashboard side, kept duplicate so both sides reject typos
 * before the cross-domain redirect.
 */
function isValidUrlShape(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  const withoutProtocol = trimmed.replace(/^https?:\/\//i, "");
  const host = withoutProtocol.split(/[/?#]/)[0];
  return /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(host);
}

const HeroSection = () => {
  const heroTitleHighlight = "or your competitor?";
  const heroTitleLead = siteContent.home.title
    .replace(heroTitleHighlight, "")
    .trim();

  // Inline domain capture added 2026-05-25 — short-circuits the
  // homepage → click CTA → land on /audit → re-enter domain loop into
  // a single hero-form submit. Dashboard `/audit` reads `?domain=` on
  // mount and pre-fills the AuditFlow state (no auto-submit; user
  // retains a chance to edit on the audit page).
  const [domain, setDomain] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = domain.trim();
    if (!isValidUrlShape(trimmed)) {
      setError("Please enter a valid URL (e.g., acme.com).");
      return;
    }
    setError(null);
    // Fire BOTH events:
    //  - request_audit_open (existing) preserves the historical funnel
    //    dashboards that count this surface as a Free Audit click.
    //  - request_audit_open_with_domain (new) carries the pre-filled
    //    domain so we can measure form-conversion vs. button-conversion
    //    on the same hero, and downstream attribute domain-fill rate.
    trackAuditClick("hero");
    trackEvent("request_audit_open_with_domain", {
      surface: "hero",
      domain: trimmed,
    });
    window.location.href = `${AUDIT_URL}?domain=${encodeURIComponent(trimmed)}`;
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-32 pb-16">
      {/* Aurora Borealis Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-transparent blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-blue-500/10 via-cyan-500/10 to-transparent blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto px-6 text-center max-w-5xl">
        {/* Announcement */}
        <div className="mb-8 opacity-0 animate-fade-up">
          <AnnouncementBanner />
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6 opacity-0 animate-fade-up-delay-1">
          {heroTitleLead} <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(195_90%_55%)] to-[hsl(40_85%_55%)]">{heroTitleHighlight}</span>
        </h1>

        {/* Subheadline */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed opacity-0 animate-fade-up-delay-2">
          {siteContent.home.description}
        </p>

        {/* Primary CTA: inline domain form (replaces the previous
            standalone "Get a Free AI Visibility Audit" button). The
            input + submit pattern mirrors the well-tested Ahrefs/SEMrush
            hero pattern and short-circuits one cross-domain navigation
            step before /audit reads the domain. */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="max-w-2xl mx-auto opacity-0 animate-fade-up-delay-3 mb-4"
        >
          {/* No `shadow-lg` — this project's light-mode shadow tokens are
              brutalist hard-offset (`12px 12px 0px 0px #000`) which renders
              as a solid black box behind the form. The border + bg already
              give the input enough visual weight; dark-mode soft shadow
              wasn't worth the light-mode artifact. */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-0 rounded-xl border border-border bg-card/50 backdrop-blur-sm focus-within:border-[hsl(195_90%_55%/0.6)] focus-within:ring-4 focus-within:ring-[hsl(195_90%_55%/0.12)] transition-all">
            <label htmlFor="hero-domain" className="sr-only">
              Your website URL
            </label>
            <input
              id="hero-domain"
              name="domain"
              type="url"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                if (error) setError(null);
              }}
              placeholder="https://acme.com"
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
              Track ChatGPT Visibility, Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
          {error ? (
            <p
              role="alert"
              className="mt-2.5 text-sm text-[hsl(0_70%_65%)]"
            >
              {error}
            </p>
          ) : null}
        </form>

        {/* Tier-honesty subtitle — names "ChatGPT" specifically so the
            free scope is unambiguous against the hero's multi-engine
            value promise. Full engine-tier disclosure lives on /audit. */}
        <p className="text-sm text-muted-foreground/85 max-w-2xl mx-auto mb-10 opacity-0 animate-fade-up-delay-3">
          Free ChatGPT visibility tracker
          <span className="mx-2 text-muted-foreground/50">·</span>
          Daily multi-engine monitoring on paid plans
          <span className="mx-2 text-muted-foreground/50">·</span>
          No credit card
        </p>

        {/* The SolCrys Loop lives in its own section (LoopSection) right
            below the hero — it was pulled out of the hero so the pitch +
            form aren't competing with the 4-step diagram in one viewport.
            id="loop" now lives on that section. */}

        {/* Trust Bar — customer logos. Engine names already appear in
            the subhead; doubling them here was redundant scan-noise. The
            logos give buyers a faster credibility signal at first sight. */}
        <div className="mt-16 pt-8 border-t border-white/5">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
            <img src="/customers/uipath-logo.svg" alt="UiPath" className="h-7 w-auto" loading="lazy" />
            <img src="/customers/nextsilicon-logo.svg" alt="NextSilicon" className="h-4 md:h-5 w-auto" loading="lazy" />
            <img src="/customers/wyze-logo.png" alt="Wyze" className="h-5 md:h-6 w-auto" loading="lazy" />
            <img src="/customers/clearlykept-logo.png" alt="ClearlyKept" className="h-5 md:h-6 w-auto" loading="lazy" />
            <span className="font-heading text-lg md:text-xl font-semibold tracking-tight" style={{ color: "#FB923C" }}>BOBOYM</span>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
