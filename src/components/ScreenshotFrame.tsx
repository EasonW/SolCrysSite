import type { ReactNode } from "react";

type ScreenshotFrameProps = {
  src: string;
  alt: string;
  /** Text in the address bar: the page's URL, or a plain label for product UI. */
  label: string;
  /** When set, the window links out (new tab). */
  href?: string;
  /** Tailwind aspect class for the image crop, e.g. "aspect-[5/3]". */
  aspect?: string;
  className?: string;
};

/**
 * A screenshot of another site (or of the product) shown as a browser window
 * on a tinted mat, so it reads as an object on the page rather than as part
 * of the page: the window bar and URL say "this is a website", the mat gives
 * it an edge in both themes, and in dark mode the image is dimmed slightly
 * so a bright client page doesn't outshine our own copy (full colour again
 * on hover).
 */
const ScreenshotFrame = ({ src, alt, label, href, aspect = "aspect-[4/3]", className = "" }: ScreenshotFrameProps) => {
  const chrome: ReactNode = (
    <>
      <div
        className="flex h-7 items-center gap-1.5 border-b border-border/70 bg-muted px-3"
        aria-hidden="true"
      >
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="h-2 w-2 rounded-full bg-muted-foreground/40" />
        <span className="ml-2 min-w-0 flex-1 truncate rounded-md bg-background/60 px-2.5 font-mono text-[11px] leading-5 text-muted-foreground">
          {label}
        </span>
      </div>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`${aspect} w-full object-cover object-top transition-[filter] duration-300 dark:brightness-[.85] dark:saturate-[.9] dark:group-hover:brightness-100 dark:group-hover:saturate-100`}
      />
    </>
  );
  const windowClass =
    "group block overflow-hidden rounded-lg border border-border/70 bg-card shadow-[0_24px_48px_-24px_rgba(0,0,0,0.55)]";

  return (
    <div
      className={`flex min-w-0 items-center bg-gradient-to-br from-[hsl(var(--brand-accent)/0.16)] to-[hsl(var(--muted)/0.55)] p-5 md:p-7 ${className}`}
    >
      {href ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className={`${windowClass} w-full`}>
          {chrome}
        </a>
      ) : (
        <div className={`${windowClass} w-full`}>{chrome}</div>
      )}
    </div>
  );
};

export default ScreenshotFrame;
