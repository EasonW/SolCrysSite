import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  RESOURCE_COUNT,
  searchResources,
  type SearchResult,
} from "@/lib/searchIndex";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Global ⌘K command palette for resource search. Overlay-only (no route), so
 * there's no search-results URL for crawlers to index — search stays a pure
 * client-side navigation aid while the resource pages remain the canonical,
 * prerendered, AI-citable surface.
 *
 * Results are shown flat in relevance order (best match first) with a category
 * label per row, rather than grouped by category — for a search palette the
 * top hit matters more than tidy grouping.
 */
const SearchCommand = ({ open, onOpenChange }: SearchCommandProps) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const results = useMemo(() => searchResources(query), [query]);

  // Reset the highlight whenever the result set changes.
  useEffect(() => setActive(0), [results]);

  // Open fresh each time — clear the query on close.
  useEffect(() => {
    if (!open) setQuery("");
  }, [open]);

  // Keep the active row visible as the user arrows through results.
  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-idx="${active}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (result?: SearchResult) => {
    if (!result) return;
    onOpenChange(false);
    navigate(`/${result.slug}/`);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="top-[12vh] translate-y-0 max-w-xl gap-0 overflow-hidden p-0"
        onOpenAutoFocus={(e) => {
          // Focus the search input rather than Radix's default (the close X).
          e.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <DialogTitle className="sr-only">Search resources</DialogTitle>

        <div className="flex items-center gap-3 border-b border-border/50 px-4">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Search ${RESOURCE_COUNT} guides…`}
            aria-label="Search resources"
            className="h-12 w-full bg-transparent pr-8 text-base outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div ref={listRef} className="max-h-[60vh] overflow-y-auto py-2">
          {query.trim() === "" ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Search across every AEO guide by title, topic, or question.
            </p>
          ) : results.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              No guides match “{query.trim()}”.
            </p>
          ) : (
            results.map((result, i) => (
              <button
                key={result.slug}
                type="button"
                data-idx={i}
                onMouseEnter={() => setActive(i)}
                onClick={() => go(result)}
                className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors ${
                  i === active ? "bg-[hsl(var(--brand-accent)/0.1)]" : ""
                }`}
              >
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  {result.category}
                </span>
                <span
                  className={`font-display text-sm font-medium ${
                    i === active ? "text-[hsl(var(--brand-accent))]" : "text-foreground"
                  }`}
                >
                  {result.title}
                </span>
                <span className="line-clamp-1 text-xs text-muted-foreground">
                  {result.description}
                </span>
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchCommand;
