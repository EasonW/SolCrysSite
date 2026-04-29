# SolCrys AI SEO/AEO Site Plan

## Positioning

SolCrys AI is an AI search visibility and Answer Engine Optimization platform for marketing teams that need to monitor mentions, citations, competitors, share of voice, and answer accuracy across AI-generated discovery journeys.

Primary message: measure and improve how your brand appears in AI answers.

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
- JSON-LD is generated for Organization, WebSite, WebPage, SoftwareApplication, CollectionPage, Article, BreadcrumbList, AboutPage, and FAQPage where relevant.
- Homepage and About include visible maintainer and last-updated signals.
- Homepage source notes link to official crawler and AI search guidance.

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
