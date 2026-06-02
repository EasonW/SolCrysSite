// Prompt Pulse — typed access to the scrubbed public dataset.
//
// The JSON is generated from internal snapshots by
// GEOResearch/08_prompt_pulse/builder/make_public.py and contains ONLY the
// public-safe view: prompt text, relative Demand Score, trend label + delta%,
// topic/intent/persona/stage tags, and a 0..1 normalized sparkline. No data
// sources, formulas, or absolute volumes (proprietary — see methodology §8).
import data from "@/content/promptPulse.json";

export type PromptTrend = { label: string; delta90: number | null };

export type PromptRow = {
  prompt: string;
  topic: string;
  intent: string;
  persona: string;
  stage: string;
  ppds: number;
  trend: PromptTrend;
  spark: number[];
};

export type VerticalData = {
  vertical: string;
  slug: string;
  short: string;
  label: string;
  blurb: string;
  updated: string;
  stats: { prompts: number; rising: number; cooling: number; decision: number };
  categories: { topics: string[]; intents: string[]; personas: string[]; stages: string[] };
  prompts: PromptRow[];
};

export type PromptPulseData = { updated: string; note: string; verticals: VerticalData[] };

export const promptPulse = data as PromptPulseData;
export const verticals = promptPulse.verticals;
export const getVertical = (slug?: string): VerticalData | undefined =>
  verticals.find((v) => v.slug === slug);

// Accent colors pulled from the site's design tokens (cyan / gold).
export const ACCENT = "hsl(195 90% 55%)";
export const GOLD = "hsl(40 85% 55%)";

export const trendColor = (label: string): string =>
  label === "Rising"
    ? "hsl(142 70% 45%)"
    : label === "Cooling"
      ? "hsl(18 85% 58%)"
      : "hsl(0 0% 55%)";

export const trendArrow = (label: string): string =>
  label === "Rising" ? "▲" : label === "Cooling" ? "▼" : label === "Stable" ? "▪" : "·";

export const stageColor = (s: string): string =>
  s === "Decision"
    ? GOLD
    : s === "Consideration"
      ? ACCENT
      : s === "Support"
        ? "hsl(142 60% 45%)"
        : "hsl(215 60% 62%)";

export const fmtDelta = (d: number | null): string =>
  d == null ? "" : `${d > 0 ? "+" : ""}${Math.round(d)}%`;

/** One-line, data-driven summary for a vertical page hero. */
export function verticalTldr(v: VerticalData): string {
  const ps = v.prompts;
  if (!ps.length) return "";
  const top = ps[0].prompt;
  const risers = ps
    .filter((p) => p.trend.label === "Rising" && p.trend.delta90 != null)
    .sort((a, b) => (b.trend.delta90 as number) - (a.trend.delta90 as number))
    .slice(0, 2);
  const parts = [`The single highest-demand question is “${top}”.`];
  if (risers.length) {
    parts.push(
      `Heating up: ${risers
        .map((p) => `“${p.prompt}” (${fmtDelta(p.trend.delta90)})`)
        .join(", ")}.`,
    );
  }
  parts.push(`${v.stats.decision} are purchase-ready (decision-stage) prompts.`);
  return parts.join(" ");
}

/** Flatten all verticals' rising prompts for the cross-vertical hub leaderboard.
 *  Ranked by trend delta (comparable across verticals — PPDS is not). */
export function risingAcrossVerticals(limit = 12) {
  const all = verticals.flatMap((v) =>
    v.prompts
      .filter((p) => p.trend.label === "Rising" && p.trend.delta90 != null)
      .map((p) => ({ ...p, vShort: v.short, vSlug: v.slug })),
  );
  return all.sort((a, b) => (b.trend.delta90 as number) - (a.trend.delta90 as number)).slice(0, limit);
}
