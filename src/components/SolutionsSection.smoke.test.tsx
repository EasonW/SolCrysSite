import { render } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SolutionsSection from "./SolutionsSection";

describe("SolutionsSection", () => {
  it("renders without throwing (regression: solution.color was undefined)", () => {
    const { getByText } = render(<SolutionsSection />);
    expect(getByText("SEO and Growth Teams")).toBeTruthy();
  });
});
