import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FEATURED_LOGOS } from "@/components/customerLogos";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";

/**
 * PREVIEW — master-brand hero. Headline comes from Gwen's year-one founder note
 * ("AI is now the first reader of your brand"). Start Free stays the primary
 * action; Start a project opens the project inquiry for Sites and Motion.
 */
const HeroMasterBrand = () => {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[hsl(var(--brand-accent)/0.2)] via-[hsl(var(--brand-accent)/0.1)] to-transparent blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[hsl(var(--brand-accent)/0.1)] via-[hsl(var(--brand-accent)/0.06)] to-transparent blur-[100px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto w-full max-w-5xl min-w-0 px-4 text-center sm:px-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-accent))] opacity-0 animate-fade-up-delay-1">
          Your brand, AI ready
        </p>

        <h1 className="mx-auto mb-6 max-w-[18rem] text-[clamp(2.05rem,8.8vw,3rem)] font-bold leading-[1.08] tracking-tight opacity-0 animate-fade-up-delay-1 sm:max-w-3xl sm:text-5xl md:max-w-4xl md:text-6xl lg:text-7xl">
          AI is now the{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">
            first reader
          </span>{" "}
          of your brand.
        </h1>

        <p className="mx-auto mb-8 max-w-[19rem] text-base leading-relaxed text-muted-foreground [text-wrap:balance] opacity-0 animate-fade-up-delay-2 sm:max-w-2xl sm:text-lg md:text-xl">
          SolCrys makes sure AI gets your story right, then builds the web pages
          and booth demos that tell the same story, and measures what changed.
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3 sm:flex-row">
          <Button asChild variant="hero" size="lg" className="h-auto w-full max-w-[17.5rem] justify-center px-6 py-5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-6 sm:text-base">
            <a href={AUDIT_URL} onClick={() => trackAuditClick("hero")}>
              Start Free
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </Button>
          <EarlyAccessDialog mode="project" surface="hero">
            <Button variant="hero-outline" size="lg" className="h-auto w-full max-w-[17.5rem] justify-center px-6 py-5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-6 sm:text-base">
              Start a project
            </Button>
          </EarlyAccessDialog>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 sm:mt-12 sm:pt-7">
          <p className="text-[11px] text-muted-foreground/70 mb-4 uppercase tracking-widest font-medium">Trusted by</p>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 md:gap-x-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
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
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroMasterBrand;
