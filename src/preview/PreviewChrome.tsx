import { useEffect } from "react";

/**
 * /preview/ pages are internal design reviews on the production domain.
 * They mirror the draft mechanism in scripts/prerender.mjs: reachable by
 * direct URL, noindex, never linked from the site, and excluded from the
 * sitemap and llms files. Lead forms on these paths do not submit
 * (see isPreviewPath in src/lib/lead-intake.ts).
 */
export const usePreviewPage = (title: string) => {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `[Preview] ${title} | SolCrys`;
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    const previousRobots = robots?.content;
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow";
    return () => {
      document.title = previousTitle;
      if (robots && previousRobots !== undefined) robots.content = previousRobots;
    };
  }, [title]);
};

export const PreviewRibbon = () => (
  <div
    className="pointer-events-none fixed bottom-3 left-3 z-[60] rounded-full bg-black/85 px-3 py-1.5 text-[11px] font-semibold tracking-[0.04em] text-white"
    aria-hidden="true"
  >
    INTERNAL PREVIEW · not the live site
  </div>
);
