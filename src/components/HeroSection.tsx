import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnnouncementBanner from "./AnnouncementBanner";
import { FEATURED_LOGOS } from "./customerLogos";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import homeContent from "@/content/homeContent.json";

/**
 * Homepage hero — leads with SolCrys's #1 messaging pillar (the thesis:
 * "Turn AI answer gaps into governed marketing execution") and points at
 * the Loop. The free ChatGPT visibility tracker is NOT the headline; it
 * lives in its own section ([[FreeTrackerSection]]) right below the Loop so
 * the free tool doesn't override the brand pillars.
 */
const HeroSection = () => {
  const heroTitleHighlight = "governed marketing execution.";
  const heroTitleLead = homeContent.home.title
    .replace(heroTitleHighlight, "")
    .trim();

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-16">
      {/* Aurora Borealis Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[hsl(var(--brand-accent)/0.2)] via-[hsl(var(--brand-accent)/0.1)] to-transparent blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[hsl(var(--brand-accent)/0.1)] via-[hsl(var(--brand-accent)/0.06)] to-transparent blur-[100px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto w-full max-w-5xl min-w-0 px-4 text-center sm:px-6">
        {/* Announcement */}
        <div className="mx-auto mb-6 w-full max-w-[min(100%,48rem)] opacity-0 animate-fade-up sm:mb-7">
          <AnnouncementBanner />
        </div>

        {/* Category eyebrow — tells cold traffic what SolCrys *is* (a product
            category) before the thesis headline states what it *does*. Mirrors
            the prerendered `seo-kicker` so the SPA and crawler HTML stay aligned. */}
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-accent))] opacity-0 animate-fade-up-delay-1">
          {homeContent.home.eyebrow}
        </p>

        {/* Headline — the thesis (SolCrys's core positioning pillar). */}
        <h1 className="mx-auto mb-6 max-w-[18rem] text-[clamp(2.05rem,8.8vw,3rem)] font-bold leading-[1.08] tracking-tight opacity-0 animate-fade-up-delay-1 sm:max-w-3xl sm:text-5xl md:max-w-5xl md:text-6xl lg:text-7xl">
          {heroTitleLead} <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">{heroTitleHighlight}</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-8 max-w-[19rem] text-base leading-relaxed text-muted-foreground opacity-0 animate-fade-up-delay-2 sm:max-w-2xl sm:text-lg md:text-xl">
          {homeContent.home.description}
        </p>

        {/* Primary CTAs — Get Started (free tier) + jump to the Loop. The
            free ChatGPT visibility tracker form lives in its own section
            below, so the brand thesis + Loop lead the page. */}
        <div className="flex w-full flex-col items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3 sm:flex-row">
          <Button asChild variant="hero" size="lg" className="h-auto w-full max-w-[17.5rem] justify-center px-6 py-5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-6 sm:text-base">
            <a href={AUDIT_URL} onClick={() => trackAuditClick("hero")}>
              Start Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <Button asChild variant="hero-outline" size="lg" className="h-auto w-full max-w-[17.5rem] justify-center px-6 py-5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-6 sm:text-base">
            <a href="#loop">See the Loop</a>
          </Button>
        </div>

        {/* Trust Bar — a calm STATIC strip of the most recognizable customers.
            Motion is deliberately kept out of the hero message zone so the
            scrolling logo wall doesn't compete with the headline/CTA for
            attention; the full set scrolls lower down ([[LogoMarquee]] in the
            Customer Stories section). Logo list lives in [[customerLogos]]. */}
        <div className="mt-10 border-t border-white/5 pt-6 sm:mt-12 sm:pt-7">
          <p className="text-[11px] text-muted-foreground/70 mb-4 uppercase tracking-widest font-medium">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 md:gap-x-10 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {FEATURED_LOGOS.map((logo) =>
              logo.image ? (
                <img
                  key={logo.label}
                  src={logo.image}
                  alt={logo.label}
                  className={`${logo.className ?? "h-5 md:h-6"} w-auto`}
                  loading="lazy"
                />
              ) : (
                <span
                  key={logo.label}
                  className="font-heading text-lg md:text-xl font-semibold tracking-tight"
                  style={{ color: logo.color }}
                >
                  {logo.label}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
