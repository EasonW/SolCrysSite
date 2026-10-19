import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ResourcePage from "./ResourcePage";

// A published page whose body links to the in-app audit — the regression
// this guards is "resource pages render zero product CTAs after hydration".
const SLUG = "how-to-get-cited-by-chatgpt-2026";

describe("ResourcePage CTAs", () => {
  it("renders the end CTA and the inline hook", () => {
    const { getAllByText, getByLabelText } = render(
      <MemoryRouter>
        <ResourcePage slug={SLUG} />
      </MemoryRouter>
    );
    // Navbar + end card — at least two visible "Start Free" actions.
    expect(getAllByText("Start Free").length).toBeGreaterThanOrEqual(2);
    expect(getByLabelText("Free ChatGPT visibility check")).toBeTruthy();
  });

  it("keeps in-body links to app.solcrys.com in the same tab", () => {
    const { container } = render(
      <MemoryRouter>
        <ResourcePage slug={SLUG} />
      </MemoryRouter>
    );
    const appLinks = Array.from(
      container.querySelectorAll<HTMLAnchorElement>('article a[href^="https://app.solcrys.com/"]')
    );
    expect(appLinks.length).toBeGreaterThan(0);
    for (const link of appLinks) {
      expect(link.getAttribute("target")).toBeNull();
    }
  });
});

describe("ResourcePage inline code", () => {
  it("renders `code` spans as <code>, including inside bold runs", () => {
    const { container } = render(
      <MemoryRouter>
        <ResourcePage slug="best-aeo-tools-for-small-marketing-teams" />
      </MemoryRouter>
    );
    const codes = Array.from(container.querySelectorAll("article code")).map((el) => el.textContent);
    expect(codes).toContain("[YOUR CATEGORY]");
    expect(container.textContent).not.toContain("`[YOUR CATEGORY]`");
  });

  it("renders code nested in bold without literal backticks", () => {
    const { container } = render(
      <MemoryRouter>
        <ResourcePage slug="google-endorses-aeo-fundamentals" />
      </MemoryRouter>
    );
    const boldCode = container.querySelector("article strong code");
    expect(boldCode?.textContent).toBe("llms.txt");
    expect(container.textContent).not.toContain("`llms.txt`");
  });
});
