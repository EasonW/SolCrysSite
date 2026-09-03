import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Navbar from "./Navbar";

describe("Navbar", () => {
  it("shows the header Start Free at every width (no hidden-below-sm class)", () => {
    const { getAllByText } = render(<Navbar />);
    const header = getAllByText("Start Free")[0].closest("a");
    expect(header).toBeTruthy();
    expect(header?.className).not.toMatch(/(^|\s)hidden(\s|$)/);
  });
});
