import { ArrowRight, Clapperboard, LayoutTemplate, Radar } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoopDiagram from "@/components/LoopDiagram";
import CustomerQuoteCarousel from "@/components/CustomerQuoteCarousel";
import { CUSTOMER_QUOTES } from "@/components/CustomerTestimonialSection";
import HeroMasterBrand from "@/components/home/HeroMasterBrand";
import ProductsSection from "@/components/home/ProductsSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import HomeClosingCTA from "@/components/home/HomeClosingCTA";
import { useHashScroll } from "@/hooks/useHashScroll";
import { APP_PRICING_URL } from "@/lib/pricing-url";
import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";
import RotatingWord from "@/preview/RotatingWord";
import {
  CLOSING, HERO, LOGO_ORDER, METHOD, ONE_LINER, OVERVIEW, QUOTES, USE_CASES,
} from "@/preview/homeV2Content";

/**
 * PREVIEW A2 — the minimal master-brand homepage (2026-09-28 review):
 *   promise (Hero) → what we make (Overview) → how we prove it (Method) →
 *   real work (Use cases) → voices (Customers) → objections (FAQ) → act.
 * Seven sections, two actions (Start a project first, Start Free second),
 * every section built from an existing component. Copy lives in
 * src/preview/homeV2Content.ts. The live homepage is unchanged.
 */

const ICONS = { aeo: Radar, sites: LayoutTemplate, motion: Clapperboard } as const;

const link = "underline underline-offset-2 hover:text-foreground";

const FAQS = [
  {
    question: "What does SolCrys do?",
    answer: (
      <>
        {ONE_LINER} SolCrys AEO shows how AI engines describe your brand, and SolCrys Sites and SolCrys Motion
        build the webpages and demos that tell the story right. Everything starts from one Corporate Context,
        and we measure what changed.
      </>
    ),
  },
  {
    question: "Do you build websites and animations?",
    answer:
      "Yes. SolCrys Sites builds homepages, category pages and product pages that AI can quote and buyers can trust. SolCrys Motion builds booth animation and interactive demos that explain your most technical ideas. Both work from the same Corporate Context as your AEO work.",
  },
  {
    question: "How is it priced?",
    answer: (
      <>
        SolCrys AEO is a monthly subscription with a free tier.{" "}
        <a href={APP_PRICING_URL} className={link}>See AEO plans and pricing</a>. Sites and Motion are scoped and
        quoted per project: start a project, or email support@solcrys.com.
      </>
    ),
  },
  {
    question: "How do you measure results?",
    answer:
      "Before we ship, we run the questions your buyers ask AI and record a baseline. After launch, the same prompts rerun across the same engines, so you can see the change in mentions, citations and share of voice.",
  },
  {
    question: "What is AEO, and how is it different from SEO?",
    answer: (
      <>
        Answer Engine Optimization makes a brand's facts, proof and pages easy for AI systems to retrieve, cite
        and summarize. SEO targets the results page; AEO targets the answer itself.{" "}
        <a href="/aeo-vs-seo/" className={link}>Read the full comparison of AEO and SEO</a>.
      </>
    ),
  },
  {
    question: "How do you keep what you make accurate?",
    answer:
      "Everything SolCrys makes draws on your Corporate Context, and nothing ships without your team's approval. SolCrys AEO also flags AI answers that describe your brand inaccurately so you can correct them.",
  },
];

const quotes = QUOTES.flatMap(({ name, company, quote }) => {
  const base = CUSTOMER_QUOTES.find((q) => q.name === name && q.company === company);
  return base ? [{ ...base, quote }] : [];
});

const PreviewHomeV2 = () => {
  useHashScroll();
  usePreviewPage("Homepage v2");
  return (
    <div className="min-h-screen bg-background">
      <PreviewRibbon />
      <Navbar variant="preview" />

      <HeroMasterBrand
        eyebrow={null}
        titleLead={HERO.titleLead}
        titleHighlight={HERO.titleHighlight}
        titleTail=""
        sub={
          <>
            {HERO.rotatingPrefix} <RotatingWord words={HERO.rotatingWords} />
          </>
        }
        primary="project"
        logoOrder={LOGO_ORDER}
      />

      <ProductsSection
        heading={OVERVIEW.heading}
        intro={OVERVIEW.intro}
        products={OVERVIEW.products.map((p) => ({ ...p, Icon: ICONS[p.key] }))}
        foundation={OVERVIEW.foundation}
      />

      <section id="method" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="max-w-[62ch]">
            <h2 className="font-display mb-4 text-3xl font-bold tracking-tight [text-wrap:balance] md:text-4xl">
              {METHOD.heading}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground md:text-lg">{METHOD.intro}</p>
          </div>
          <LoopDiagram steps={METHOD.steps} centerLines={METHOD.centerLines} footnote={null} />
          <a
            href={METHOD.proof.href}
            className="mt-10 flex flex-col gap-2 rounded-xl border border-border/30 bg-card/40 p-5 transition-colors hover:border-border/60 md:flex-row md:items-center md:gap-4"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--brand-accent-ink))]">
              {METHOD.proof.kicker}
            </span>
            <span className="text-sm leading-relaxed text-foreground md:text-base">{METHOD.proof.text}</span>
            <span className="inline-flex items-center gap-1 whitespace-nowrap text-sm font-medium text-[hsl(var(--brand-accent-ink))] md:ml-auto">
              {METHOD.proof.linkLabel} <ArrowRight className="h-4 w-4" />
            </span>
          </a>
        </div>
      </section>

      <SelectedWorkSection heading={USE_CASES.heading} intro={null} items={USE_CASES.items} />

      <section id="customers" className="relative scroll-mt-24 py-20 md:py-24 section-fade">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Customers</p>
              <h2 className="font-display text-3xl font-bold tracking-tight md:text-4xl">In their words.</h2>
            </div>
            <a
              href="/customers/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline"
            >
              Read customer stories <ArrowRight className="h-4 w-4" />
            </a>
          </div>
          <CustomerQuoteCarousel quotes={quotes} intervalMs={8000} minHeight="260px" />
        </div>
      </section>

      <HomeFaqSection heading="FAQs" items={FAQS} />

      <HomeClosingCTA eyebrow={null} title={CLOSING.title} body={CLOSING.body} primary="project" />

      <Footer variant="preview" />
    </div>
  );
};

export default PreviewHomeV2;
