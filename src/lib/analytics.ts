declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AuditSurface =
  | "hero"
  | "navbar"
  | "cta_section"
  | "pricing"
  | "pricing_card"
  | "pricing_cta_strip"
  | "pricing_enterprise"
  | "pricing_sticky_mobile";

export type PricingAudience = "brand" | "agency";

export type PricingPlanKey =
  | "brand_starter"
  | "brand_growth"
  | "brand_pro"
  | "agency"
  | "agency_pro"
  | "enterprise";

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
