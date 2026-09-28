/**
 * PREVIEW — copy for /preview/home-v2/, the minimal master-brand homepage.
 * One source for every word on the page so the sections stay consistent:
 *   - three product lines (AEO, Sites, Motion) on one Corporate Context;
 *   - the method maps onto them: See it (AEO) → Fix it (Sites, Motion) →
 *     Prove it (AEO);
 *   - two actions only: Start a project (primary) and Start Free.
 * Cornelis numbers match the published case study (/customers/cornelis/).
 * Customer quotes are the full live set from CustomerTestimonialSection.
 */
import type { LoopStep } from "@/components/LoopDiagram";

/** Every sentence that says what SolCrys is uses this wording. */
export const ONE_LINER =
  "SolCrys helps technology companies tell one accurate story in AI answers, on their website and at their booth.";

export const HERO = {
  titleLead: "Your brand,",
  titleHighlight: "AI ready.",
  rotatingPrefix: "One Corporate Context for",
  /** One word per product card, in the same order. */
  rotatingWords: ["AI answers.", "webpages.", "demos."],
};

/** Cornelis, NextSilicon and UiPath lead: the technology buyers this page is for. */
export const LOGO_ORDER = ["Cornelis", "NextSilicon", "UiPath", "Wyze", "TechArena", "ClearlyKept"];

export const OVERVIEW = {
  heading: "One story, told everywhere your buyers look.",
  intro:
    "Buyers ask ChatGPT, read your website and stop by your booth. Every SolCrys product works from the same Corporate Context, so every stop tells the same story.",
  products: [
    {
      key: "aeo",
      name: "SolCrys AEO",
      promise: "Know how AI reads you.",
      body: "See how ChatGPT, Gemini, Google AI Overviews, Perplexity and Claude describe and cite your brand, find the gaps against your approved facts and track every fix through to a remeasured result.",
      cta: "free",
    },
    {
      key: "sites",
      name: "SolCrys Sites",
      promise: "Build pages AI can quote and buyers can trust.",
      body: "Homepages, category pages and product pages with AI-ready copy and design, built from your approved facts.",
      cta: "project",
    },
    {
      key: "motion",
      name: "SolCrys Motion",
      promise: "Explain the hard part in two minutes.",
      body: "Booth animation and interactive demos that make deeply technical products clear, built on the same facts as your pages and AI answers.",
      cta: "project",
    },
  ] as const,
  foundation: {
    name: "Corporate Context Engine",
    promise: "Ground everything in what is true.",
    body: "A living record of your approved facts, claims and proof, kept current, so nothing SolCrys makes drifts from it.",
    href: "/corporate-context-ai-marketing/",
  },
};

export const METHOD = {
  heading: "See it. Fix it. Prove it.",
  intro: "The same method runs every project, from an AI answer to a booth demo.",
  /** `example` names the product that does the step. */
  steps: [
    {
      label: "Measure",
      description: "Run the questions your buyers ask AI and record how each engine describes you today.",
      example: "SolCrys AEO",
    },
    {
      label: "Diagnose",
      description:
        "Find out whether your brand is absent from those answers, missing the right citations, showing up inaccurately or losing to competitors.",
      example: "SolCrys AEO",
    },
    {
      label: "Execute",
      description: "Ship the fix, from content to webpages to booth motion, each mapped to a step in the buyer's journey.",
      example: "SolCrys Sites · SolCrys Motion",
    },
    {
      label: "Verify",
      description: "Rerun the same prompts against the baseline and feed what changed into the next round.",
      example: "SolCrys AEO",
    },
  ] satisfies LoopStep[],
  centerLines: ["same baseline,", "remeasured after launch"] as [string, string],
  proof: {
    kicker: "Cornelis Networks",
    text: "In four weeks, the mention rate on its new category prompt set rose 12×.",
    href: "/customers/cornelis/",
    linkLabel: "Read the case study",
  },
};

export const USE_CASES = {
  heading: "Popular use cases",
  /** Same order as the product cards. */
  items: [
    {
      id: "aeo-answer",
      line: "AEO",
      client: "Example workspace",
      title: "Getting the AI answer right",
      summary:
        "SolCrys AEO shows where AI engines skip your brand, cite someone else or describe you wrong, then tracks each fix until the answer changes. Shown here: the Visibility dashboard with example data.",
      image: "/work/aeo-visibility-example.jpg",
      href: "app",
    },
    {
      id: "cornelis-acf-category",
      line: "Sites",
      client: "Cornelis Networks",
      title: "Defining a new category",
      summary:
        "SolCrys makes a brand-new category answerable, with pages AI engines can read, extract and quote in your own words. Shown here: the Active Compute Fabric page for Cornelis.",
      image: "/customers/cornelis/shot-1.jpg",
      href: "https://www.cornelis.com/technology/active-compute-fabric",
    },
    {
      id: "cornelis-booth-interactive",
      line: "Motion",
      client: "Cornelis Networks",
      title: "Engaging customers at the booth",
      summary:
        "Cornelis's reference architecture, explained in two minutes on the show floor and still live after the event.",
      image: "/work/cornelis-demo.jpg",
      href: "https://cms.solcrys.com/cornelis/technology/active-compute-fabric/demo",
    },
  ],
};

export const CLOSING = {
  title: "Make your brand AI ready.",
  body: "Start free to see how AI describes you today, or tell us what you are launching next. We build the pages and demos from the same approved facts.",
};
