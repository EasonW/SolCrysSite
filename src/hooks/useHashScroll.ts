import { useEffect } from "react";

/**
 * Scroll to the URL hash target after React mounts.
 *
 * The browser's native scroll-to-hash fires before React renders the page,
 * so anchor targets that React creates (especially below the fold) often
 * don't exist yet when the browser tries to scroll. This hook polls for the
 * target element (up to 2s) and scrolls to it once it appears.
 *
 * - Initial mount: instant scroll (user clicked a link, expects to land).
 * - Subsequent `hashchange` (intra-page nav): smooth scroll.
 *
 * Pair with `scroll-mt-*` Tailwind utilities on anchor targets so the
 * landing position accounts for the fixed navbar height.
 */
export const useHashScroll = () => {
  useEffect(() => {
    const scrollToHash = (smooth: boolean) => {
      if (!window.location.hash) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        } else if (attempts++ < 40) {
          setTimeout(tryScroll, 50); // up to ~2 seconds
        }
      };
      tryScroll();
    };
    scrollToHash(false);
    const onHashChange = () => scrollToHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
};
