/**
 * PREVIEW — shared copy for the style variants under /preview/*. Every variant
 * renders the same words so the comparison is about design only.
 * Cornelis numbers and quotes match the published case study.
 */
import { useEffect } from "react";
import work from "@/content/work.json";
import type { LoopStep } from "@/components/LoopDiagram";
import { AUDIT_URL } from "@/lib/audit-cta";

export const HERO = {
  eyebrow: "Your brand, AI ready",
  lead: "AI is now the",
  highlight: "first reader",
  tail: "of your brand.",
  sub: "SolCrys makes sure AI gets your story right, then builds the web pages and booth demos that tell the same story, and measures what changed.",
};

export const PRODUCTS = [
  {
    key: "aeo",
    name: "SolCrys AEO",
    promise: "Know how AI reads you.",
    body: "See how ChatGPT, Gemini, Google AI, Perplexity and Claude describe and cite your brand, find the gaps against your approved facts, and track every fix.",
    meta: "Monthly subscription · free to start",
    cta: "Start Free",
  },
  {
    key: "sites",
    name: "SolCrys Sites",
    promise: "Pages AI and buyers both read right.",
    body: "Homepages, category and product pages with AI-ready copy and design, built from your approved facts. Hosted on our subdomain or your own domain.",
    meta: "Per project · hosting optional",
    cta: "Request a quote",
  },
  {
    key: "motion",
    name: "SolCrys Motion",
    promise: "Explain the hard part in two minutes.",
    body: "Booth animation and interactive demos that make deep technical products clear, on the same facts as your pages and AI answers.",
    meta: "Quoted per piece",
    cta: "Request a quote",
  },
] as const;

export const LOOP_STEPS: LoopStep[] = [
  {
    label: "Measure",
    description: "Run the questions your buyers ask AI and record how each engine describes you today.",
    example: "Cornelis: a new category prompt set, built with their team",
  },
  {
    label: "Diagnose",
    description: "Compare those answers with your approved facts to find what is missing or wrong.",
    example: "Cornelis: zero-presence prompts became page headings",
  },
  {
    label: "Execute",
    description: "Ship the fix, from content to web pages to booth motion, each mapped to a step in the buyer's journey.",
    example: "Cornelis: five deliverables in four weeks",
  },
  {
    label: "Verify",
    description: "Re-run the same prompts against the baseline and feed what changed into the next round.",
    example: "Cornelis: 12× mention rate on the category prompts",
  },
];

export const LOOP_CENTER: [string, string] = ["same baseline,", "re-measured after launch"];

export const STATS = [
  { value: "2×", label: "AI-readiness score", note: "On the marquee product page." },
  { value: "12×", label: "Mention rate", note: "On the new category prompt set." },
  { value: "#2", label: "Share of voice", note: "Unseating the incumbent #2." },
];

export const CASE = {
  kicker: "Cornelis Networks · four weeks · AI Infra Summit launch",
  title: "A brand-new category, made answerable before the show.",
  href: "/customers/cornelis/",
};

export const WORK = work.items;

export const QUOTE = {
  text: "SolCrys AI took a deeply technical concept and turned it into real content mapped to different technical levels, and measured the effectiveness of every piece they produced.",
  name: "Brandon Draeger",
  role: "Chief Marketing Officer, Cornelis Networks",
  photo: "/customers/brandon-draeger.jpg",
};

export const LOGOS: Array<{ label: string; src: string; onLight?: string }> = [
  { label: "UiPath", src: "/customers/uipath-logo.svg" },
  { label: "NextSilicon", src: "/customers/nextsilicon-logo.svg", onLight: "invert" },
  { label: "Cornelis", src: "/customers/cornelis-logo.png" },
  { label: "Wyze", src: "/customers/wyze-logo.png" },
  { label: "ClearlyKept", src: "/customers/clearlykept-logo.png" },
  { label: "Verbatim", src: "/customers/verbatim-logo.svg" },
];

export const FAQS = [
  {
    question: "What does SolCrys do?",
    answer:
      "SolCrys makes sure AI describes your brand accurately, then builds the web pages and booth demos that tell the same story. Everything starts from your approved facts, and we measure what changed.",
  },
  {
    question: "Do you build websites and animations?",
    answer:
      "Yes. SolCrys Sites delivers homepages, category and product pages with AI-ready copy and design, hosted on our subdomain or your own domain. SolCrys Motion delivers booth animation and interactive demos. Both use the same Corporate Context as your AI visibility work.",
  },
  {
    question: "How is it priced?",
    answer:
      "SolCrys AEO is a monthly subscription with a free tier. Sites and Motion are quoted per project or per piece. Start a project and we'll come back with a scope and quote.",
  },
  {
    question: "How do you measure results?",
    answer:
      "Before we ship, we run the questions your buyers ask AI and record a baseline. After launch, the same prompts re-run across the same engines, so you can see the change in mentions, citations and share of voice.",
  },
  {
    question: "What is AEO, and how is it different from SEO?",
    answer:
      "Answer Engine Optimization makes a brand's facts, proof, and pages easy for AI systems to retrieve, cite, and summarize. SEO targets the results page; AEO targets the answer itself.",
  },
  {
    question: "How do you keep what you make accurate?",
    answer:
      "Every piece is grounded in your Corporate Context, your approved facts, claims and guardrails, and nothing ships without your team's approval.",
  },
];

export const NAV = ["Products", "Work", "Customers", "Resources", "Company"];

export const CTA = {
  title: "See how AI reads your brand today.",
  body: "Start with a free AI visibility read. When you are ready to fix what it finds, we build the pages and demos that tell your story right.",
};

/** Deep-link into the in-app free audit, same handoff as the free tracker. */
export const auditUrlFor = (domain: string) =>
  domain.trim()
    ? `${AUDIT_URL}?domain=${encodeURIComponent(domain.trim())}&autostart=1`
    : AUDIT_URL;

/** Load Google Fonts for a demo page only. */
export const useDemoFonts = (href: string) => {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, [href]);
};
