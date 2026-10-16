import { render } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import siteContent from "@/content/siteContent.json";
import CompareResourcePage from "./CompareResourcePage";

const nested = siteContent.resourcePages.filter((page) => page.slug.includes("/"));

describe("nested resource page routes", () => {
  it("only nests resource slugs under compare/", () => {
    // Any other nested slug has no app route and would render NotFound.
    expect(nested.length).toBeGreaterThan(0);
    for (const page of nested) {
      expect(page.slug).toMatch(/^compare\/[^/]+$/);
    }
  });

  it.each(nested.map((page) => [page.slug, page.h1]))("renders /%s/", (slug, h1) => {
    const { getByRole, queryByText } = render(
      <MemoryRouter initialEntries={[`/${slug}/`]}>
        <Routes>
          <Route path="/compare/:compareSlug" element={<CompareResourcePage />} />
        </Routes>
      </MemoryRouter>
    );
    expect(getByRole("heading", { level: 1 }).textContent).toBe(h1);
    expect(queryByText(/page not found/i)).toBeNull();
  });
});
