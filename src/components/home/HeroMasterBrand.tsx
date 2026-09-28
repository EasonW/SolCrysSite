import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { FEATURED_LOGOS, LOGO_MONO, LOGO_MONO_TEXT } from "@/components/customerLogos";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";

type HeroMasterBrandProps = {
  /** null hides the eyebrow. */
  eyebrow?: string | null;
  titleLead?: string;
  titleHighlight?: string;
  titleTail?: string;
  sub?: ReactNode;
  /** "project" makes Start a project the solid button and puts it first. */
  primary?: "free" | "project";
  /** Logo labels in display order; unlisted logos keep their place after. */
  logoOrder?: string[];
};

const ordered = <T extends { label: string }>(items: T[], order?: string[]) =>
  order
    ? [...items].sort((a, b) => {
        const ia = order.indexOf(a.label);
        const ib = order.indexOf(b.label);
        return (ia < 0 ? order.length : ia) - (ib < 0 ? order.length : ib);
      })
    : items;

/**
 * PREVIEW — master-brand hero. Headline comes from Gwen's year-one founder note
 * ("AI is now the first reader of your brand"). Start Free stays the primary
 * action; Start a project opens the project inquiry for Sites and Motion.
 * /preview/home-v2/ passes its own copy and makes the project inquiry primary.
 */
const HeroMasterBrand = ({
  eyebrow = "Your brand, AI ready",
  titleLead = "AI is now the",
  titleHighlight = "first reader",
  titleTail = "of your brand.",
  sub = "SolCrys makes sure AI gets your story right, then builds the web pages and booth demos that tell the same story, and measures what changed.",
  primary = "free",
  logoOrder,
}: HeroMasterBrandProps = {}) => {
  const buttonClass =
    "h-auto w-full max-w-[17.5rem] justify-center px-6 py-5 text-sm sm:w-auto sm:max-w-none sm:px-8 sm:py-6 sm:text-base";
  const freeButton = (
    <Button key="free" asChild variant={primary === "free" ? "hero" : "hero-outline"} size="lg" className={buttonClass}>
      <a href={AUDIT_URL} onClick={() => trackAuditClick("hero")}>
        Start Free
        {primary === "free" ? <ArrowRight className="ml-2 w-5 h-5" /> : null}
      </a>
    </Button>
  );
  const projectButton = (
    <EarlyAccessDialog key="project" mode="project" surface="hero">
      <Button variant={primary === "project" ? "hero" : "hero-outline"} size="lg" className={buttonClass}>
        Start a project
        {primary === "project" ? <ArrowRight className="ml-2 w-5 h-5" /> : null}
      </Button>
    </EarlyAccessDialog>
  );

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden pt-28 pb-20 sm:pt-32 sm:pb-16">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[hsl(var(--brand-accent)/0.2)] via-[hsl(var(--brand-accent)/0.1)] to-transparent blur-[120px] animate-pulse-glow" />
        <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[hsl(var(--brand-accent)/0.1)] via-[hsl(var(--brand-accent)/0.06)] to-transparent blur-[100px]" />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--foreground)/0.03)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--foreground)/0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative z-10 container mx-auto w-full max-w-5xl min-w-0 px-4 text-center sm:px-6">
        {eyebrow ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-[hsl(var(--brand-accent))] opacity-0 animate-fade-up-delay-1">
            {eyebrow}
          </p>
        ) : null}

        <h1 className="mx-auto mb-6 max-w-[18rem] text-[clamp(2.05rem,8.8vw,3rem)] font-bold leading-[1.08] tracking-tight opacity-0 animate-fade-up-delay-1 sm:max-w-3xl sm:text-5xl md:max-w-4xl md:text-6xl lg:text-7xl">
          {titleLead}{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[hsl(var(--brand-accent))] to-[hsl(var(--brand-accent-2))]">
            {titleHighlight}
          </span>
          {titleTail ? ` ${titleTail}` : null}
        </h1>

        <p className="mx-auto mb-8 max-w-[19rem] text-base leading-relaxed text-muted-foreground [text-wrap:balance] opacity-0 animate-fade-up-delay-2 sm:max-w-2xl sm:text-lg md:text-xl">
          {sub}
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-4 opacity-0 animate-fade-up-delay-3 sm:flex-row">
          {primary === "project" ? [projectButton, freeButton] : [freeButton, projectButton]}
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 sm:mt-12 sm:pt-7">
          <p className="text-[11px] text-muted-foreground/70 mb-4 uppercase tracking-widest font-medium">Trusted by</p>
          <div className="mx-auto grid max-w-2xl grid-cols-2 sm:grid-cols-3 justify-items-center lg:flex lg:max-w-none lg:flex-wrap justify-center items-center gap-x-6 gap-y-5 lg:gap-x-8 opacity-60 hover:opacity-100 transition-opacity duration-500">
            {ordered(FEATURED_LOGOS, logoOrder).map((logo) =>
              logo.image ? (
                <img
                  key={logo.label}
                  src={logo.image}
                  alt={logo.label}
                  className={`${logo.className ?? "h-5 md:h-6"} w-auto ${LOGO_MONO}`}
                  loading="lazy"
                />
              ) : (
                <span
                  key={logo.label}
                  className={`font-heading text-lg md:text-xl font-semibold tracking-tight ${LOGO_MONO_TEXT}`}
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
