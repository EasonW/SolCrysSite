import { Clapperboard, LayoutTemplate, Radar } from "lucide-react";
import type { SolutionsMenuItem } from "./solutionsMenuData";

// The Products mega menu: what a buyer can buy from SolCrys. Solutions (who
// it's for) stays a separate menu, so the two never mix. The same three names,
// in this order, appear in the footer Product column and the prerendered nav
// (scripts/prerender.mjs navHtml) — keep all three in step.
//
// `audience` is the eyebrow; it labels software vs built-for-you so a visitor
// can tell which line they can start themselves.
export const PRODUCTS_MENU_ITEMS: SolutionsMenuItem[] = [
  {
    title: "SolCrys AEO",
    audience: "Software · free plan",
    desc: "See how ChatGPT, Gemini, Google AI Overviews, Perplexity and Claude describe you, ship the fixes and verify what changed.",
    href: "/#features",
    cta: "See SolCrys AEO",
    Icon: Radar,
  },
  {
    title: "SolCrys Sites",
    audience: "Websites, built and hosted for you",
    desc: "We plan, write, design, build and host your website, and measure how AI engines describe you before and after launch.",
    href: "/sites/",
    cta: "See SolCrys Sites",
    Icon: LayoutTemplate,
  },
  {
    title: "SolCrys Motion",
    audience: "Booth and demos, built for you",
    desc: "Booth animation and interactive demos that make technical products clear.",
    href: "/motion/",
    cta: "See SolCrys Motion",
    Icon: Clapperboard,
  },
];

export const PRODUCTS_MENU_FOOTER = {
  eyebrow: "One Corporate Context",
  text: "All three work from your approved facts",
  href: "/corporate-context-ai-marketing/",
};
