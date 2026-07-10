declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AuditSurface =
  | "hero"
  | "navbar"
  | "navbar_mobile"
  | "home_tracker_section"
  | "free_aeo_audit_lp"
  | "free_aeo_audit_lp_footer"
  | "free_tracker_lp"
  | "free_tracker_lp_footer"
  | "cta_section"
  | "about_cta"
  | "compare_cta"
  | "customers"
  | "customers-nextsilicon"
  | "pricing"
  | "pricing_card"
  | "pricing_cta_strip"
  | "pricing_enterprise"
  | "pricing_sticky_mobile"
  | "resources_mega"
  | "news_article"
  | "floating_contact"
  | "prompt_pulse_hub"
  | "prompt_pulse_vertical"
  | "prompt_pulse_about";

export type PricingAudience = "brand" | "agency";

// The $99 entry tier is keyed "growth" but displayed as "Starter"; the legacy
// $29 "brand_starter" tier was retired 2026-06-10.
export type PricingPlanKey =
  | "brand_growth"
  | "brand_pro"
  | "agency"
  | "agency_pro"
  | "enterprise";

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
