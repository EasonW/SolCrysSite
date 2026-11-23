# SolCrys.com

Marketing and resource site for [SolCrys](https://solcrys.com), built with React, TypeScript, Vite, Tailwind CSS, and a build-time static prerenderer.

## Requirements

- Node.js 20
- npm, using the committed `package-lock.json`

## Development

```sh
npm ci
npm run dev
```

The local site is served at `http://localhost:8080`.

## Validation

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

`npm run check` runs the complete sequence. The production build also:

- Generates homepage data, catalog summaries, search excerpts, and one lazy-loaded data module per resource from `siteContent.json`.
- Prerenders public routes into static HTML.
- Generates sitemap, RSS, and LLM-facing text files.
- Checks internal links, sitemap membership, canonical URLs, discoverability from the homepage, and page metadata.

## Content

Long-form resources are authored in `src/content/siteContent.json`. `npm run content:client` regenerates the homepage and search data and the ignored `src/content/generated-resources/` directory. Re-run it after editing resource content in a running development session. The software landing page uses `src/content/aeoPlatform.json`, and the task links at the top of the resource hub use `src/content/resourcePaths.json`.

For a meaningful update to a hand-built page, set its individual date in `site.pageUpdated` when the date is known. For content-driven pages, update the date in the source record. The prerenderer uses these dates for the page and sitemap.

Newsroom and Prompt Pulse data live in `src/content/newsroom.json` and `src/content/promptPulse.json`.

Product documentation lives at `/guides/`, separate from editorial AEO resources. `src/content/userGuides.json` drives the library, readers, search, and static metadata. PDFs, cover images, and numbered page previews live in `public/guides/`; `src/content/userGuideText.json` provides the page text for the crawlable static HTML; the reader itself shows page previews and links to the PDF. The build checks that every page preview and transcript exists.

See [the September 2026 guide review](docs/user-guide-review-2026-09-16.md) for content corrections and maintenance notes. `scripts/prepare-user-guides.py` prepares that specific edition of guides 01 and 02 from the original PDFs. To publish another guide, add it to `userGuides.json` (each guide carries its own `edition`, `updated`, `next` link, and `ogImage` at `/og/guides-<slug>.png`), then run `python3 scripts/add-user-guide.py <slug> /path/to/source.pdf` to write the PDF, cover, page previews, and page text, and `node scripts/og/render.mjs --only=guides-<slug> --force` to render its OG card. Both scripts need PyMuPDF locally; neither is required to build or deploy the website.

## Analytics and leads

GA4 and Microsoft Clarity are loaded only after analytics consent. The shared consent implementation is in `public/analytics-consent.js` and is used by both React and standalone legal pages.

Lead forms submit to the configured `VITE_LEAD_INTAKE_URL`. Formspree is retained only as an outage fallback; `VITE_LEAD_INTAKE_DUAL_WRITE=1` should be used only for an explicitly monitored migration window.

## Deployment

Pushes to `main` run typecheck, lint, tests, build/link validation, deploy `dist/` to GitHub Pages, and send a best-effort IndexNow notification. Production configuration is defined in `.github/workflows/deploy.yml`.
