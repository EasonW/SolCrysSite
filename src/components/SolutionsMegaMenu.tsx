import { ArrowRight } from "lucide-react";
import { SOLUTIONS_MENU_ITEMS, type SolutionsMenuItem } from "./solutionsMenuData";

type MegaMenuFooter = { eyebrow: string; text: string; href: string };

interface SolutionsMegaMenuProps {
  onItemClick?: () => void;
  /** Defaults to the four Solutions personas; the Products menu passes its own. */
  items?: SolutionsMenuItem[];
  footer?: MegaMenuFooter;
}

/** Bottom CTA preserves the homepage Solutions section as the
 *  "see them all in one place" destination. */
const SOLUTIONS_FOOTER: MegaMenuFooter = {
  eyebrow: "All solutions",
  text: "Compare side-by-side on the homepage",
  href: "/#solutions",
};

/**
 * Card mega menu — one card per item in a row (or stacked on narrow
 * viewports). Each card is a complete pitch + jump target. Renders the
 * Solutions personas by default (solutionsMenuData.ts) and the Products
 * menu when given PRODUCTS_MENU_ITEMS (productsMenuData.ts).
 *
 * Visual register mirrors ResourcesMegaMenu so the dropdowns feel
 * like siblings.
 */
const SolutionsMegaMenu = ({
  onItemClick,
  items = SOLUTIONS_MENU_ITEMS,
  footer = SOLUTIONS_FOOTER,
}: SolutionsMegaMenuProps) => {
  return (
    <div className="w-full max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-floating-lg p-7 md:p-8">
      <div className={`grid grid-cols-1 ${items.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"} gap-4 md:gap-5`}>
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className="group relative flex flex-col rounded-xl border border-border/30 bg-card/40 p-5 hover:border-[hsl(var(--brand-accent)/0.45)] hover:bg-card/70 transition-colors"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-[hsl(var(--brand-accent)/0.15)] group-hover:text-[hsl(var(--brand-accent))] transition-colors mb-3">
              <item.Icon className="h-4 w-4" />
            </span>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
              {item.audience}
            </p>
            <h3 className="font-display text-base font-semibold text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors mb-2">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
              {item.desc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(var(--brand-accent))]">
              {item.cta ?? "Read the playbook"}
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-border/40">
        <a
          href={footer.href}
          onClick={onItemClick}
          className="group flex items-center justify-between rounded-xl border border-[hsl(var(--brand-accent)/0.35)] bg-[hsl(var(--brand-accent)/0.06)] hover:bg-[hsl(var(--brand-accent)/0.12)] transition-colors px-5 py-4"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--brand-accent))]">
              {footer.eyebrow}
            </p>
            <p className="text-sm font-medium text-foreground">
              {footer.text}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-[hsl(var(--brand-accent))] group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default SolutionsMegaMenu;
