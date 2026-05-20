import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import TrialSignupDialog from "@/components/TrialSignupDialog";
import { Button } from "@/components/ui/button";
import { Check, Layers3, Sparkles } from "lucide-react";
import { trackEvent, type PricingPlanKey } from "@/lib/analytics";
import pricingContent from "@/content/pricing.json";

type AudienceKey = "brand" | "agency";

interface Tier {
  key: string;
  name: string;
  tagline: string;
  bestFit: string;
  monthly: number;
  recommended?: boolean;
  ctaPrimary: string;
  features: string[];
}

interface AudienceBlock {
  key: AudienceKey;
  label: string;
  description: string;
  tiers: Tier[];
}

interface AddOn {
  label: string;
  description: string;
}

interface PricingContent {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  audiences: AudienceBlock[];
  alwaysIncluded: string[];
  addOns: AddOn[];
  enterprise: {
    label: string;
    title: string;
    description: string;
    ctaLabel: string;
  };
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  ctaStrip: {
    title: string;
    description: string;
    ctaLabel: string;
  };
}

const pricing = pricingContent as PricingContent;
const audiences = pricing.audiences;

const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

const buildPlanKey = (audience: AudienceKey, tierKey: string): PricingPlanKey => {
  if (audience === "brand") return `brand_${tierKey}` as PricingPlanKey;
  return tierKey === "agency_pro" ? "agency_pro" : "agency";
};

const Pricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAudience: AudienceKey =
    searchParams.get("for") === "agencies" ? "agency" : "brand";
  const [audience, setAudience] = useState<AudienceKey>(initialAudience);
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    trackEvent("pricing_view", { initial_audience: initialAudience });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const tiersEl = document.getElementById("pricing-tiers");
    const ctaStripEl = document.getElementById("pricing-cta-strip");
    if (!tiersEl || !ctaStripEl) return;

    let pastTiers = false;
    let inCtaStrip = false;
    const update = () => setStickyVisible(pastTiers && !inCtaStrip);

    const tiersObserver = new IntersectionObserver(([entry]) => {
      pastTiers = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const ctaObserver = new IntersectionObserver(([entry]) => {
      inCtaStrip = entry.isIntersecting;
      update();
    });

    tiersObserver.observe(tiersEl);
    ctaObserver.observe(ctaStripEl);

    return () => {
      tiersObserver.disconnect();
      ctaObserver.disconnect();
    };
  }, []);

  const activeBlock = useMemo(
    () => audiences.find((a) => a.key === audience) ?? audiences[0],
    [audience]
  );

  const recommendedTier = useMemo(
    () => activeBlock.tiers.find((tier) => tier.recommended) ?? activeBlock.tiers[0],
    [activeBlock]
  );

  const handleAudienceChange = (next: AudienceKey) => {
    setAudience(next);
    setSearchParams(next === "agency" ? { for: "agencies" } : {}, { replace: true });
    trackEvent("pricing_audience_toggle", { audience: next });
  };

  const tierGridClass =
    activeBlock.tiers.length === 2
      ? "mx-auto grid max-w-4xl gap-6 md:grid-cols-2"
      : "grid gap-6 md:grid-cols-3";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="overflow-x-hidden pt-20 md:pt-24">
        <section className="relative py-12 md:py-20">
          <div className="container mx-auto max-w-5xl px-6 text-center">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(195_90%_55%)]">
              {pricing.hero.eyebrow}
            </p>
            <h1 className="font-display text-3xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {pricing.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {pricing.hero.subtitle}
            </p>
          </div>
        </section>

        <section className="relative">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-10 flex flex-col items-center gap-5">
              <div
                role="tablist"
                aria-label="Pricing audience"
                className="inline-flex rounded-full border border-border/40 bg-card/40 p-1 backdrop-blur-sm"
              >
                {audiences.map((item) => {
                  const active = item.key === audience;
                  return (
                    <button
                      key={item.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleAudienceChange(item.key)}
                      className={
                        "rounded-full px-5 py-2.5 text-sm font-medium transition-colors md:px-7 " +
                        (active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground")
                      }
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              <p className="max-w-xl text-center text-sm leading-relaxed text-muted-foreground">
                {activeBlock.description}
              </p>
            </div>

            <div id="pricing-tiers" className={`${tierGridClass} mb-12`}>
              {activeBlock.tiers.map((tier) => {
                const planKey = buildPlanKey(audience, tier.key);

                return (
                <article
                  key={tier.key}
                  className={
                    "relative flex h-full flex-col rounded-2xl border bg-card/45 p-7 backdrop-blur-sm " +
                    (tier.recommended
                      ? "order-first border-[hsl(195_90%_55%/0.7)] shadow-[0_0_0_1px_hsl(195_90%_55%/0.25),0_24px_60px_-24px_hsl(195_90%_55%/0.65)] md:order-none md:scale-[1.02]"
                      : "border-border/40")
                  }
                >
                  {tier.recommended ? (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground shadow">
                      Recommended
                    </span>
                  ) : null}

                  <header className="mb-6">
                    <h2 className="font-display text-2xl font-semibold">{tier.name}</h2>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-muted-foreground">
                      {tier.bestFit}
                    </p>
                  </header>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-5xl font-semibold tracking-tight">
                        {formatPrice(tier.monthly)}
                      </span>
                      <span className="text-sm text-muted-foreground">/ mo</span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Monthly plan. No seat meter.
                    </p>
                  </div>

                  <ul className="mb-7 flex-1 space-y-3">
                    {tier.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[hsl(195_90%_55%)]" />
                        <span className="text-foreground/90">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <TrialSignupDialog
                    surface="pricing_card"
                    planKey={planKey}
                    planLabel={tier.name}
                    audience={audience}
                  >
                    <Button
                      variant={tier.recommended ? "hero" : "hero-outline"}
                      className="w-full"
                      onClick={() =>
                        trackEvent("pricing_plan_cta_click", {
                          audience,
                          plan: tier.key,
                          price: tier.monthly,
                        })
                      }
                    >
                      {tier.ctaPrimary}
                    </Button>
                  </TrialSignupDialog>
                </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="relative border-y border-border/30 bg-card/20 py-10 md:py-14">
          <div className="container mx-auto max-w-5xl px-6">
            <p className="mb-4 text-center text-xs uppercase tracking-wider text-muted-foreground">
              Included on every plan
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {pricing.alwaysIncluded.map((item) => (
                <li key={item} className="inline-flex items-center gap-1.5 text-foreground/85">
                  <Check className="h-4 w-4 text-[hsl(195_90%_55%)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="relative border-y border-border/30 bg-card/20 py-16 md:py-20">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <p className="text-sm font-medium uppercase tracking-wider text-[hsl(195_90%_55%)]">
                  Add-ons
                </p>
                <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight md:text-4xl">
                  Keep premium and custom coverage separate.
                </h2>
                <p className="mt-4 leading-relaxed text-muted-foreground">
                  Public plans cover the engines that matter most for default market discovery.
                  Premium engines and enterprise controls stay modular so the core plans remain
                  simple.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {pricing.addOns.map((item, index) => (
                  <article key={item.label} className="rounded-xl border border-border/30 bg-background/70 p-6">
                    {index === 0 ? (
                      <Sparkles className="h-5 w-5 text-[hsl(40_85%_55%)]" />
                    ) : (
                      <Layers3 className="h-5 w-5 text-[hsl(195_90%_55%)]" />
                    )}
                    <h3 className="mt-4 font-display text-xl font-semibold">{item.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="relative py-20 md:py-28">
          <div className="container mx-auto max-w-4xl px-6">
            <div className="mb-12 text-center">
              <p className="mb-3 text-sm font-medium uppercase tracking-wider text-[hsl(195_90%_55%)]">
                Pricing FAQ
              </p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
                Answers before you ask.
              </h2>
            </div>
            <div className="grid gap-4">
              {pricing.faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-xl border border-border/30 bg-card/40 p-6 backdrop-blur-sm"
                >
                  <h3 className="font-display text-lg font-semibold">{item.question}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="pricing-cta-strip"
          className="relative border-t border-border/30 py-20 md:py-24"
        >
          <div className="container mx-auto max-w-3xl px-6 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-[hsl(195_90%_55%)]">
              {pricing.enterprise.label}
            </p>
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-4xl">
              {pricing.ctaStrip.title}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {pricing.ctaStrip.description}
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
              <EarlyAccessDialog surface="pricing_cta_strip" mode="founder">
                <Button variant="hero" size="lg">
                  {pricing.ctaStrip.ctaLabel}
                </Button>
              </EarlyAccessDialog>
              <Button asChild variant="hero-outline" size="lg">
                <a
                  href={AUDIT_URL}
                  onClick={() => trackAuditClick("pricing_cta_strip")}
                >
                  Start a free audit first
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <div
        aria-hidden={!stickyVisible}
        className={
          "fixed bottom-0 left-0 right-0 z-40 border-t border-border/40 bg-background/95 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.4)] backdrop-blur-xl transition-transform duration-200 md:hidden " +
          (stickyVisible ? "translate-y-0" : "translate-y-full")
        }
      >
        <div className="container mx-auto flex items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Recommended · {audience === "agency" ? "Agency" : "Brand"}
            </p>
            <p className="truncate text-sm font-semibold">
              {recommendedTier.name} · {formatPrice(recommendedTier.monthly)}/mo
            </p>
          </div>
          <TrialSignupDialog
            surface="pricing_sticky_mobile"
            planKey={buildPlanKey(audience, recommendedTier.key)}
            planLabel={recommendedTier.name}
            audience={audience}
          >
            <Button variant="hero" size="sm" className="shrink-0">
              {recommendedTier.ctaPrimary}
            </Button>
          </TrialSignupDialog>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
