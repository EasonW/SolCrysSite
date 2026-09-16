# SolCrys user-guide content review

Reviewed the two supplied September 2026 PDFs (22 pages total) against app source at `SolCrysAI/news-podcast-app`, commit `c128e38db`, fetched on September 16, 2026. This is a source and document review; it does not certify which feature flags or permissions are enabled in a particular live organization.

## Publication decision

Ready to publish with three corrections applied to the website copies. Original files in Downloads are unchanged. The two-guide structure is useful: setup and first measurement, followed by interpreting evidence and managing improvement work.

## Corrections applied

| Location | Finding | Published correction | Evidence |
| --- | --- | --- | --- |
| AEO Dashboards and Tools, p. 2 | “50% means one in two responses” treats a weighted metric as a pooled response count. | “Average mention rate across runs, weighted by the configured engine mix. A 50% rate does not necessarily mean half of all raw responses.” | `geo-platform/dashboard/components/trends/KeyMetricsBar.tsx`, Overall Mention tooltip. |
| Workspace Setup, p. 10, step 2 | Custom access description omits the organization-admin exception. | Custom access limits other members to the list; organization admins retain access to every workspace. | `geo-platform/dashboard/app/api/t/[tenantId]/workspaces/route.ts`, membership authorization; `lib/authz/workspace.ts`. |
| Workspace Setup, p. 10, step 3 | Wording can make “Done” sound like a save action. | “Changes apply immediately. Done only closes the editor.” | `geo-platform/dashboard/components/WorkspaceMembersSection.tsx`, add/remove requests versus `setExpanded(false)`. |

## Substantive checks

- **Create and clone:** organization-admin requirements match the workspace and clone API guards. The clone helper copies configuration, resets access to default, disables scheduling, and excludes measurement history and connector credentials.
- **Section saves:** brand identity, engine mix, market, discovery, location, and schedule labels match the current settings components. Market/location changes affect future measurement; saving is distinct from running.
- **Prompt setup:** suggestion, manual addition, CSV import (2 MB limit), and replacement guidance align with the current prompt controls.
- **Scheduling:** daily at 06:00 UTC and Mondays at 06:00 UTC match `ManagePanel.tsx`. The guide correctly distinguishes UTC from the reader's local time.
- **Reference material and accuracy:** the guide distinguishes reference material, evaluated prompts, immediate toggles, expected claims, and explicitly saved grounding. It accommodates the legacy General card.
- **Visibility:** citation denominators and the distinction between ranking and percentages are correct. Corrected the weighted mention explanation noted above.
- **Recommendation:** interpreting recommendation when mentioned separately from visibility matches the quadrant. The current page also has an AEO Score, which is outside this introductory guide's scope.
- **Citations and exports:** owned versus brand-mention citation metrics, source inspection, and filter-scoped report export are explained without equating citations to traffic or backlinks.
- **Signals and Actions:** source review, current-week scans, role-dependent editing, publishing an already-live URL, and the Approved/Complete distinctions match the source. The guide correctly says that adding an action does not publish content or guarantee an improvement.
- **Presentation:** inspected every page in rendered contact sheets, then the two corrected pages at higher resolution. No clipped content or overlapping elements found. Fictional examples are disclosed on the first page of both guides.

## Reading improvements included

- Preserved the 12- and 10-page structures and chapter bookmarks.
- Added clickable page references on the PDF overview pages and links to the companion guide.
- Set the PDF language to English.
- Added a website library with page-by-page previews, chapter navigation, selectable page text, direct downloads, and links from Resources, site search, and the footer.
- Added crawlable HTML, canonical URLs, document metadata, sitemap entries, and links in `llms.txt`.

## Suggestions for the next edition

- Add a small role matrix for viewers, editors, workspace admins, and organization admins. Existing plan/role caveats are useful but spread across several pages.
- Explain the additional AEO Score on the Recommendation page if the guide expands beyond its core quadrant workflow.
- Consolidate the repeated weekly-review checklist on pages 9 and 10 into a single printable checklist.
- Regenerate the source documents as tagged PDFs with screenshot descriptions for stronger assistive-technology support. The current PDFs are untagged; the website text view covers the document prose but does not transcribe every screenshot.

## Maintenance

Publication checks passed: TypeScript, lint, all 8 existing tests, and the production build. The internal-link gate checked 206 pages and 7,034 links with zero broken targets. Browser checks covered both readers, all 22 previews, downloads, chapter/page navigation, invalid and boundary page parameters, deep links, reload, search, mobile navigation, and light/dark layouts at 320, 390, and 1440 pixels. No browser errors were observed. The 20 PDF pages outside the two corrected pages render identically to their originals.

Guide metadata lives in `src/content/userGuides.json`. Published PDFs and page previews live under `public/guides/`. Page text is generated in `src/content/userGuideText.json`.

The edition-specific preparation script records the exact corrections and refuses to apply them if the source passages or page counts differ. It requires PyMuPDF, Poppler (`pdftoppm`), and Arial. Use the original September PDFs as inputs; do not run it against already prepared files. For a later edition, review the new source and update the preparation workflow first.
