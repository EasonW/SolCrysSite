import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AUDIT_URL } from "@/lib/audit-cta";
import { resolveResourceCta } from "@/lib/resource-cta";
import { ResourceEndCTA, ResourceInlineCTA } from "./ResourceCTA";

describe("ResourceCTA", () => {
  it("end card links Start Free to the in-app free workspace", () => {
    const { getByText } = render(<ResourceEndCTA category="AEO Fundamentals" />);
    const link = getByText("Start Free").closest("a");
    expect(link?.getAttribute("href")).toBe(AUDIT_URL);
    expect(link?.getAttribute("target")).toBeNull();
  });

  it("inline hook links to the same destination", () => {
    const { getByText } = render(<ResourceInlineCTA category="Retail AEO" />);
    const link = getByText("Run a free ChatGPT visibility check").closest("a");
    expect(link?.getAttribute("href")).toBe(AUDIT_URL);
  });

  it("category overrides merge over the default copy", () => {
    const retail = resolveResourceCta("Retail AEO");
    const fallback = resolveResourceCta("Nonexistent Category");
    expect(retail.heading).not.toBe(fallback.heading);
    expect(retail.footnote).toBe(fallback.footnote);
    expect(fallback.footnote).not.toMatch(/no sign-?up/i);
  });
});
