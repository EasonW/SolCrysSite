/**
 * Unified lead-intake submitter for marketing-site forms.
 *
 * Replaces direct Formspree POSTs. Routes submissions to the geo-platform
 * lead-intake API (app.solcrys.com/api/lead-intake) so leads land in a
 * single triaged database instead of a third-party inbox.
 *
 * Migration strategy (Stage 1 — dual-write):
 *   - When VITE_LEAD_INTAKE_URL is configured AND
 *     VITE_LEAD_INTAKE_DUAL_WRITE === "1", we POST to the lead-intake
 *     endpoint as primary, then fire-and-forget to Formspree as audit.
 *     Lets us reconcile lead counts between the two before cutover.
 *   - On Stage 2 (cutover), flip VITE_LEAD_INTAKE_DUAL_WRITE off. Our
 *     endpoint becomes the only writer.
 *   - On any failure of the primary endpoint, we automatically fall
 *     back to Formspree so we don't lose a lead during deploy issues.
 *
 * Dev safety: if VITE_LEAD_INTAKE_URL is unset (no geo-platform on
 * localhost), Formspree is used directly. Local dev keeps working.
 */

// ─── Types ──────────────────────────────────────────────────────────

export type LeadFormType =
  | "audit_request"
  | "founder_chat"
  | "pricing_trial_request";

export interface LeadIntakePayload {
  form_type: LeadFormType;
  /** Provenance string. Format: `marketing:<form_type>@<surface>`. */
  source: string;

  full_name: string;
  work_email: string;
  company_name: string;
  phone?: string;
  website?: string;
  message?: string;

  /** Form-specific structured fields (plan, audience, client_count, etc.). */
  form_payload?: Record<string, unknown>;

  /** Hidden honeypot — should always be empty. */
  honeypot?: string;
}

export interface LeadIntakeResult {
  ok: boolean;
  /** Which endpoint actually accepted the submission (for logging). */
  via: "lead-intake" | "formspree";
  inquiry_id?: string;
  error?: string;
}

// ─── Configuration ──────────────────────────────────────────────────

const FORMSPREE_ENDPOINT = "https://formspree.io/f/xojnjoda";

function leadIntakeUrl(): string | null {
  const u = import.meta.env.VITE_LEAD_INTAKE_URL as string | undefined;
  return u && u.trim().length > 0 ? u : null;
}

function dualWriteEnabled(): boolean {
  return import.meta.env.VITE_LEAD_INTAKE_DUAL_WRITE === "1";
}

// ─── Internals ──────────────────────────────────────────────────────

/**
 * POST to the geo-platform lead-intake endpoint. Captures UTM/referrer
 * client-side and adds them to source_context. Returns ok=false on any
 * non-2xx so the caller can fall back to Formspree.
 */
async function postToLeadIntake(
  url: string,
  payload: LeadIntakePayload,
): Promise<LeadIntakeResult> {
  const sp =
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const source_context: Record<string, unknown> = {};
  if (sp) {
    for (const k of [
      "utm_source",
      "utm_medium",
      "utm_campaign",
      "utm_term",
      "utm_content",
    ]) {
      const v = sp.get(k);
      if (v) source_context[k] = v;
    }
  }
  if (typeof document !== "undefined" && document.referrer) {
    source_context.referrer = document.referrer;
  }
  if (typeof window !== "undefined") {
    source_context.page_url = window.location.href;
  }

  const body = {
    form_type: payload.form_type,
    source: payload.source,
    full_name: payload.full_name,
    work_email: payload.work_email,
    company_name: payload.company_name,
    phone: payload.phone ?? null,
    website: payload.website ?? null,
    message: payload.message ?? null,
    form_payload: payload.form_payload ?? {},
    source_context,
    honeypot: payload.honeypot ?? "",
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      // Don't send the (non-existent) cross-origin cookie — keeps CORS
      // simple ("Access-Control-Allow-Origin" without credentials).
      credentials: "omit",
    });
    const json = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      data?: { inquiry_id?: string };
      error?: { message?: string };
    };
    if (res.ok && json?.ok) {
      return {
        ok: true,
        via: "lead-intake",
        inquiry_id: json.data?.inquiry_id,
      };
    }
    return {
      ok: false,
      via: "lead-intake",
      error: json?.error?.message || `lead-intake HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      via: "lead-intake",
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

/**
 * Legacy Formspree submission. Keeps the original field names so the
 * existing Formspree inbox keeps working unchanged.
 */
async function postToFormspree(
  payload: LeadIntakePayload,
): Promise<LeadIntakeResult> {
  // Translate normalized field names back to the historical names that
  // Formspree's inbox is filtering / templating on.
  const body: Record<string, unknown> = {
    form_type: payload.form_type,
    source: payload.source,
    name: payload.full_name,
    email: payload.work_email,
    company: payload.company_name,
    phone: payload.phone,
    website: payload.website,
    message: payload.message,
    ...(payload.form_payload ?? {}),
  };

  try {
    const res = await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      return { ok: true, via: "formspree" };
    }
    return {
      ok: false,
      via: "formspree",
      error: `formspree HTTP ${res.status}`,
    };
  } catch (err) {
    return {
      ok: false,
      via: "formspree",
      error: err instanceof Error ? err.message : "network error",
    };
  }
}

// ─── Public API ─────────────────────────────────────────────────────

/**
 * Submit a lead. Routes to whichever pipeline is configured.
 *
 * Order of preference:
 *   1. lead-intake (if VITE_LEAD_INTAKE_URL set) — primary
 *      - dual-write to Formspree fire-and-forget when enabled
 *   2. Formspree (legacy / dev fallback / primary failure)
 *
 * Always returns a result. `ok: true` means *some* sink accepted the
 * submission. UI should toast success / failure based on `ok`.
 */
export async function submitLeadIntake(
  payload: LeadIntakePayload,
): Promise<LeadIntakeResult> {
  const url = leadIntakeUrl();
  if (url) {
    const primary = await postToLeadIntake(url, payload);
    if (primary.ok) {
      if (dualWriteEnabled()) {
        // Fire-and-forget — Formspree audit copy. Don't block the user.
        void postToFormspree(payload).catch(() => {});
      }
      return primary;
    }
    // Primary failed (deploy / outage). Fall back to Formspree so we
    // don't lose the lead.
    console.warn("[lead-intake] primary failed, falling back:", primary.error);
    return postToFormspree(payload);
  }
  return postToFormspree(payload);
}
