import { useEffect } from "react";

import { APP_PRICING_URL } from "@/lib/pricing-url";

/**
 * Phase E redirect component for the SPA pricing route.
 *
 * The canonical pricing page lives at https://app.solcrys.com/pricing
 * after the merge. This component handles the edge case where a user
 * lands on solcrys.com/pricing via client-side navigation (browser
 * back/forward, direct typed URL after the SPA has loaded, or a stale
 * internal link that still uses a relative path).
 *
 * The prerendered static HTML at /pricing/index.html already ships a
 * `<meta http-equiv="refresh">` so cold visits redirect before the
 * SPA hydrates. This component is the warm-cache equivalent: when
 * React Router intercepts the navigation it never sees the static
 * HTML, so we redirect here instead.
 *
 * Theme handoff: reads the marketing site's `solcrys-theme`
 * localStorage value and appends it as `?theme=<light|dark>` to the
 * destination URL. The app's themeInitScript reads that param and
 * writes its own `solcrys.theme` localStorage entry — different
 * subdomain, different storage namespace, so URL is the only viable
 * cross-domain handoff channel.
 *
 * UTM params are preserved verbatim so attribution survives the hop.
 *
 * Renders a minimal "Redirecting…" message that flashes for ~10ms
 * before the navigation lands; intentionally not styled because it
 * shouldn't be visible long enough to matter.
 */
export default function PricingRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const resolveTheme = (): "light" | "dark" => {
      try {
        const stored = window.localStorage.getItem("solcrys-theme");
        if (stored === "light" || stored === "dark") return stored;
      } catch {
        /* localStorage blocked — fall through to system detection */
      }
      try {
        return window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
      } catch {
        return "light";
      }
    };

    const params = new URLSearchParams(window.location.search);
    if (!params.has("theme")) {
      // Always pass the resolved theme so the app honors what the
      // visitor saw here, even if their app-side localStorage has a
      // stale preference from an earlier session. Matches the static
      // bridge page logic in scripts/prerender.mjs.
      params.set("theme", resolveTheme());
    }

    const qs = params.toString();
    const dest = qs ? `${APP_PRICING_URL}?${qs}` : APP_PRICING_URL;
    window.location.replace(dest);
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui" }}>
      <p>
        Redirecting to{" "}
        <a href={APP_PRICING_URL}>app.solcrys.com/pricing</a>…
      </p>
    </main>
  );
}
