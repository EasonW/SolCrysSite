/**
 * Centralized destination URL for the app-side pricing page.
 *
 * Production: `https://app.solcrys.com/pricing` (the canonical merged
 * pricing page, see geo-platform/dashboard/app/(marketing)/pricing).
 *
 * Local dev: override via `VITE_APP_PRICING_URL` in `.env.local` to
 * something like `http://localhost:3000/pricing` so internal nav clicks
 * land on the local app dev server instead of production. Without the
 * override, end-to-end testing of the Phase E theme handoff against a
 * local app instance isn't possible — the marketing nav would jump
 * cross-domain to prod.
 *
 * Used by:
 *   - `Navbar.tsx` / `Footer.tsx` / `Customers.tsx` Pricing CTAs (the
 *     anchor href is static at render time so this resolves once at
 *     module load).
 *   - `PricingRedirect.tsx` SPA-side bridge that fires on warm-cache
 *     client navigations to /pricing/.
 *
 * NOT used by:
 *   - `scripts/prerender.mjs` (build-time Node process). That script
 *     reads `process.env.VITE_APP_PRICING_URL` directly because it
 *     emits the static `/pricing/index.html` bridge page and the
 *     prerendered nav HTML, both of which need the same value baked
 *     in at build time.
 */
export const APP_PRICING_URL: string =
  (import.meta.env.VITE_APP_PRICING_URL as string | undefined) ||
  "https://app.solcrys.com/pricing";
