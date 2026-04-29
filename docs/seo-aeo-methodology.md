# SEO/AEO Methodology for SolCrys AI

Last updated: 2026-04-29

This document records the research basis, diagnosis framework, and refactor methodology used to make the SolCrys AI site more SEO and AEO friendly. It should be used as the operating playbook for future site changes, content expansion, and technical validation.

## 1. Goal

The goal is not just to rank pages in traditional search results. The site should be easy for search engines and AI answer engines to:

- Discover and crawl.
- Render without relying on client-side JavaScript.
- Identify the company, product category, audience, and use cases.
- Extract direct answers, definitions, comparisons, FAQs, and evidence.
- Cite canonical URLs instead of ambiguous or fallback routes.
- Revisit when content changes.

For SolCrys AI, this means the site must support both SEO and AEO:

- SEO: help Google, Bing, and other search engines crawl, index, understand, and rank the site.
- AEO: help answer engines such as ChatGPT Search, Google AI experiences, Perplexity, Gemini, Copilot, and Claude-powered retrieval systems use SolCrys pages as accurate source material in generated answers.

## 2. Research Conclusions

### 2.1 SEO fundamentals still anchor AEO

AI answer engines still depend heavily on crawlable, indexable, authoritative web content. Strong AEO does not replace technical SEO; it adds answer-level structure and measurement on top of it.

Practical implication:

- Publish real HTML for every important URL.
- Use descriptive, stable URLs.
- Keep canonical tags, sitemap entries, and internal links aligned.
- Make visible page content match structured data.
- Avoid thin or duplicated pages created only to target search phrases.

### 2.2 Client-rendered app shells are weak source material

The previous site depended on a Vite/React client app with an initially empty root. Google can render JavaScript, but rendering creates delay and other crawlers or AI retrieval systems may not execute JavaScript reliably.

Practical implication:

- Keep React for interactivity.
- Generate static HTML during build for indexable pages.
- Put the same visible content, metadata, and JSON-LD into the prerendered HTML.

### 2.3 AEO optimizes answer passages, not only pages

Answer engines retrieve and synthesize passages. A page is more useful when the core answer is explicit, early, and supported by structured sections.

Practical implication:

- Start important pages with a direct answer.
- Use clear H1/H2 hierarchy.
- Include definitions, comparison tables, frameworks, FAQs, and updated dates.
- Use language that matches buyer prompts, not only branded language.
- Make claims concrete and verifiable.

### 2.4 Crawler permissions should separate search inclusion from model training

Modern AI platforms expose different crawlers for search, user-triggered retrieval, and training. For example, OpenAI documents `OAI-SearchBot` for ChatGPT search inclusion and `GPTBot` for training-related crawling. These should be treated as separate policy choices.

Practical implication:

- Allow search/retrieval crawlers that can generate qualified discovery traffic.
- Decide separately whether to allow training crawlers.
- Keep `robots.txt` explicit and version-controlled.

### 2.5 `llms.txt` is useful but not a guaranteed ranking signal

`llms.txt` is an informal proposal for a Markdown file that gives LLMs a clean map of important site content. It is low-cost and useful as an owned machine-readable summary, but there is no public guarantee that major answer engines consistently use it as a ranking or citation signal.

Practical implication:

- Publish `llms.txt` and `llms-full.txt` as helpful, optional source maps.
- Do not treat them as replacements for crawlable HTML, sitemap, internal links, or structured data.

## 3. Diagnosis Framework

Use this checklist before major site or content changes.

### 3.1 Discoverability

- Does every important page have a stable canonical URL?
- Is it linked from navigation, footer, resource hub, or related guides?
- Is it included in `sitemap.xml`?
- Is it allowed by `robots.txt`?

### 3.2 Renderability

- Does the initial HTML contain the actual H1, body text, links, and FAQ answers?
- Does the page still communicate the core answer with JavaScript disabled?
- Are CSS and JS assets crawlable?
- Does the page return the right HTTP-like state in static hosting, especially for 404s?

### 3.3 Metadata

- Does every indexable page have a unique `<title>` and meta description?
- Does each page have one canonical URL?
- Are Open Graph and Twitter images available and crawlable?
- Are favicon and logo assets valid?

### 3.4 Structured Data

- Does the page use the most specific relevant schema type?
- Does JSON-LD describe visible page content?
- Are Organization, WebSite, SoftwareApplication, Article, CollectionPage, FAQPage, AboutPage, and BreadcrumbList used where relevant?
- Can the JSON-LD be parsed by validation tools?

### 3.5 Answer Readiness

- Is there a direct answer near the top?
- Are definitions and comparisons written plainly?
- Are FAQs visible in HTML, not hidden only in client state?
- Are important claims supported by page context?
- Does the page reduce ambiguity around SolCrys AI's category, audience, and use cases?

### 3.6 Measurement

- Are Search Console and Bing Webmaster Tools able to see submitted URLs?
- Is there a fixed prompt set for AI visibility testing?
- Are answer-engine referrals tracked separately where possible?
- Are content updates tied to measurable changes in mentions, citations, and accuracy?

## 4. Refactor Methodology

### 4.1 Create a canonical content model

Keep SEO/AEO-critical text in `src/content/siteContent.json` instead of scattering it across components. This gives the site one source of truth for:

- Site identity and canonical domain.
- Homepage answer blocks and FAQs.
- Resource page slugs, metadata, summaries, sections, tables, and FAQs.
- Updated dates.

Benefits:

- React pages and prerendered HTML can share the same content.
- Sitemap, `llms.txt`, and JSON-LD can be generated consistently.
- Future content additions require less duplicated editing.

### 4.2 Generate static HTML after the Vite build

Use `scripts/prerender.mjs` after `vite build` to write indexable HTML into `dist/`.

Generated outputs:

- `/`
- `/about/`
- `/resources/`
- Topic pages such as `/answer-engine-optimization/` and `/aeo-vs-seo/`
- `404.html`
- `sitemap.xml`
- `llms.txt`
- `llms-full.txt`

The prerendered HTML should include:

- Full visible content.
- Canonical and robots metadata.
- Open Graph and Twitter metadata.
- JSON-LD.
- Links to the built CSS and JS assets so React can hydrate for interactive users.

### 4.3 Build a topic cluster instead of isolated pages

The resource architecture should be organized around high-intent AEO problems:

- AEO fundamentals.
- AEO vs SEO comparison.
- AI brand visibility monitoring.
- ChatGPT brand mentions.
- AI search share of voice.
- AI hallucination risk monitoring.

Each page should answer one clear intent and link to adjacent guides. This gives crawlers and users a clearer topical map than a single-page marketing site.

### 4.4 Use an answer-first page pattern

Recommended page structure:

1. Metadata: unique title, description, canonical URL, updated date.
2. H1: specific and literal.
3. Summary: one compact statement of the page's value.
4. Direct answer: one or two paragraphs that can stand alone.
5. Framework: steps, criteria, or comparison tables.
6. FAQ: visible question-answer pairs.
7. Related guides: internal links to the topic cluster.
8. CTA: relevant next step, not an intrusive interruption.

This pattern helps both search snippets and AI answer extraction.

### 4.5 Keep crawler controls explicit

`public/robots.txt` should:

- Allow mainstream search crawlers.
- Allow AI search/retrieval crawlers the site wants to appear in.
- Declare the canonical sitemap.
- Avoid blocking CSS, JavaScript, images, or static content needed for rendering.

If the company later chooses to block training crawlers, do it explicitly and separately from search crawlers.

### 4.6 Treat `llms.txt` as a controlled source map

Generate `llms.txt` and `llms-full.txt` from the same content model.

Use them to summarize:

- What SolCrys AI is.
- Which pages are authoritative.
- What each page answers.
- Which URLs should be cited for specific topics.

Do not rely on these files alone. They support AEO hygiene but are not a substitute for indexable pages.

## 5. Validation Process

Run this sequence before publishing structural SEO/AEO changes.

### 5.1 Local build checks

```bash
npm run build
npm test
npm run lint
```

Expected result:

- Build completes and prerenders all intended pages.
- Unit tests pass.
- Lint has no material errors.

### 5.2 Static output checks

Check that generated files exist:

```bash
find dist -maxdepth 2 -type f | sort
```

Verify key URLs in preview or deployed hosting:

```bash
curl -I https://solcrys.com/
curl -I https://solcrys.com/resources/
curl -I https://solcrys.com/answer-engine-optimization/
curl -I https://solcrys.com/sitemap.xml
curl -I https://solcrys.com/llms.txt
```

For local preview, use the local preview host instead of the production domain.

### 5.3 HTML inspection

For each important URL, inspect the returned HTML and confirm:

- The H1 appears in raw HTML.
- The direct answer appears in raw HTML.
- Canonical URL is correct.
- JSON-LD is present and valid JSON.
- Internal links use canonical trailing-slash routes.
- No page depends on GitHub Pages SPA fallback for indexable content.

### 5.4 External validation

After deployment:

- Submit or inspect URLs in Google Search Console.
- Submit sitemap in Google Search Console and Bing Webmaster Tools.
- Test structured data with Google's Rich Results Test where applicable.
- Use URL Inspection to confirm Google sees the same content users see.
- Monitor crawl errors and indexing status.

## 6. Measurement Methodology

### 6.1 SEO metrics

Track weekly:

- Indexed pages.
- Impressions by query group.
- Clicks and CTR.
- Average position for AEO-related terms.
- Sitemap discovery and crawl errors.
- Core Web Vitals and page experience.

### 6.2 AEO metrics

Build a fixed prompt set and run it on a schedule.

Prompt groups:

- Category prompts: "best answer engine optimization platform".
- Problem prompts: "how to monitor ChatGPT brand mentions".
- Comparison prompts: "AEO vs SEO".
- Competitor prompts: "alternatives to [competitor]".
- Risk prompts: "how to detect AI hallucinations about a brand".
- Branded prompts: "what is SolCrys AI".

Score each answer:

- Mention rate: whether SolCrys appears.
- Citation rate: whether SolCrys pages are cited.
- Source ownership: whether cited sources are SolCrys-owned or third-party.
- Position: how SolCrys is ordered relative to competitors.
- Accuracy: whether features, claims, and category are correct.
- Sentiment: positive, neutral, negative, or mixed.
- Hallucination risk: unsupported or incorrect statements.
- Share of voice: SolCrys mentions versus competitor mentions.

### 6.3 Action loop

Use this loop for content iteration:

1. Measure prompts.
2. Identify missing, wrong, or uncited answers.
3. Map each gap to a specific page or section.
4. Publish or update crawlable content.
5. Regenerate sitemap and LLM source maps.
6. Submit or request recrawl where useful.
7. Re-measure after crawl/index latency.

## 7. Content Quality Rules

Use these rules for every new page:

- Answer the user's question before explaining the product.
- Use specific nouns instead of vague marketing claims.
- Make the entity relationship clear: SolCrys AI, AEO platform, brand visibility, AI answer engines.
- Put comparisons in tables when users need tradeoff clarity.
- Put operational steps in ordered lists.
- Keep FAQs concise and directly answerable.
- Avoid generating many near-duplicate pages for keyword variants.
- Keep updated dates accurate.
- Keep schema aligned with visible content.

## 8. Current Implementation Map

The current refactor implements this methodology with:

- `src/content/siteContent.json`: canonical content model.
- `scripts/prerender.mjs`: static HTML, sitemap, and LLM summary generation.
- `src/pages/Resources.tsx`: resource hub.
- `src/pages/ResourcePage.tsx`: reusable topic page renderer.
- `public/robots.txt`: crawler and sitemap directives.
- `docs/site-plan.md`: concise current-site architecture summary.

`docs/seo-aeo-methodology.md` should be updated when the operating model changes, not for every minor copy edit.

## 9. Risks and Constraints

- SEO and AEO changes do not guarantee ranking, indexing, or citation.
- Search engines and answer engines may take days to months to reflect changes.
- AI answer systems are opaque and may use third-party indexes.
- `llms.txt` is an emerging convention, not a universally enforced protocol.
- Structured data can improve understanding but must not describe hidden or misleading content.
- Over-optimizing for prompts can create thin pages; useful content remains the constraint.

## 10. Reference Sources

- Google Search Central, SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google Search Central, JavaScript SEO basics: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- Google Search Central, Dynamic rendering guidance: https://developers.google.com/search/docs/crawling-indexing/javascript/dynamic-rendering
- Google Search Central, Structured data guidelines: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Google Search Central, Canonical URLs: https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- Google Search Central, Sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Central, AI features and website controls: https://developers.google.com/search/docs/appearance/ai-features
- OpenAI crawler documentation: https://platform.openai.com/docs/bots
- OpenAI publisher/developer FAQ: https://help.openai.com/en/articles/12627856-publishers-and-developers-faq
- Perplexity crawler documentation: https://docs.perplexity.ai/guides/bots
- Bing IndexNow documentation: https://www.bing.com/indexnow/IndexNowView/IndexNowGetStartedView
- `llms.txt` proposal: https://llmstxt.org/
