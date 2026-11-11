import type { ComponentType } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import AboutUs from "@/pages/AboutUs";
import Index from "@/pages/Index";
import agentReadability from "@/content/agentReadability.json";
import team from "@/content/team.json";
import pricing from "@/content/pricing.json";
import { normalizeText, pageFacts } from "../../scripts/agent-facts.mjs";

// The rendered half of the agent-readability self-check: every key fact that
// scripts/check-agent-readability.mjs requires in a page's static HTML must
// also be on the React page people see, so the two copies cannot drift apart.
const RENDERED: Record<string, ComponentType> = { AboutUs, Index };

const pages = agentReadability.pages.filter((page) => "rendered" in page && page.rendered);

describe("agent readability: the React pages carry the same key facts", () => {
  it("names a known React page for every rendered entry", () => {
    for (const page of pages) expect(RENDERED[page.rendered], page.path).toBeTruthy();
  });

  for (const page of pages) {
    it(`${page.path} (${page.rendered})`, () => {
      const Page = RENDERED[page.rendered];
      const { container } = render(
        <MemoryRouter initialEntries={[page.path]}>
          <Page />
        </MemoryRouter>
      );
      // Text nodes joined with spaces, as the static check reads them.
      const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
      const parts: string[] = [];
      while (walker.nextNode()) parts.push(walker.currentNode.textContent || "");
      const text = normalizeText(parts.join(" "));
      const missing = pageFacts(page, { team, pricing }).filter(
        (fact: string) => !text.includes(normalizeText(fact))
      );
      expect(missing).toEqual([]);
    });
  }
});
