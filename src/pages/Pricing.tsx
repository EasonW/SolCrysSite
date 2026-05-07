import { Fragment, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import TrialSignupDialog from "@/components/TrialSignupDialog";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import {
  trackEvent,
  type PricingAudience,
  type PricingPlanKey,
} from "@/lib/analytics";
import pricingContent from "@/content/pricing.json";

type Billing = "monthly" | "annual";

interface Tier {
  key: string;
  name: string;
  tagline: string;
  monthly: number;
  annualMonthly: number;
  recommended?: boolean;
  ctaPrimary: string;
  ctaSecondary?: string | null;
  features: string[];
}

interface AudienceBlock {
  key: PricingAudience;
  label: string;
  description: string;
  tiers: Tier[];
}

const audiences = pricingContent.audiences as AudienceBlock[];

const buildPlanKey = (audience: PricingAudience, tierKey: string): PricingPlanKey =>
  `${audience}_${tierKey}` as PricingPlanKey;

const formatPrice = (n: number) => `$${n.toLocaleString("en-US")}`;

const Pricing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialAudience: PricingAudience =
    searchParams.get("for") === "agencies" ? "agency" : "brand";
  const [audience, setAudience] = useState<PricingAudience>(initialAudience);
  const [billing, setBilling] = useState<Billing>("annual");
  const [stickyVisible, setStickyVisible] = useState(false);

  useEffect(() => {
    trackEvent("pricing_view", { initial_audience: initialAudience });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Mobile sticky CTA: show after user scrolls past the tier cards,
  // hide once the bottom CTA strip is in view (avoid double-CTA noise).
  useEffect(() => {
    const tiersEl = document.getElementById("pricing-tiers");
    const ctaStripEl = document.getElementById("pricing-cta-strip");
    if (!tiersEl || !ctaStripEl) return;
    let pastTiers = false;
    let inCtaStrip = false;
    const update = () => setStickyVisible(pastTiers && !inCtaStrip);
    const tiersObs = new IntersectionObserver(([entry]) => {
      pastTiers = !entry.isIntersecting && entry.boundingClientRect.top < 0;
      update();
    });
    const ctaObs = new IntersectionObserver(([entry]) => {
      inCtaStrip = entry.isIntersecting;
      update();
    });
    tiersObs.observe(tiersEl);
    ctaObs.observe(ctaStripEl);
    return () => {
      tiersObs.disconnect();
      ctaObs.disconnect();
    };
  }, []);

  const activeBlock = useMemo(
    () => audiences.find((a) => a.key === audience) ?? audiences[0],
    [audience]
  );

  const recommendedTier = useMemo(
    () => activeBlock.tiers.find((t) => t.recommended) ?? activeBlock.tiers[0],
    [activeBlock]
  );

  const handleAudienceChange = (next: PricingAudience) => {
    setAudience(next);
    if (next === "agency") {
      setSearchParams({ for: "agencies" }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
    trackEvent("pricing_audience_toggle", { audience: next });
  };

  const handleBillingChange = (next: Billing) => {
    setBilling(next);
    trackEvent("pricing_billing_toggle", { billing: next });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-20 md:pt-24 overflow-x-hidden">
        {/* Hero */}
        <section className="relative py-12 md:py-20">
          <div className="container mx-auto px-6 max-w-5xl text-center">
            <p className="text-sm font-medium text-[hsl(270_60%_60%)] tracking-wider uppercase mb-3">
              {pricingContent.hero.eyebrow}
            </p>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-5">
              {pricingContent.hero.title}
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {pricingContent.hero.subtitle}
            </p>
          </div>
        </section>

        {/* Audience tabs + billing toggle */}
        <section className="relative">
          <div className="container mx-auto px-6 max-w-5xl">
            <div className="flex flex-col items-center gap-6 mb-10">
              {/* Audience tabs */}
              <div
                role="tablist"
                aria-label="Pricing audience"
                className="inline-flex rounded-full border border-border/40 bg-card/40 p-1 backdrop-blur-sm"
              >
                {audiences.map((a) => {
                  const active = a.key === audience;
                  return (
                    <button
                      key={a.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => handleAudienceChange(a.key)}
                      className={
                        "px-5 md:px-7 py-2.5 rounded-full text-sm font-medium transition-colors " +
                        (active
                          ? "bg-primary text-primary-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground")
                      }
                    >
                      {a.label}
                    </button>
                  );
                })}
              </div>

              {/* Billing toggle */}
              <div className="flex items-center gap-3">
                <div className="inline-flex rounded-full border border-border/40 bg-card/40 p-1 backdrop-blur-sm">
                  <button
                    type="button"
                    onClick={() => handleBillingChange("monthly")}
                    className={
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
                      (billing === "monthly"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground")
                    }
                    aria-pressed={billing === "monthly"}
                  >
                    Monthly
                  </button>
                  <button
                    type="button"
                    onClick={() => handleBillingChange("annual")}
                    className={
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors " +
                      (billing === "annual"
                        ? "bg-foreground text-background"
                        : "text-muted-foreground hover:text-foreground")
                    }
                    aria-pressed={billing === "annual"}
                  >
                    Annual
                  </button>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-500 px-2.5 py-1 text-xs font-semibold">
                  <Sparkles className="h-3 w-3" /> {pricingContent.annualDiscount.label}
                </span>
              </div>

              <p className="text-sm text-muted-foreground text-center max-w-xl">
                {activeBlock.description}
              </p>
            </div>

            {/* Tier cards */}
            <div id="pricing-tiers" className="grid gap-6 md:grid-cols-3 mb-12">
              {activeBlock.tiers.map((tier) => {
                const price = billing === "annual" ? tier.annualMonthly : tier.monthly;
                const planKey = buildPlanKey(audience, tier.key);
                return (
                  <article
                    key={tier.key}
                    className={
                      "relative rounded-2xl border bg-card/40 backdrop-blur-sm p-7 flex flex-col " +
                      (tier.recommended
                        ? "order-first md:order-none border-primary/60 shadow-[0_0_0_1px_hsl(var(--primary)/0.4),0_24px_60px_-20px_hsl(var(--primary)/0.4)] md:scale-[1.02]"
                        : "border-border/40")
                    }
                  >
                    {tier.recommended ? (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1 text-xs font-semibold tracking-wide shadow">
                        Recommended
                      </span>
                    ) : null}

                    <header className="mb-5">
                      <h3 className="font-display text-xl font-semibold mb-1">{tier.name}</h3>
                      <p className="text-sm text-muted-foreground min-h-[2.75rem]">
                        {tier.tagline}
                      </p>
                    </header>

                    <div className="mb-5">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold tracking-tight">
                          {formatPrice(price)}
                        </span>
                        <span className="text-sm text-muted-foreground">/ mo</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {billing === "annual"
                          ? `Billed annually (${formatPrice(price * 12)}/yr)`
                          : "Billed monthly"}
                      </p>
                    </div>

                    <ul className="space-y-2.5 mb-6 flex-1">
                      {tier.features.map((feat) => (
                        <li key={feat} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 mt-0.5 shrink-0 text-primary" />
                          <span className="text-foreground/90">{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="flex flex-col gap-2">
                      <TrialSignupDialog
                        surface="pricing_card"
                        planKey={planKey}
                        planLabel={tier.name}
                        audience={audience}
                      >
                        <Button
                          variant={tier.recommended ? "hero" : "hero-outline"}
                          className="w-full"
                        >
                          {tier.ctaPrimary}
                        </Button>
                      </TrialSignupDialog>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Always included strip */}
        <section className="relative py-10 md:py-14 border-y border-border/30 bg-card/20">
          <div className="container mx-auto px-6 max-w-5xl">
            <p className="text-xs uppercase tracking-wider text-muted-foreground text-center mb-4">
              Included on every plan
            </p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
              {pricingContent.alwaysIncluded.map((item) => (
                <li
                  key={item}
                  className="inline-flex items-center gap-1.5 text-foreground/85"
                >
                  <Check className="h-4 w-4 text-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Comparison matrix */}
        <section className="relative py-16 md:py-24">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-3">
                Compare plans in detail
              </h2>
              <p className="text-muted-foreground">
                Showing {activeBlock.label}. Switch the audience above to compare the other track.
              </p>
            </div>

            {/* Mobile: per-tier accordion (recommended tier expanded by default) */}
            <div className="md:hidden space-y-3">
              {activeBlock.tiers.map((tier, idx) => {
                const offset = audience === "brand" ? 0 : 3;
                const price = billing === "annual" ? tier.annualMonthly : tier.monthly;
                return (
                  <details
                    key={tier.key}
                    open={tier.recommended}
                    className={
                      "group rounded-xl border bg-card/40 backdrop-blur-sm overflow-hidden " +
                      (tier.recommended ? "border-primary/60" : "border-border/40")
                    }
                  >
                    <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-display text-base font-semibold">{tier.name}</h3>
                          {tier.recommended ? (
                            <span className="inline-flex items-center rounded-full bg-primary/15 text-primary px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                              Recommended
                            </span>
                          ) : null}
                        </div>
                        <p className="text-sm text-muted-foreground mt-0.5">
                          {formatPrice(price)} / mo
                        </p>
                      </div>
                      <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-180 shrink-0" />
                    </summary>
                    <div className="px-4 pb-4 space-y-4 border-t border-border/30 pt-4">
                      {pricingContent.comparisonGroups.map((group) => (
                        <div key={group.groupLabel}>
                          <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
                            {group.groupLabel}
                          </p>
                          <ul className="space-y-1.5">
                            {group.rows.map((row) => (
                              <li
                                key={row.label}
                                className="flex justify-between gap-3 text-sm"
                              >
                                <span className="text-muted-foreground">{row.label}</span>
                                <span className="text-foreground/90 text-right font-medium">
                                  {row.values[idx + offset]}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </details>
                );
              })}
            </div>

            {/* Desktop: full comparison table */}
            <div className="hidden md:block overflow-x-auto rounded-xl border border-border/40">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/40 bg-card/40">
                    <th className="text-left font-medium text-muted-foreground p-4 w-1/3">
                      Feature
                    </th>
                    {activeBlock.tiers.map((tier) => (
                      <th key={tier.key} className="text-left font-semibold p-4">
                        {tier.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pricingContent.comparisonGroups.map((group) => {
                    const offset = audience === "brand" ? 0 : 3;
                    return (
                      <Fragment key={group.groupLabel}>
                        <tr className="bg-card/20 border-b border-border/30">
                          <td
                            colSpan={activeBlock.tiers.length + 1}
                            className="px-4 py-2 text-xs uppercase tracking-wider text-muted-foreground font-medium"
                          >
                            {group.groupLabel}
                          </td>
                        </tr>
                        {group.rows.map((row) => (
                          <tr
                            key={`${group.groupLabel}-${row.label}`}
                            className="border-b border-border/20 last:border-0"
                          >
                            <td className="p-4 text-muted-foreground">{row.label}</td>
                            {[0, 1, 2].map((i) => (
                              <td key={i} className="p-4 text-foreground/90">
                                {row.values[i + offset]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Enterprise band */}
        <section className="relative py-16 md:py-20 border-y border-border/30 bg-card/20">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <p className="text-xs uppercase tracking-wider text-[hsl(270_60%_60%)] font-semibold mb-3">
              {pricingContent.enterprise.label}
            </p>
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              {pricingContent.enterprise.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-7">
              {pricingContent.enterprise.description}
            </p>
            <EarlyAccessDialog surface="pricing_enterprise" mode="founder">
              <Button variant="hero" size="lg">
                {pricingContent.enterprise.ctaLabel}
              </Button>
            </EarlyAccessDialog>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative py-20 md:py-28">
          <div className="container mx-auto px-6 max-w-4xl">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-[hsl(270_60%_60%)] tracking-wider uppercase mb-3">
                Pricing FAQ
              </p>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
                Answers before you ask.
              </h2>
            </div>
            <div className="grid gap-4">
              {pricingContent.faqs.map((item) => (
                <article
                  key={item.question}
                  className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6"
                >
                  <h3 className="font-display text-lg font-semibold mb-3">
                    {item.question}
                  </h3>
                  <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA strip */}
        <section
          id="pricing-cta-strip"
          className="relative py-20 md:py-24 border-t border-border/30"
        >
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
              {pricingContent.ctaStrip.title}
            </h2>
            <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto mb-7 leading-relaxed">
              {pricingContent.ctaStrip.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <EarlyAccessDialog surface="pricing_cta_strip" mode="founder">
                <Button variant="hero" size="lg">
                  {pricingContent.ctaStrip.ctaLabel}
                </Button>
              </EarlyAccessDialog>
              <EarlyAccessDialog surface="pricing_cta_strip" mode="audit">
                <Button variant="hero-outline" size="lg">
                  Get a free audit first
                </Button>
              </EarlyAccessDialog>
            </div>
          </div>
        </section>
      </main>

      {/* Mobile-only sticky CTA — appears after user scrolls past tier cards */}
      <div
        aria-hidden={!stickyVisible}
        className={
          "fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-xl border-t border-border/40 shadow-[0_-8px_24px_-12px_rgba(0,0,0,0.4)] transition-transform duration-200 " +
          (stickyVisible ? "translate-y-0" : "translate-y-full")
        }
      >
        <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Recommended · {audience === "agency" ? "Agency" : "Brand"}
            </p>
            <p className="text-sm font-semibold truncate">
              {recommendedTier.name} ·{" "}
              {formatPrice(billing === "annual" ? recommendedTier.annualMonthly : recommendedTier.monthly)}/mo
            </p>
          </div>
          <TrialSignupDialog
            surface="pricing_sticky_mobile"
            planKey={buildPlanKey(audience, recommendedTier.key)}
            planLabel={recommendedTier.name}
            audience={audience}
          >
            <Button variant="hero" size="sm" className="shrink-0">
              Get on the trial list
            </Button>
          </TrialSignupDialog>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
