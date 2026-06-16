import {
  BookOpen,
  Compass,
  ClipboardList,
  MessageSquare,
  Sparkles,
  Search,
  Globe,
  Gauge,
  Link2,
  Users,
  AlertTriangle,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { categorySlug } from "@/lib/categorySlug";

export type ResourcesMenuItem = {
  title: string;
  desc: string;
  href: string;
  Icon: LucideIcon;
};

export type ResourcesMenuColumn = {
  label: string;
  items: ResourcesMenuItem[];
  /** Optional "see all" link rendered at the bottom of the column. */
  seeAll?: { label: string; href: string };
};

const categoryHref = (category: string): string => `/resources/#${categorySlug(category)}`;

// Slimmed 2026-05 nav cleanup: 21 → 12 items.
// Heuristic: keep ≤4 items per column to stay scannable. Items hidden
// from the menu are still reachable via the "Browse all guides" CTA at
// the bottom of the menu (full /resources/ index) or via the per-column
// "see all" links below — no content is orphaned, only de-emphasized.
export const RESOURCES_COLUMNS: ResourcesMenuColumn[] = [
  {
    label: "Foundations",
    items: [
      {
        title: "How SolCrys Works",
        desc: "Measure, diagnose, act, and verify",
        href: categoryHref("How SolCrys Works"),
        Icon: Workflow,
      },
      {
        title: "AEO Fundamentals",
        desc: "What AEO is, why it matters",
        href: categoryHref("AEO Fundamentals"),
        Icon: BookOpen,
      },
      {
        title: "Strategy & Positioning",
        desc: "How to frame AEO inside your team",
        href: categoryHref("Strategy & Positioning"),
        Icon: Compass,
      },
      {
        title: "For Agencies",
        desc: "Launch and scale an AEO practice",
        href: categoryHref("For Agencies"),
        Icon: Users,
      },
    ],
  },
  {
    label: "By AI Engine",
    items: [
      {
        title: "ChatGPT",
        desc: "Citation-first guide for ChatGPT Search",
        href: "/optimize-for-chatgpt-search/",
        Icon: MessageSquare,
      },
      {
        title: "Gemini",
        desc: "Google's other AI search engine",
        href: "/optimize-for-gemini/",
        Icon: Sparkles,
      },
      {
        title: "Perplexity",
        desc: "Citation-driven retrieval",
        href: "/optimize-for-perplexity/",
        Icon: Search,
      },
      {
        title: "Google AI Overviews",
        desc: "Survive AI-driven SERPs",
        href: "/optimize-for-google-ai-overviews-ai-mode/",
        Icon: Globe,
      },
    ],
    // Claude, Alexa for Shopping (formerly Rufus), Walmart Sparky, ChatGPT Shopping live under
    // their own routes; the "see all engines" anchor on /resources/
    // surfaces them with the rest.
    seeAll: {
      label: "All AI engines →",
      href: categoryHref("AI Engine Optimization"),
    },
  },
  {
    label: "Operate",
    items: [
      {
        title: "Measurement",
        desc: "Mentions, citations, share of recommendation",
        href: categoryHref("Measurement"),
        Icon: Gauge,
      },
      {
        title: "Buyer Guides",
        desc: "Evaluate AEO platforms before signing",
        href: categoryHref("Buyer Guides"),
        Icon: ClipboardList,
      },
      {
        title: "Citation & Source Influence",
        desc: "Earn the sources AI engines cite",
        href: categoryHref("Citation & Source Influence"),
        Icon: Link2,
      },
      {
        title: "Risk Monitoring",
        desc: "Catch hallucinations before customers do",
        href: categoryHref("Risk Monitoring"),
        Icon: AlertTriangle,
      },
    ],
    // Prompt Intelligence, Technical Readiness, MCP & Skills,
    // Community & UGC, Attribution & ROI now live under the
    // "Browse all guides" CTA at the bottom of the menu.
  },
];

// Footer kept exported for back-compat (consumers can render or omit).
// New mega-menu now renders an "All resources" full-width CTA bar directly
// in ResourcesMegaMenu.tsx, so this array can be empty by default.
export const RESOURCES_FOOTER_LINKS: ResourcesMenuItem[] = [];
