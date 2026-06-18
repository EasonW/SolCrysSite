import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import AnnouncementBanner from "./AnnouncementBanner";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import siteContent from "@/content/siteContent.json";

/**
 * Homepage hero — leads with SolCrys's #1 messaging pillar (the thesis:
 * "Turn AI answer gaps into governed marketing execution") and points at
 * the Loop. The free ChatGPT visibility tracker is NOT the headline; it
 * lives in its own section ([[FreeTrackerSection]]) right below the Loop so
 * the free tool doesn't override the brand pillars.
 */
const HeroSection = () => {
  const heroTitleHighlight = "governed marketing execution.";
  const heroTitleLead = siteContent.home.title
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
        <div className="mx-auto mb-7 w-full max-w-[min(100%,48rem)] opacity-0 animate-fade-up sm:mb-8">
          <AnnouncementBanner />
        </div>

        {/* Headline — the thesis (SolCrys's core positioning pillar). */}
        <h1 className="mx-auto mb-6 max-w-[18rem] text-[clamp(2.05rem,8.8vw,3rem)] font-bold leading-[1.08] tracking-tight opacity-0 animate-fade-up-delay-1 sm:max-w-3xl sm:text-5xl md:max-w-5xl md:text-6xl lg:text-7xl">
          {heroTitleLead} <br className="hidden md:block" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">{heroTitleHighlight}</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-[19rem] text-base leading-relaxed text-muted-foreground opacity-0 animate-fade-up-delay-2 sm:max-w-3xl sm:text-lg md:text-xl">
          {siteContent.home.description}
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

        {/* Trust Bar — customer logos. Engine names already appear in the
            subhead; the logos give buyers a faster credibility signal. */}
        <div className="mt-12 border-t border-white/5 pt-7 sm:mt-16 sm:pt-8">
          <p className="text-sm text-muted-foreground mb-6 uppercase tracking-widest font-medium">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-4 md:gap-x-12 opacity-70 hover:opacity-100 transition-opacity duration-500">
            <img src="/customers/uipath-logo.svg" alt="UiPath" className="h-7 w-auto" loading="lazy" />
            <img src="/customers/nextsilicon-logo.svg" alt="NextSilicon" className="h-4 md:h-5 w-auto invert dark:invert-0" loading="lazy" />
            <img src="/customers/wyze-logo.png" alt="Wyze" className="h-5 md:h-6 w-auto" loading="lazy" />
            <img src="/customers/clearlykept-logo.png" alt="ClearlyKept" className="h-5 md:h-6 w-auto dark:brightness-0 dark:invert" loading="lazy" />
            <span className="font-heading text-lg md:text-xl font-semibold tracking-tight" style={{ color: "#FB923C" }}>BOBOYM</span>
          </div>
        </div>
      </div>
    </section>);

};

export default HeroSection;
