/**
 * Where this visit came from, carried into app.solcrys.com.
 *
 * Rule: a visit's source is where it last arrived from outside. A visit
 * arrives from outside either with UTMs in the URL, or with an outside
 * referrer (stored as utm_source=<host without www.>, utm_medium=referral).
 * Either kind of arrival replaces what this tab has stored; navigation
 * within solcrys.com / *.solcrys.com, typed URLs and stripped referrers
 * leave it alone. Only the referrer's host is kept, never its path or
 * query.
 *
 * Same rule, sessionStorage key and value shape as the app's
 * `geo-platform/dashboard/lib/audit/utm.ts`, so the tab's source is the
 * same on both sites.
 *
 * Exits: every link into the app gets the stored UTMs at click time
 * (unless it already carries UTMs), and the lead-intake form reads them.
 */

import { AUDIT_URL } from "./audit-cta";
import { APP_PRICING_URL } from "./pricing-url";

const STORAGE_KEY = "solcrys_utm";

export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

type UtmKey = (typeof UTM_KEYS)[number];

export type StoredUtm = Record<UtmKey, string | null>;

const EMPTY_UTM: StoredUtm = {
  utm_source: null,
  utm_medium: null,
  utm_campaign: null,
  utm_term: null,
  utm_content: null,
};

function capValue(raw: string | null | undefined): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed ? trimmed.slice(0, 64) : null;
}

function hasAnyUtm(utm: StoredUtm): boolean {
  return UTM_KEYS.some((key) => utm[key] !== null);
}

function extractUtm(search: string): StoredUtm {
  const params = new URLSearchParams(search);
  const result: StoredUtm = { ...EMPTY_UTM };
  for (const key of UTM_KEYS) result[key] = capValue(params.get(key));
  return result;
}

/** The referring site as a source: its host without "www.", or null when
 *  there is none, it isn't an http(s) address (e.g. android-app://), or it
 *  is our own site. */
export function referrerSource(referrer: string, ownHost: string): string | null {
  let url: URL;
  try {
    url = new URL(referrer);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const host = url.hostname.toLowerCase().replace(/^www\./, "");
  if (!host || host === ownHost.toLowerCase() || /(^|\.)solcrys\.com$/.test(host)) {
    return null;
  }
  return host.slice(0, 64);
}

/** What this tab has stored, or null. Never throws. */
export function readAttribution(): StoredUtm | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<Record<UtmKey, unknown>>;
    const result: StoredUtm = { ...EMPTY_UTM };
    for (const key of UTM_KEYS) {
      const value = parsed?.[key];
      result[key] = typeof value === "string" ? capValue(value) : null;
    }
    return hasAnyUtm(result) ? result : null;
  } catch {
    return null;
  }
}

/** Record this page load's arrival, if it came from outside. */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  let utm = extractUtm(window.location.search);
  if (!hasAnyUtm(utm)) {
    const source = referrerSource(document.referrer, window.location.hostname);
    if (source) utm = { ...EMPTY_UTM, utm_source: source, utm_medium: "referral" };
  }
  if (!hasAnyUtm(utm)) return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(utm));
  } catch {
    // Storage blocked: links simply go out untagged.
  }
}

function appHosts(): Set<string> {
  const hosts = new Set(["app.solcrys.com"]);
  for (const url of [AUDIT_URL, APP_PRICING_URL]) {
    try {
      hosts.add(new URL(url).host);
    } catch {
      // A malformed override just isn't treated as the app.
    }
  }
  return hosts;
}

/** `url` with the stored UTMs added when it points into the app and
 *  carries no UTMs of its own (blank values don't count, as in
 *  captureAttribution); otherwise `url` unchanged. */
export function withAttribution(url: string): string {
  if (typeof window === "undefined") return url;
  let parsed: URL;
  try {
    parsed = new URL(url, window.location.href);
  } catch {
    return url;
  }
  if (!appHosts().has(parsed.host)) return url;
  if (UTM_KEYS.some((key) => capValue(parsed.searchParams.get(key)) !== null)) return url;
  const utm = readAttribution();
  if (!utm) return url;
  for (const key of UTM_KEYS) {
    parsed.searchParams.delete(key);
    const value = utm[key];
    if (value !== null) parsed.searchParams.set(key, value);
  }
  return parsed.toString();
}

/** Tag links into the app at the moment they are followed. Listens on
 *  window in the capture phase so the href is final before any document-
 *  level handler (e.g. the prerendered pricing-link theme handoff) reads
 *  it. Covers plain, modified and middle clicks. Right clicks also fire
 *  auxclick, but whether a context menu's "Copy link" sees the tagged
 *  href depends on the platform; dragged links, keyboard copies and
 *  clicks before this bundle has run are not tagged. */
export function installAttributionLinks(): void {
  if (typeof window === "undefined") return;
  const tag = (event: MouseEvent) => {
    const target = event.target as Element | null;
    const anchor = target?.closest?.("a[href]") as HTMLAnchorElement | null;
    if (!anchor) return;
    const tagged = withAttribution(anchor.href);
    if (tagged !== anchor.href) anchor.href = tagged;
  };
  window.addEventListener("click", tag, true);
  window.addEventListener("auxclick", tag, true);
}
