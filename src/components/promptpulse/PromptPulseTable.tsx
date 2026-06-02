import { useMemo, useState } from "react";
import {
  VerticalData,
  PromptRow,
  trendColor,
  trendArrow,
  stageColor,
  fmtDelta,
} from "@/lib/promptPulse";
import Sparkline from "./Sparkline";

type SortKey = "ppds" | "trend" | "prompt" | "persona" | "stage";

const NUMERIC: SortKey[] = ["ppds", "trend"];

const selectClass =
  "rounded-lg border border-border/40 bg-card/40 px-3 py-2 text-sm text-foreground focus:border-[hsl(195_90%_55%/0.6)] focus:outline-none";

const Chip = ({ label, color }: { label: string; color?: string }) => (
  <span
    className="inline-block whitespace-nowrap rounded-full border px-2.5 py-0.5 text-[11px] font-semibold"
    style={color ? { borderColor: color, color } : undefined}
  >
    {label}
  </span>
);

const PromptPulseTable = ({ vertical }: { vertical: VerticalData }) => {
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("");
  const [persona, setPersona] = useState("");
  const [intent, setIntent] = useState("");
  const [stage, setStage] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("ppds");
  const [sortDir, setSortDir] = useState(-1);

  const rows = useMemo(() => {
    const filtered = vertical.prompts.filter(
      (p) =>
        (!q || p.prompt.toLowerCase().includes(q.toLowerCase())) &&
        (!topic || p.topic === topic) &&
        (!persona || p.persona === persona) &&
        (!intent || p.intent === intent) &&
        (!stage || p.stage === stage),
    );
    const cmp = (a: PromptRow, b: PromptRow) => {
      if (sortKey === "ppds") return (a.ppds - b.ppds) * sortDir;
      if (sortKey === "trend")
        return ((a.trend.delta90 ?? -999) - (b.trend.delta90 ?? -999)) * sortDir;
      const av = String((a as unknown as Record<string, unknown>)[sortKey] ?? a.prompt);
      const bv = String((b as unknown as Record<string, unknown>)[sortKey] ?? b.prompt);
      return av.localeCompare(bv) * sortDir;
    };
    return [...filtered].sort(cmp);
  }, [vertical, q, topic, persona, intent, stage, sortKey, sortDir]);

  const onSort = (k: SortKey) => {
    if (k === sortKey) {
      setSortDir((d) => -d);
    } else {
      setSortKey(k);
      setSortDir(NUMERIC.includes(k) ? -1 : 1);
    }
  };

  const Th = ({ k, label, align }: { k: SortKey; label: string; align?: "right" }) => (
    <th
      onClick={() => onSort(k)}
      className={`cursor-pointer select-none whitespace-nowrap px-3 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground ${
        align === "right" ? "text-right" : "text-left"
      }`}
    >
      {label}
      {sortKey === k ? (sortDir === -1 ? " ↓" : " ↑") : ""}
    </th>
  );

  return (
    <div>
      {/* Controls */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search prompts…"
          className="min-w-[220px] flex-1 rounded-lg border border-border/40 bg-card/40 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-[hsl(195_90%_55%/0.6)] focus:outline-none"
        />
        <select className={selectClass} value={stage} onChange={(e) => setStage(e.target.value)}>
          <option value="">All buying stages</option>
          {vertical.categories.stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectClass} value={persona} onChange={(e) => setPersona(e.target.value)}>
          <option value="">All personas</option>
          {vertical.categories.personas.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectClass} value={topic} onChange={(e) => setTopic(e.target.value)}>
          <option value="">All topics</option>
          {vertical.categories.topics.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select className={selectClass} value={intent} onChange={(e) => setIntent(e.target.value)}>
          <option value="">All intents</option>
          {vertical.categories.intents.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <span className="ml-auto text-sm text-muted-foreground">
          showing {rows.length} of {vertical.prompts.length}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-border/30">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-card/60">
            <tr>
              <Th k="prompt" label="Prompt" />
              <Th k="ppds" label="Demand" />
              <Th k="trend" label="AI trend (12mo)" />
              <Th k="persona" label="Persona" />
              <Th k="stage" label="Buying stage" />
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => (
              <tr
                key={p.prompt}
                className="border-t border-border/30 hover:bg-[hsl(195_90%_55%/0.04)]"
              >
                <td className="max-w-[420px] px-3 py-3 align-middle">
                  <span className="font-medium text-foreground">{p.prompt}</span>
                  <span className="mt-1 block text-[11px] text-muted-foreground">
                    {p.topic} · {p.intent}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle">
                  <div className="relative h-[18px] w-[104px] overflow-hidden rounded-md bg-muted">
                    <div
                      className="absolute inset-y-0 left-0 rounded-md"
                      style={{
                        width: `${Math.max(p.ppds, 3)}%`,
                        background:
                          "linear-gradient(90deg, hsl(195 90% 55% / 0.45), hsl(195 90% 55%))",
                      }}
                    />
                    <span className="absolute right-1.5 top-0 text-[12px] font-semibold leading-[18px] text-foreground">
                      {p.ppds}
                    </span>
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 align-middle">
                  <Sparkline values={p.spark} color={trendColor(p.trend.label)} />{" "}
                  <span className="text-xs" style={{ color: trendColor(p.trend.label) }}>
                    {trendArrow(p.trend.label)} {fmtDelta(p.trend.delta90)}
                  </span>
                </td>
                <td className="px-3 py-3 align-middle">
                  <Chip label={p.persona} />
                </td>
                <td className="px-3 py-3 align-middle">
                  <Chip label={p.stage} color={stageColor(p.stage)} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromptPulseTable;
