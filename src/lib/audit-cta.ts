/**
 * Free-Audit CTA wiring.
 *
 * Centralizes the production audit URL + the GA event the marketing
 * site fires when a user clicks any "Free Audit" button. Replaces
 * the old EarlyAccessDialog (form-modal) flow for the audit mode —
 * the audit funnel now lives at app.solcrys.com/audit and accepts
 * the same intent without a marketing-side form step.
 *
 * Founder Chat (EarlyAccessDialog with mode="founder") still uses
 * the in-page dialog, since that path is a real sales lead, not a
 * self-serve product entry.
 */

import { trackEvent, type AuditSurface } from "./analytics";

// Centralized so a future change (preview env override, A/B variant,
// etc.) only touches one file.
export const AUDIT_URL: string =
  (import.meta.env.VITE_AUDIT_URL as string | undefined) ||
  "https://app.solcrys.com/audit";

/**
 * Fire the GA event for a Free-Audit click. Mirrors the event name
 * the EarlyAccessDialog used for its `_open` event, so historical
 * dashboards keep working — the user has _opened_ the audit funnel,
 * just on the app side instead of the marketing-side modal.
 */
export function trackAuditClick(surface: AuditSurface): void {
  trackEvent("request_audit_open", { surface, mode: "audit", destination: "app" });
}
