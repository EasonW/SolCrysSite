import {
  TrendingUp,
  ShoppingCart,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";

export type SolutionsMenuItem = {
  /** Persona name; rendered as the column heading. */
  title: string;
  /** One-line audience descriptor (mirrors siteContent.home.solutions[].audience). */
  audience: string;
  /** Short value-prop sentence rendered below the audience line. */
  desc: string;
  /** Anchor / route this persona's playbook lives at. */
  href: string;
  Icon: LucideIcon;
};

// Mirrors the 4 personas defined in src/content/siteContent.json
// (`home.solutions`). The mega menu is a navigational re-projection of
// the homepage Solutions section so users can jump straight to their
// playbook from any page — not just `/#solutions`.
//
// hrefs are the same target articles the SolutionsSection cards link to.
// When dedicated /solutions/<persona>/ pages eventually exist, only the
// hrefs change; the structure stays.
export const SOLUTIONS_MENU_ITEMS: SolutionsMenuItem[] = [
  {
    title: "For SEO & Growth",
    audience: "Heads of SEO, organic growth, demand gen",
    desc: "Track brand visibility across AI answers and the prompts that drive pipeline.",
    href: "/ai-brand-visibility-monitoring/",
    Icon: TrendingUp,
  },
  {
    title: "For Retail & Commerce",
    audience: "Marketplace, DTC, and digital shelf teams",
    desc: "Win AI shopping recommendations on Amazon Rufus, Walmart Sparky, and ChatGPT Shopping.",
    href: "/retail-aeo/",
    Icon: ShoppingCart,
  },
  {
    title: "For Agencies",
    audience: "SEO, content, and digital strategy agencies",
    desc: "Stand up an AEO practice and run it across 10+ clients from one workspace.",
    href: "/aeo-for-agencies/",
    Icon: Users,
  },
  {
    title: "For Enterprise Brands",
    audience: "Brand safety, digital ops, marketing leadership",
    desc: "Govern AI-surfaced brand context across regions, products, and lifecycle stages.",
    href: "/corporate-context-ai-marketing/",
    Icon: Building2,
  },
];
