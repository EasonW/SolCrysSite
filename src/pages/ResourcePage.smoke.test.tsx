import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import ResourcePage from "./ResourcePage";

// A published page whose body links to the in-app audit — the regression
// this guards is "resource pages render zero product CTAs after hydration".
const SLUG = "how-to-get-cited-by-chatgpt-2026";

describe("ResourcePage CTAs", () => {
  it("renders the end CTA and the inline hook", async () => {
    const { getAllByText, findByLabelText } = render(
      <MemoryRouter>
        <ResourcePage slug={SLUG} />
      </MemoryRouter>
    );
    expect(await findByLabelText("Free ChatGPT visibility check")).toBeTruthy();
    // Navbar + end card — at least two visible "Start Free" actions.
    expect(getAllByText("Start Free").length).toBeGreaterThanOrEqual(2);
  });

  it("keeps in-body links to app.solcrys.com in the same tab", async () => {
    const { container, findByRole } = render(
      <MemoryRouter>
        <ResourcePage slug={SLUG} />
      </MemoryRouter>
    );
    await findByRole("heading", { level: 1 });
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
  it("renders `code` spans as <code>, including inside bold runs", async () => {
    const { container, findByRole } = render(
      <MemoryRouter>
        <ResourcePage slug="best-aeo-tools-for-small-marketing-teams" />
      </MemoryRouter>
    );
    await findByRole("heading", { level: 1 });
    const codes = Array.from(container.querySelectorAll("article code")).map((el) => el.textContent);
    expect(codes).toContain("[YOUR CATEGORY]");
    expect(container.textContent).not.toContain("`[YOUR CATEGORY]`");
  });

  it("renders code nested in bold without literal backticks", async () => {
    const { container, findByRole } = render(
      <MemoryRouter>
        <ResourcePage slug="google-endorses-aeo-fundamentals" />
      </MemoryRouter>
    );
    await findByRole("heading", { level: 1 });
    const boldCode = container.querySelector("article strong code");
    expect(boldCode?.textContent).toBe("llms.txt");
    expect(container.textContent).not.toContain("`llms.txt`");
  });
});
