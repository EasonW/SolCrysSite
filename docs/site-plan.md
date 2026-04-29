# SolCrys AI SEO/AEO Site Plan

## Positioning

SolCrys AI is an Answer Engine Optimization platform for brands that need to measure and improve how they appear in AI-generated discovery journeys.

Primary message: win discovery when customers ask AI what to buy, trust, or compare.

## Architecture

- Vite/React remains the interactive application layer.
- `npm run build` runs Vite, then `scripts/prerender.mjs` writes static HTML for indexable pages.
- Static HTML is generated for crawlers and no-JavaScript agents; React still mounts for interactive users.
- Canonical URLs use `https://solcrys.com`.

## Published URLs

- `/` - product homepage
- `/about/` - company and founding team
- `/resources/` - AEO resource hub
- `/answer-engine-optimization/`
- `/aeo-vs-seo/`
- `/ai-brand-visibility-monitoring/`
- `/chatgpt-brand-mentions/`
- `/ai-search-share-of-voice/`
- `/ai-hallucination-risk-monitoring/`
- `/privacy.html`
- `/terms.html`

## SEO/AEO Outputs

- `sitemap.xml` lists all canonical URLs.
- `robots.txt` allows Google, Bing, OpenAI search, Perplexity, and Claude search/user crawlers, and declares the sitemap.
- `llms.txt` and `llms-full.txt` provide optional machine-readable summaries for AI agents that use the convention.
- JSON-LD is generated for Organization, WebSite, SoftwareApplication, CollectionPage, Article, BreadcrumbList, AboutPage, and FAQPage where relevant.

## Content Pattern

Each AEO resource page follows the same extractable pattern:

- Direct answer
- Definition and context
- Practical framework
- Tables or bullet lists where useful
- FAQ with visible answers
- Updated date
- Related guide links in the React page

## Measurement Priorities

- Google Search Console: indexing, Core Web Vitals, query coverage.
- Bing Webmaster Tools: AI Performance, cited pages, grounding queries.
- Prompt tracking: brand mention rate, citation rate, answer accuracy, sentiment, and competitor share of voice.
