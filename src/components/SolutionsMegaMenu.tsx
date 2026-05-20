import { ArrowRight } from "lucide-react";
import { SOLUTIONS_MENU_ITEMS } from "./solutionsMenuData";

interface SolutionsMegaMenuProps {
  onItemClick?: () => void;
}

/**
 * Solutions mega menu — 4 persona cards in a row (or stacked on
 * narrow viewports). Each card is a complete pitch + jump target so
 * users can self-segment from anywhere on the site, not just the
 * homepage `#solutions` section.
 *
 * Visual register mirrors ResourcesMegaMenu so the two dropdowns feel
 * like siblings. Item data lives in solutionsMenuData.ts.
 */
const SolutionsMegaMenu = ({ onItemClick }: SolutionsMegaMenuProps) => {
  return (
    <div className="w-full max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-2xl p-7 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">
        {SOLUTIONS_MENU_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className="group relative flex flex-col rounded-xl border border-border/30 bg-card/40 p-5 hover:border-[hsl(195_90%_55%/0.45)] hover:bg-card/70 transition-colors"
          >
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-[hsl(195_90%_55%/0.15)] group-hover:text-[hsl(195_90%_55%)] transition-colors mb-3">
              <item.Icon className="h-4 w-4" />
            </span>
            <p className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">
              {item.audience}
            </p>
            <h3 className="font-display text-base font-semibold text-foreground group-hover:text-[hsl(195_90%_55%)] transition-colors mb-2">
              {item.title}
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed flex-1 mb-3">
              {item.desc}
            </p>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[hsl(195_90%_55%)]">
              Read the playbook
              <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
            </span>
          </a>
        ))}
      </div>

      {/* Bottom CTA preserves the homepage Solutions section as the
          "see them all in one place" destination. */}
      <div className="mt-6 pt-6 border-t border-border/40">
        <a
          href="/#solutions"
          onClick={onItemClick}
          className="group flex items-center justify-between rounded-xl border border-[hsl(195_90%_55%/0.35)] bg-[hsl(195_90%_55%/0.06)] hover:bg-[hsl(195_90%_55%/0.12)] transition-colors px-5 py-4"
        >
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(195_90%_55%)]">
              All solutions
            </p>
            <p className="text-sm font-medium text-foreground">
              Compare side-by-side on the homepage
            </p>
          </div>
          <ArrowRight className="h-4 w-4 text-[hsl(195_90%_55%)] group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default SolutionsMegaMenu;
