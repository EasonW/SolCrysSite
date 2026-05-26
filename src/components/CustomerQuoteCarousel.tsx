import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Lock, ShoppingBag, User } from "lucide-react";

type AttributionLink =
  | { type: "linkedin"; href: string }
  | { type: "amazon"; href: string }
  | { type: "withheld" };

export type CustomerQuote = {
  name: string;
  role: string;
  company: string;
  photoUrl: string | null;
  quote: string;
  accent?: string;
  attribution: AttributionLink;
};

const LinkedInIcon = () => (
  <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const AttributionPill = ({ attribution, name }: { attribution: AttributionLink; name: string }) => {
  if (attribution.type === "withheld") {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground/80">
        <Lock className="h-3.5 w-3.5" />
        Company withheld
      </span>
    );
  }
  if (attribution.type === "amazon") {
    return (
      <a
        href={attribution.href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        aria-label={`${name} on Amazon`}
      >
        <ShoppingBag className="h-3.5 w-3.5" />
        Amazon store
      </a>
    );
  }
  return (
    <a
      href={attribution.href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
      aria-label={`${name} on LinkedIn`}
    >
      <LinkedInIcon />
      LinkedIn
    </a>
  );
};

const QuotePhoto = ({
  photoUrl,
  accent,
  alt,
}: {
  photoUrl: string | null;
  accent?: string;
  alt: string;
}) => {
  const ringStyle = accent ? { boxShadow: `0 0 0 3px ${accent}66` } : undefined;
  if (photoUrl) {
    return (
      <div
        className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden shrink-0 bg-muted/40"
        style={ringStyle}
      >
        <img src={photoUrl} alt={alt} className="h-full w-full object-cover" loading="lazy" />
      </div>
    );
  }
  return (
    <div
      className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden shrink-0 bg-muted/40 flex items-center justify-center border border-border/40"
      aria-label="Photo coming soon"
    >
      <User className="h-1/2 w-1/2 text-muted-foreground/60" aria-hidden />
    </div>
  );
};

interface CustomerQuoteCarouselProps {
  quotes: CustomerQuote[];
  intervalMs?: number;
  minHeight?: string;
}

const CustomerQuoteCarousel = ({
  quotes,
  intervalMs = 8000,
  minHeight = "360px",
}: CustomerQuoteCarouselProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % quotes.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [paused, intervalMs, quotes.length]);

  const next = () => setActiveIndex((i) => (i + 1) % quotes.length);
  const prev = () => setActiveIndex((i) => (i - 1 + quotes.length) % quotes.length);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-border/40 bg-card/50 backdrop-blur-sm grid"
        style={{ minHeight }}
      >
        {quotes.map((q, i) => {
          const isActive = i === activeIndex;
          return (
            <article
              key={q.name}
              aria-hidden={!isActive}
              style={{ gridArea: "1 / 1" }}
              className={`transition-opacity duration-700 ease-in-out ${
                isActive ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="h-full flex flex-col md:flex-row items-stretch">
                {/* Attribution column */}
                <div className="flex flex-col items-center md:items-start justify-center gap-4 p-6 md:p-10 md:w-[300px] border-b md:border-b-0 md:border-r border-border/40 bg-muted/15">
                  <QuotePhoto photoUrl={q.photoUrl} accent={q.accent} alt={q.name} />
                  <div className="text-center md:text-left">
                    <p className="font-heading text-sm md:text-base font-semibold text-foreground">
                      {q.name}
                    </p>
                    <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{q.role}</p>
                    <p
                      className="text-[11px] uppercase tracking-[0.15em] mt-1"
                      style={
                        q.accent
                          ? { color: q.accent }
                          : { color: "hsl(var(--muted-foreground))" }
                      }
                    >
                      {q.company}
                    </p>
                    <div className="mt-2">
                      <AttributionPill attribution={q.attribution} name={q.name} />
                    </div>
                  </div>
                </div>

                {/* Quote column */}
                <div className="flex-1 p-6 md:p-10 flex flex-col justify-center">
                  <div
                    aria-hidden
                    className="font-heading text-5xl leading-none mb-1 select-none"
                    style={
                      q.accent
                        ? { color: q.accent, opacity: 0.45 }
                        : { color: "hsl(var(--muted-foreground))", opacity: 0.55 }
                    }
                  >
                    “
                  </div>
                  <blockquote className="font-heading text-sm md:text-base lg:text-lg leading-relaxed text-foreground">
                    {q.quote}
                  </blockquote>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Manual nav arrows (desktop, overlaid on sides) */}
      <div className="absolute inset-y-0 left-0 hidden md:flex items-center -ml-5">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous quote"
          className="h-10 w-10 rounded-full bg-background border border-border/60 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] flex items-center justify-center text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      </div>
      <div className="absolute inset-y-0 right-0 hidden md:flex items-center -mr-5">
        <button
          type="button"
          onClick={next}
          aria-label="Next quote"
          className="h-10 w-10 rounded-full bg-background border border-border/60 shadow-[0_4px_12px_-4px_rgba(0,0,0,0.12)] dark:shadow-[0_4px_12px_-4px_rgba(0,0,0,0.4)] flex items-center justify-center text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Face thumbnail navigator — all customers visible at once */}
      <div className="mt-6 flex justify-center items-center gap-3 md:gap-4">
        {quotes.map((q, i) => {
          const isActive = i === activeIndex;
          const ringColor = q.accent ?? "hsl(var(--foreground))";
          return (
            <button
              key={q.name}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Show quote from ${q.name}`}
              aria-current={isActive}
              className={`group relative h-11 w-11 md:h-12 md:w-12 rounded-full overflow-hidden transition-all ${
                isActive ? "scale-110" : "opacity-55 hover:opacity-100"
              }`}
              style={
                isActive
                  ? { boxShadow: `0 0 0 2px ${ringColor}, 0 0 0 4px hsl(var(--background))` }
                  : undefined
              }
            >
              {q.photoUrl ? (
                <img
                  src={q.photoUrl}
                  alt={q.name}
                  className="h-full w-full object-cover bg-muted/40"
                  loading="lazy"
                />
              ) : (
                <span
                  className="h-full w-full flex items-center justify-center bg-muted/40 text-[10px] font-semibold text-muted-foreground"
                  aria-hidden
                >
                  {q.name
                    .split(" ")
                    .map((p) => p[0])
                    .slice(0, 2)
                    .join("")}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile arrows under dots */}
      <div className="mt-4 md:hidden flex justify-center gap-3">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous quote"
          className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next quote"
          className="h-9 w-9 rounded-full border border-border/60 flex items-center justify-center text-foreground hover:bg-muted/40 transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default CustomerQuoteCarousel;
