declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export type AuditSurface = "hero" | "navbar" | "cta_section";

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  window.gtag?.("event", name, params);
}
