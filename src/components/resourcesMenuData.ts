import {
  BookOpen,
  Compass,
  TrendingUp,
  ClipboardList,
  MessageSquare,
  Sparkles,
  MessageCircle,
  Search,
  Globe,
  ShoppingCart,
  Tag,
  ShoppingBasket,
  Gauge,
  Brain,
  Link2,
  Wrench,
  Users,
  AlertTriangle,
  ArrowRight,
  Workflow,
  Boxes,
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
};

const categoryHref = (category: string): string => `/resources/#${categorySlug(category)}`;

export const RESOURCES_COLUMNS: ResourcesMenuColumn[] = [
  {
    label: "Start here",
    items: [
      {
        title: "How SolCrys Works",
        desc: "Measure, diagnose, act, and verify",
        href: categoryHref("How SolCrys Works"),
        Icon: Workflow,
      },
      {
        title: "For Agencies",
        desc: "Launch and scale an AEO practice",
        href: categoryHref("For Agencies"),
        Icon: Users,
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
    ],
  },
  {
    label: "By AI Engine",
    items: [
      {
        title: "Optimize for ChatGPT",
        desc: "Citation-first guide for ChatGPT Search",
        href: "/optimize-for-chatgpt-search/",
        Icon: MessageSquare,
      },
      {
        title: "Optimize for Gemini",
        desc: "Google's other AI search engine",
        href: "/optimize-for-gemini/",
        Icon: Sparkles,
      },
      {
        title: "Optimize for Claude",
        desc: "Anthropic web-search guide",
        href: "/optimize-for-claude/",
        Icon: MessageCircle,
      },
      {
        title: "Optimize for Perplexity",
        desc: "Citation-driven retrieval",
        href: "/optimize-for-perplexity/",
        Icon: Search,
      },
      {
        title: "Google AI Overviews / AI Mode",
        desc: "Survive AI-driven SERPs",
        href: "/optimize-for-google-ai-overviews-ai-mode/",
        Icon: Globe,
      },
      {
        title: "Amazon Rufus",
        desc: "Marketplace AEO for Amazon SKUs",
        href: "/amazon-rufus-optimization/",
        Icon: ShoppingCart,
      },
      {
        title: "Walmart Sparky",
        desc: "Walmart marketplace AEO",
        href: "/walmart-sparky-optimization/",
        Icon: Tag,
      },
      {
        title: "ChatGPT Shopping",
        desc: "DTC + marketplace product visibility",
        href: "/chatgpt-shopping-optimization/",
        Icon: ShoppingBasket,
      },
    ],
  },
  {
    label: "Operate & Execute",
    items: [
      {
        title: "Measurement",
        desc: "Mentions, citations, share of recommendation",
        href: categoryHref("Measurement"),
        Icon: Gauge,
      },
      {
        title: "Prompt Intelligence",
        desc: "Build the prompt set that matters",
        href: categoryHref("Prompt Intelligence"),
        Icon: Brain,
      },
      {
        title: "Citation & Source Influence",
        desc: "Earn the sources AI engines cite",
        href: categoryHref("Citation & Source Influence"),
        Icon: Link2,
      },
      {
        title: "Technical Readiness",
        desc: "Crawler, schema, answer-readiness checklist",
        href: categoryHref("Technical Readiness"),
        Icon: Wrench,
      },
      {
        title: "MCP & Skills",
        desc: "Connect AI agents to your SolCrys workspace",
        href: categoryHref("MCP & Skills"),
        Icon: Boxes,
      },
      {
        title: "Community & UGC",
        desc: "Reddit, Q&A, comments as citations",
        href: categoryHref("Community & UGC"),
        Icon: Users,
      },
      {
        title: "Risk Monitoring",
        desc: "Catch hallucinations before customers do",
        href: categoryHref("Risk Monitoring"),
        Icon: AlertTriangle,
      },
      {
        title: "Attribution & ROI",
        desc: "Tie AEO actions to revenue",
        href: categoryHref("Attribution & ROI"),
        Icon: TrendingUp,
      },
      {
        title: "Buyer Guides",
        desc: "Evaluate AEO platforms before signing",
        href: categoryHref("Buyer Guides"),
        Icon: ClipboardList,
      },
    ],
  },
];

// Footer kept exported for back-compat (consumers can render or omit).
// New mega-menu now renders an "All resources" full-width CTA bar directly
// in ResourcesMegaMenu.tsx, so this array can be empty by default.
export const RESOURCES_FOOTER_LINKS: ResourcesMenuItem[] = [];
