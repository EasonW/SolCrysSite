/**
 * agent-facts.mjs — the key facts each page must give a reader that runs no
 * JavaScript, as listed in src/content/agentReadability.json.
 *
 * Shared by scripts/check-agent-readability.mjs (the static HTML in dist/) and
 * src/test/agentReadability.test.tsx (the React pages), so both copies are held
 * to the same list.
 */

// A plan's price as the app's pricing page writes it: "$99 / mo",
// "Starts at $2,000 / mo".
export function planPriceLabel(tier) {
  return `${tier.startsAt ? "Starts at " : ""}$${Number(tier.monthly).toLocaleString("en-US")} / mo`;
}

const SOURCES = {
  // Every founder's and advisor's bio, field by field.
  team: ({ team }) =>
    [...team.founders, ...team.advisors].flatMap((person) => [
      person.name,
      person.title,
      person.background,
      person.expertise,
    ]),
  // Every plan's name with its price, e.g. "Pro $399 / mo".
  pricing: ({ pricing }) =>
    pricing.audiences.flatMap((audience) =>
      audience.tiers.map((tier) => `${tier.name} ${planPriceLabel(tier)}`)
    ),
};

/** The facts one page entry of agentReadability.json asks for. */
export function pageFacts(page, data) {
  const fromData = (page.from || []).flatMap((source) => {
    if (!SOURCES[source]) throw new Error(`agentReadability.json: unknown source "${source}" on ${page.path}`);
    return SOURCES[source](data);
  });
  return [...new Set([...fromData, ...(page.facts || [])])];
}

/** Text with every run of whitespace collapsed to one space. */
export function normalizeText(text) {
  return String(text).replace(/\s+/g, " ").trim();
}
