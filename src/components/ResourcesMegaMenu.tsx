import { Activity, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RESOURCES_COLUMNS } from "./resourcesMenuData";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import siteContent from "@/content/siteContent.json";

interface ResourcesMegaMenuProps {
  onItemClick?: () => void;
}

const ResourcesMegaMenu = ({ onItemClick }: ResourcesMegaMenuProps) => {
  // Both close the menu and fire the GA event. Same pattern as the
  // resource-item clicks above.
  const handleAuditClick = () => {
    onItemClick?.();
    trackAuditClick("resources_mega");
  };

  // `.shadow-floating-lg` (in index.css) overrides the project's
  // brutalist `--shadow-2xl` token (24px hard-offset black in light
  // mode). Uses `!important` to win the Tailwind `shadow-{size}`
  // specificity race; mode-aware via `.dark .shadow-floating-lg`.
  return (
    <div className="w-full max-h-[calc(100vh-5rem)] overflow-y-auto rounded-2xl border border-border/40 bg-background/95 backdrop-blur-xl shadow-floating-lg p-7 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
        {RESOURCES_COLUMNS.map((col) => (
          <div key={col.label} className="md:col-span-3">
            <p className="text-xs uppercase tracking-wider font-medium text-muted-foreground mb-4">
              {col.label}
            </p>
            <ul className="space-y-3">
              {col.items.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onItemClick}
                    className="group flex gap-3 items-start rounded-md p-2 -m-2 hover:bg-muted/50 transition-colors"
                  >
                    <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground group-hover:bg-[hsl(195_90%_55%/0.15)] group-hover:text-[hsl(195_90%_55%)] transition-colors">
                      <item.Icon className="h-4 w-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-medium text-foreground group-hover:text-[hsl(195_90%_55%)] transition-colors">
                        {item.title}
                      </span>
                      <span className="block text-xs text-muted-foreground leading-snug mt-0.5">
                        {item.desc}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            {col.seeAll ? (
              <a
                href={col.seeAll.href}
                onClick={onItemClick}
                className="mt-3 inline-flex items-center text-xs font-medium text-[hsl(195_90%_55%)] hover:text-[hsl(195_90%_45%)] transition-colors"
              >
                {col.seeAll.label}
              </a>
            ) : null}
          </div>
        ))}

        {/* Free Audit CTA card — theme-aware to avoid inverse-color split with the menu */}
        <div className="md:col-span-3">
          <div className="h-full rounded-xl border border-[hsl(195_90%_55%/0.35)] bg-card/40 p-5 flex flex-col">
            <p className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(195_90%_55%)] mb-2">
              Try SolCrys
            </p>
            <h3 className="font-display text-base font-semibold leading-tight mb-2">
              Free ChatGPT Baseline
            </h3>
            <p className="text-xs text-muted-foreground leading-relaxed mb-4 flex-1">
              One-time read on buyer prompts, competitor mentions, and source
              gaps before you commit to daily monitoring.
            </p>
            <Button asChild variant="hero" size="sm" className="w-full">
              <a href={AUDIT_URL} onClick={handleAuditClick}>
                Start free audit
                <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Featured: Prompt Pulse (free tool) + Browse-all CTA */}
      <div className="mt-6 pt-6 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-3">
        <a
          href="/prompt-pulse/"
          onClick={onItemClick}
          className="group flex items-center justify-between rounded-xl border border-[hsl(195_90%_55%/0.35)] bg-[hsl(195_90%_55%/0.06)] hover:bg-[hsl(195_90%_55%/0.12)] transition-colors px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex-none rounded-md bg-[hsl(195_90%_55%/0.18)] p-2">
              <Activity className="h-4 w-4 text-[hsl(195_90%_55%)]" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(195_90%_55%)]">
                Prompt Pulse
              </p>
              <p className="text-sm font-medium text-foreground">
                AI demand data — what buyers ask AI, by industry
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-[hsl(195_90%_55%)] group-hover:translate-x-1 transition-transform" />
        </a>
        <a
          href="/resources/"
          onClick={onItemClick}
          className="group flex items-center justify-between rounded-xl border border-border/40 bg-card/40 hover:bg-card/70 transition-colors px-5 py-4"
        >
          <div className="flex items-center gap-3">
            <span className="flex-none rounded-md bg-muted/40 p-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </span>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
                All resources
              </p>
              <p className="text-sm font-medium text-foreground">
                Browse all {siteContent.resourcePages.filter((p) => (p as { status?: string }).status !== "draft").length} guides
              </p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
};

export default ResourcesMegaMenu;
