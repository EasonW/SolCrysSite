# SolCrys AI SEO/AEO 全面调研与优化策略

文档日期：2026-05-02
适用范围：solcrys.com（生产域名）
关联文档：[site-plan.md](site-plan.md) · [seo-aeo-methodology.md](seo-aeo-methodology.md)

本文档把"现状审计 + 2026 年最新行业研究 + 证据强度评估 + 优先级路线图"整合到一份可执行的策略文件，作为 SolCrys 后续 SEO/AEO/GEO 工作的统一参考。

---

## 0. Executive Summary

1. **技术地基已经做得非常扎实**：静态预渲染、JSON-LD、topic cluster、llms.txt、robots.txt、Bing 验证、方法论文档都到位。同类型早期 SaaS 站点里属于头部水平。继续这个方向，**不需要重写**。
2. **真正的瓶颈不在站内技术，而在三件事**：
   - 品牌**实体在站外不存在**（Wikidata、YouTube、Reddit、G2 几乎为零）
   - 没有**可被 LLM 引用的"原创数据 / 工具"型资产**（这是 AEO 类目排名第一的可链接资产）
   - 没有**竞品对比页**（ChatGPT 在对比类查询的引用率最高）
3. **2026 年最重要的硬数据**：Ahrefs 对 75,000 个品牌的相关性研究里，**YouTube mention 与品牌出现在 AI 答案里的相关性是 0.737，而 Domain Rating 只有 0.27**。这个差距 3 倍 —— 传统 SEO 工作量再大也不如建一个 YouTube 频道。
4. **Google AI Overviews 已覆盖 48–50% 的 Google 搜索**，触发后传统 CTR 从 1.76% 跌到 0.61%（–61%）。被 AIO 引用的页面付费点击 +91%、自然点击 +35%。
5. **llms.txt 没有任何主流 LLM 公开承认在用**（Google John Mueller 2026 年 4 月明确否认）；保留现状，**不要再投入更多时间**。

**最高 ROI 的三件事，按顺序做**：
1. 建 Wikidata 实体（公司 + 三位创始人）—— 半天工作量，长期 LLM grounding 最强单一信号。
2. 上线"Free AEO Audit"工具 —— 类目 #1 GTM 套路（HubSpot AEO Grader / Ahrefs Brand Radar / Otterly 全部在用）。
3. 发布"State of AI Search Visibility 2026"原创数据报告 —— 类目 #1 link magnet。

---

## 0.5 实施进度（2026-05-02 更新）

### 已实施（P0 第一波）

| 项目 | 状态 | 涉及文件 |
|---|---|---|
| Sitemap 删 `<priority>` / `<changefreq>` | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| Sitemap `lastmod` 改用每页真实 `updated` 字段 | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| OG image 拆分基础设施（per-page `ogImage` 字段、不再带 hash 路径） | ✅ | [siteContent.json](../src/content/siteContent.json) + [prerender.mjs](../scripts/prerender.mjs) |
| 静态 home 加 `id="aeo"` / `id="approach"` / `id="features"` 锚点 | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| 静态 nav 加上 `Our Approach` 链接（与 React Navbar 对齐） | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| SoftwareApplication schema 扩展（applicationSubCategory / featureList / screenshot / audience / softwareVersion / publisher.logo） | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| 新增 Service schema（首页） | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| Organization `sameAs` 改成数组（为 Wikidata / Crunchbase 留位） | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| Person schema 加 `worksFor`（指向 SolCrys） | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| `og:site_name` / `og:locale` / `apple-touch-icon` | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| `<meta name="date">` 用每页真实 `updated` | ✅ | [scripts/prerender.mjs](../scripts/prerender.mjs) |
| robots.txt 扩展到 2026 全量 AI 爬虫名单（13 个新增） | ✅ | [public/robots.txt](../public/robots.txt) |
| IndexNow ping 脚本 + npm `postdeploy` 自动钩子 | ✅ | [scripts/ping-indexnow.mjs](../scripts/ping-indexnow.mjs) + [package.json](../package.json) |
| 构建 / 测试 / lint 全部通过 | ✅ | `npm run build` / `npm test` / `npm run lint` |

### 待用户操作才能激活

| 项目 | 状态 | 阻塞原因 |
|---|---|---|
| per-page OG 图片**生效** | ⏳ 等图片 | 脚本逻辑就绪，需要在 `public/og/` 放 7 张 1200×630 PNG（home + 6 cluster）；没图自动 fallback 到 `solcrys-og-card.png` |
| IndexNow **真正发包** | ⏳ 等 key | 需要 `openssl rand -hex 16` 生成 key，放 `public/<key>.txt`，部署环境设 `INDEXNOW_KEY` env var |
| Founder schema `alumniOf` / 历史 `worksFor` | ⏳ 等数据 | 不能编造；需要三位创始人的真实过往雇主 + 学校 + 一句 highlight。Jia 当前 description 已含 ex-Microsoft，可先单独补 |
| Founder description 文案修复（[seo-aeo-methodology.md §4.7](seo-aeo-methodology.md) 违规） | ⏳ 等数据 | 同上。Gwen 的 "AI search & GTM strategy" 仍是漂浮 tagline |
| Organization `sameAs` 加 Wikidata Q-number / Crunchbase | ⏳ 等实体 | 需要先完成 P1-1 Wikidata 实体建立 |
| `SoftwareApplication.offers` / `aggregateRating` | ⏳ 不做 | 没有真实定价 / 真实 G2 评分；**禁止造假**，否则全域处罚风险 |

### 仍是 P0 但**未实施**（保留在 backlog）

无 —— P0 全部站内技术修补已落地或已就位。

### 验证记录

```
$ npm run build
✓ built in 938ms
Prerendered 10 static HTML pages, sitemap.xml, llms.txt, and llms-full.txt.

$ npm test
Test Files  1 passed (1)
Tests       1 passed (1)

$ npm run lint
(0 errors)

$ node scripts/ping-indexnow.mjs
[indexnow] INDEXNOW_KEY not set; skipping ping. (no-op as designed)
```

抽查产物：
- `dist/sitemap.xml` —— 11 个 URL，无 `<priority>` / `<changefreq>`，仅 `<loc>` + `<lastmod>`
- `dist/index.html` —— 含 `id="aeo"` / `id="approach"` / `id="features"`、新 SoftwareApplication 字段、Service schema、`og:site_name` / `og:locale`、`apple-touch-icon`
- `dist/indexnow-urls.json` —— canonical URL 列表，供 IndexNow 脚本消费

---

## 1. 现状审计

### 1.1 站点架构

技术栈：Vite + React + shadcn-ui + Tailwind + 自研 prerender。详见 [site-plan.md](site-plan.md)。

已发布 URL（11 个）：
- `/`
- `/about/`
- `/resources/`
- `/answer-engine-optimization/`
- `/aeo-vs-seo/`
- `/ai-brand-visibility-monitoring/`
- `/chatgpt-brand-mentions/`
- `/ai-search-share-of-voice/`
- `/ai-hallucination-risk-monitoring/`
- `/privacy.html`
- `/terms.html`

### 1.2 已经做对的事（保持，不要动）

| 维度 | 现状 | 评估 |
|---|---|---|
| 静态预渲染 [scripts/prerender.mjs](../scripts/prerender.mjs) | 6 cluster 页 + Home/About/Resources 全部输出真 HTML，FAQ/表格/H2 都在初始 HTML 里 | 优秀 |
| Schema 覆盖 | Organization / WebSite / SoftwareApplication / Article / FAQPage / BreadcrumbList / AboutPage / CollectionPage | 良好 |
| robots.txt | OAI-SearchBot / GPTBot / PerplexityBot / Claude-SearchBot / ClaudeBot / Bingbot 全部 Allow | 优秀 |
| llms.txt + llms-full.txt | 已生成，与 [siteContent.json](../src/content/siteContent.json) 同源 | 已经够用 |
| 内容模式 | "直接回答 → 框架 → 表格 → FAQ → updated date" 模板化得很好 | 优秀 |
| Topic cluster | 6 篇围绕 AEO 核心意图，互链清晰 | 良好 |
| Bing 站点验证 | [BingSiteAuth.xml](../public/BingSiteAuth.xml) | 已就位 |
| 内容源单一 source of truth | [siteContent.json](../src/content/siteContent.json) 510 行 | 优秀 |

### 1.3 当前 Schema 覆盖明细

通过 [scripts/prerender.mjs](../scripts/prerender.mjs) 注入：

- 全站：`Organization`（含 founder 数组 + sameAs LinkedIn）
- 首页：`WebSite`、`SoftwareApplication`、`WebPage`、`FAQPage`
- About：`AboutPage`（嵌套 Organization）、`BreadcrumbList`
- Resource 页：`Article`、`FAQPage`、`BreadcrumbList`
- Resources hub：`CollectionPage`、`BreadcrumbList`

### 1.4 当前 robots.txt 名单

```
Googlebot, Bingbot, OAI-SearchBot, ChatGPT-User, GPTBot,
PerplexityBot, Perplexity-User, Claude-SearchBot, Claude-User,
ClaudeBot, Twitterbot, facebookexternalhit, *
全部 Allow: /
Sitemap: https://solcrys.com/sitemap.xml
```

---

## 2. 2026 SEO / AEO / GEO 行业研究

调研覆盖 5 大主题：(A) AEO/GEO 引用因子；(B) 技术 SEO 2026；(C) 内容与 topic 策略；(D) B2B SaaS 转化优化；(E) 反模式与风险。

调研方法：聚合多源 2026 年研究报告（Ahrefs、Otterly、Profound、DigitalApplied、Wellows、EMarketer、Conductor）+ 平台官方文档（Google Search Central、Bing Webmaster、OpenAI、Anthropic、Perplexity）+ 独立分析。每一条结论都标注证据强度。

> **重要警示**：2026 年的 AEO/GEO 文献大量来自厂商发布，普遍有"让 AI 搜索看起来比实际更可衡量"的动机。SparkToro / Carnegie Mellon 研究发现"对 100 次相同 prompt，ChatGPT 或 Google AI 给出相同品牌推荐列表的概率不到 1%"—— 解读所有"百分比"时都应保留这种不确定性。

### 2.1 AEO / GEO 引用因子

#### 2.1.1 最大规模的非厂商研究：Ahrefs 75k 品牌相关性

Ahrefs 对 75,000 个品牌（DR>40，月搜索量 ≥800）做 Spearman 相关分析，得到品牌出现在 AI 答案里的预测因子：

| Factor | ChatGPT | AI Mode | AI Overviews |
|---|---|---|---|
| YouTube mentions | **0.737** | **0.737** | **0.737** |
| Branded web mentions | 0.664 | 0.709 | 0.656 |
| Branded anchors | 0.511 | 0.628 | 0.527 |
| Branded search volume | 0.352 | 0.466 | 0.392 |
| Domain Rating | 0.266 | 0.285 | 0.326 |
| Backlinks | ~0.21 | ~0.21 | ~0.22 |
| Site page count | ~0.19 | ~0.19 | ~0.19 |

**关键意外发现**：
- YouTube mentions 比 DR 强 ~3 倍
- 站点页面数与品牌可见性几乎零相关 —— **否定了"批量生成 SEO 页面"的策略**
- AI Overviews 与 AI Mode 结果重叠 0.821，但**实际被引用 URL 只有 13.7% 重叠** —— Google 在用相似的选择逻辑去查不同的索引

来源：[Ahrefs 75k-brand correlations](https://ahrefs.com/blog/ai-brand-visibility-correlations/)

#### 2.1.2 页面级结构因子：DigitalApplied 500 SaaS 站审计

500 个 SaaS landing page × 6,000 query × 4 引擎（2026/3–4 月）：

> 结构性 rubric 与引用率相关性 **+0.71**，而 domain authority 只有 **+0.18**。Top quartile 月均 31 次引用 vs. bottom quartile 3.7 次（**8.4× 差距**）。

最高单页提升因子：

| 元素 | 引用率提升 |
|---|---|
| 包含命名竞品的对比 section | **+38%（ChatGPT +51%）** |
| 有效 llms.txt | +24%（**注意**：相关，不是因果，见 2.1.3）|
| Answer-format H2（"What is X? How does X work?"）| +22% |
| 有效 SoftwareApplication JSON-LD | +18%（**Gemini +33%**）|
| 可爬取的 docs 子域 | +17% |
| 结构化定价层级 | +14% |
| 命名 use-case 页 + 客户结果 | +12% |

其他被多源验证的提升数字（厂商来源，相对弱）：直接引用 +37%、统计事实 +22%、命名竞品 +38%。

页面**新鲜度未与引用率相关**（中位被引页面 14 个月）—— AI 引擎把产品页当 evergreen 参考材料。

#### 2.1.3 综合判断：on-site vs off-site

矛盾要点：厂商文献力推 schema/structure；Ahrefs 大样本研究发现品牌 mention + YouTube 主导。

**最稳妥的综合结论**：
> **站外品牌实体信号决定你能不能进候选集**；**站内结构决定你被不被抽出来作为引用源**。

二者都要做，但优先级是先建实体存在性，再优化页面结构。

#### 2.1.4 llms.txt 真实证据

**强证据**：没有任何主流 LLM 提供商公开承认消费第三方 llms.txt 文件。

- Google John Mueller 明确表态："no AI system currently uses llms.txt"（[AEO Engine](https://aeoengine.ai/blog/llms-txt-zero-usage-ai-bots-ignore), 2026/4）
- OpenAI、Anthropic、Google、Microsoft、Perplexity 全部拒绝公开承认消费
- 它们**自己**为自己的 docs 发布 llms.txt（docs.claude.com、platform.openai.com/docs/llms.txt、docs.perplexity.ai/llms-full.txt），但从不说"我们消费别人的"

**矛盾观察**：DigitalApplied 报告 +24% 引用率提升 —— 大概率是相关而非因果（投入做 llms.txt 的站点也投入做了一切其他事）。AEO Engine 自己的 500 站分析声称"零相关"。

**实操建议**：低成本投入，已经做了就保留；**不要再投入额外时间**，把工时花在 Wikidata/Reddit/YouTube 上。

#### 2.1.5 UGC 在 LLM 引用中的实际权重（强证据，多源一致）

| 引擎 | Top-3 来源 | 关键数字 |
|---|---|---|
| ChatGPT | Reddit, Wikipedia, Amazon | Wikipedia ~7.8% 总引用，Reddit ~1.8% |
| Perplexity | Reddit, Wikipedia, LinkedIn | Reddit **24%** 总引用、**46.7%** Top-10 引用 |
| Google AIO | YouTube, Wikipedia, Forbes | Reddit 占 AIO 社交引用 **44%** |

其他要点：
- **Quora 在所有平台都在下降**
- **YouTube 是品牌 visibility 最强单一相关因子**（0.737）—— 由 Google AIO 偏好多模态内容驱动
- **ChatGPT 与 Perplexity 引用域名只有 ~11% 重叠** —— 各引擎要分开优化

来源：[Otterly AI Citations Report 2026](https://otterly.ai/blog/the-ai-citations-report-2026/)、[Profound citation patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)、[Wellows social media AI citations](https://wellows.com/blog/social-media-ai-citations-report-2026/)

#### 2.1.6 Wikipedia / Wikidata 作为 grounding 信号

**最强共识**：Wikipedia + Wikidata 是 LLM 实体识别的事实 ground truth。

- Wikipedia 在所有主流 LLM 训练语料中
- RAG 系统实时查询 Wikipedia
- ChatGPT 第二大引用域名；所有主流引擎 Top-3

对早期 SaaS 实操：Wikipedia 文章受 notability 限制难做，但 **Wikidata 实体没有 notability 门槛**，机器可读，可以立刻建。**优先级：先建 Wikidata 再尝试 Wikipedia**。

来源：[The Wikipedia Ground Truth](https://medium.com/@tommy_81972/the-wikipedia-ground-truth-masterminding-entity-authority-in-the-age-of-ai-search-99304e25e16c)

#### 2.1.7 Schema.org 在 2026 的实际权重

**Google 官方弃用**（2025/11 公告，2026/1 生效）：
- Practice Problem
- Dataset rich result
- Sitelinks Search Box
- SpecialAnnouncement
- Q&A

**FAQ schema 状态**：rich result 范围被收窄（主要保留政府/医疗），但 **FAQ markup 本身仍与 AI Overview 引用强相关** —— 厂商共识是 AI 引擎仍在消费结构，即使 Google 不再渲染 rich result。

**2026 最高价值 schema 类型**：
- `SoftwareApplication / Product` —— DigitalApplied 数据 +18% 引用，**Gemini +33%**
- `Organization` + sameAs 到 Wikidata/LinkedIn/Crunchbase —— 实体 grounding
- `Article + Author`（带 credentials）—— 驱动 E-E-A-T 抽取
- `BreadcrumbList` —— 所有弃用都没动它，帮实体 hierarchy
- `FAQPage` —— AI 引擎仍在消费（即使 Google 不再发 rich result）

**重要**：schema 是验证层，不是排名信号。Gemini 驱动的 AI Mode 用 schema 验证 claim 和评估可信度。**坏 schema 比没 schema 更糟**。

来源：[Schema markup AI citations 2026 - Soar](https://www.soar.sh/blog/schema-markup-ai-citations-2026)、[Frase FAQ schema for AEO/GEO](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)

### 2.2 技术 SEO 2026

#### 2.2.1 Google AI Overviews & AI Mode

- AI Overviews 在 **48–50% 的 Google 搜索**触发（2026 Q1）
- 触发后传统 CTR **从 1.76% 降到 0.61%（–61%）**
- 被 AIO 引用的页面：**自然点击 +35%、付费点击 +91%**
- AI Overviews 与 AI Mode 引用 URL **只有 13.7% 重叠** —— 必须分开优化
- 顶部 inclusion 信号（15,847 AIO 结果 × 63 行业研究）：
  - 语义完整性 ≥8.5/10 → 引用率 4.2 倍
  - 多模态内容 → +156%
  - E-E-A-T → +22% visibility
  - 53% 被引内容是过去 6 个月更新的

来源：[Wellows AI Overviews ranking factors](https://wellows.com/blog/google-ai-overviews-ranking-factors/)、[Arvow AI Overviews 2026 stats](https://arvow.com/blog/ai-overviews-ai-mode-statistics-2026)

#### 2.2.2 Bing IndexNow

**值得做**：
- 2026 年日均 **5+ 亿 URL 提交**，80M+ 站点接入
- Bing 数据：**搜索结果点击的 22% 来自 IndexNow 提交**（2025 末 18% → 2026 22%）
- 几分钟内索引（vs. 几天）
- Yandex / Naver / Seznam 也消费
- **Google 仍未支持**（自 2021 测试至今）
- Cloudflare 一键、纯 API 调用 ~15 分钟工作量

来源：[Pressonify - IndexNow 2026](https://pressonify.ai/blog/indexnow-instant-indexing-press-releases-2026)、[Bing IndexNow](https://www.bing.com/indexnow)

#### 2.2.3 AI 爬虫名单 2026（搜索/训练分离）

最稳妥的 SaaS 默认：**Allow 检索类，对训练类显式决策**。

**训练爬虫**（在 robots.txt 里 disallow 即可 opt out 训练）：
- GPTBot（OpenAI 训练）
- ClaudeBot（Anthropic 训练）
- CCBot（Common Crawl）
- Google-Extended（Gemini 训练 token）
- Applebot-Extended（Apple Intelligence token）
- Meta-ExternalAgent（Meta）
- Amazonbot（Nova 训练）
- Bytespider（ByteDance —— **不遵守 robots.txt**）

**检索 / 搜索爬虫**（Allow 给 AI 搜索 visibility）：
- OAI-SearchBot（ChatGPT search）
- Claude-SearchBot（Claude web search）
- PerplexityBot
- Google-CloudVertexBot
- Bingbot（同时服务 Copilot）
- DuckAssistBot

**用户触发抓取**（一般 Allow，是用户在主动请求）：
- ChatGPT-User、Claude-User、Perplexity-User、MistralAI-User
- Google-Agent（**显式忽略 robots.txt**，作为浏览器代理）

**不合规 / 伪造**（不要靠 UA 拦，靠行为或 WAF）：
- Bytespider、xAI Grok crawler、Microsoft Copilot Actions

**SolCrys 的具体策略**：作为 AEO 平台，"被 AI 系统知道你 = 商业利益"，opt-out 训练对你是反向操作。**全部 Allow，包括训练爬虫**。

来源：[No Hacks 2026 AI user-agent landscape](https://nohacks.co/blog/ai-user-agents-landscape-2026)、[SEJ Anthropic robots.txt granular](https://www.searchenginejournal.com/anthropics-claude-bots-make-robots-txt-decisions-more-granular/568253/)

#### 2.2.4 Core Web Vitals 2026

- **INP "good" ≤200ms**，**实操目标 <150ms** 才有排名稳定性。INP 是与 LCP/CLS 等权的排名信号（Google Search Central 2026/3/18 确认）。**43% 站点目前 INP 不及格** —— 是最难过的 CWV 指标。
- **LCP "good" 阈值据报道从 2.5s 降到 2.0s**（2026）—— *警告：厂商来源（IdeaFueled、Logos Web Designs），未找到 Google 官方一手公告。当作"加速建议"而非硬阈值。*
- CLS 不变（≤0.1）
- 据报道汇总到 domain-level 信号而非纯 per-page —— *同样厂商来源，谨慎对待*

#### 2.2.5 Sitemap 实践

**强证据**：**Google 完全忽略 `changefreq` 和 `priority`**。多源确认 + Google 官方文档。

- `lastmod` 是唯一有用的可选字段，但**只有"持续可验证准确"才被信任**
- 每次 deploy 自动改 `lastmod` 是公认反模式，会让 Google 不信任整张 sitemap
- Bing 仍在用 `lastmod` + IndexNow 作为新鲜度信号

来源：[Google Search Central Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)

### 2.3 AEO 类目竞品全景

#### 2.3.1 Top 12 玩家（按 visibility / 融资排序）

| 平台 | 定价 | 融资 | 备注 |
|---|---|---|---|
| **Profound** | Enterprise (Starter ~$99) | 大额；G2 Winter 2026 Leader | Vercel/Cloudflare/GA4 agent analytics 集成 |
| **Brandlight** | Enterprise | $30M Series A (Cardumen, G20) | 11+ 平台含 Amazon Rufus；"AI Visibility OS" |
| **Peec AI** | $89-$95/mo | $29M total ($21M Series A) | 1,500+ 团队，115+ 语言 |
| **AthenaHQ** | $295/mo | $2.2M seed (YC) | Ex-Google Search PM 创始人；定价透明 |
| **Otterly.AI** | $29/mo | n/d | Gartner Cool Vendor 2025；Semrush 集成 |
| **Goodie AI** | Enterprise | n/d | 11 模型覆盖最广（含 Rufus）；Dermalogica/NoGood 客户 |
| **Scrunch AI** | $250/mo | n/d | Lenovo / Penn State 客户 |
| **Azoma** | Enterprise | n/d | 电商专门（Rufus、Walmart Sparky）|
| **Ahrefs Brand Radar** | 捆绑 | 上市公司 | 263M+ 月度 prompt；分发优势巨大 |
| **HubSpot AEO Grader / AEO** | Free + $50/mo | 上市公司 | **最强免费工具 / lead-gen 执行** |
| **Siteline** (前 GPTrends) | Free tier | n/d | Agent analytics 角度 |
| **AirOps** | Free tier | n/d | Content optimization + GEO |

**类目总融资 $300M+ 跨 52 个追踪平台**，背后 Sequoia / Kleiner Perkins / NEA / Felicis。竞争激烈，**差异化定位比功能堆叠更重要**。

来源：[Plate Lunch 24-platform comparison](https://www.platelunchcollective.com/aeo-tools-analysis-10-platforms-compared-beyond-marketing-materials-because-youve-been-searching-for-them/)、[Rankability 22 best AI search tools](https://www.rankability.com/blog/best-ai-search-visibility-tracking-tools/)

#### 2.3.2 头部玩家排名靠的是什么页面

观察到的共同模式：

1. **免费交互工具 / "audit my brand" graders** —— HubSpot AEO Grader、Ahrefs AI Visibility Checker、Otterly free tier。**类目 #1 流量入口和 link magnet**。
2. **竞品对比页** —— "Profound vs Peec vs Otterly"、"[X] alternatives" —— 占 SERP，且被 ChatGPT 重度引用（**+51% 偏向**）。
3. **原创 benchmark / state-of 报告** —— Otterly 100 万 citations 报告、Profound 引用模式分析、Conductor 2026 AEO/GEO Benchmarks。**类目主导的 linkable asset**。
4. **Glossary / 类目教育** —— "What is AEO"、"What is GEO" —— 抢占定义，赢得实体关联。
5. **Methodology / "how we measure" 页** —— 应对 trust 反对意见（在 AEO 类目尤其严重，因为引用的可复现性问题）。

#### 2.3.3 AEO/GEO 关键词空间数据

- "AEO" / "answer engine optimization" —— 需求快速上升。Frase、HubSpot、EMarketer、Conductor 都在打。EMarketer：2026 美国 31.3% 人口将用 generative AI 搜索。但量级仍**远低于 "SEO"**。
- "GEO" / "generative engine optimization" —— 竞争性首字母，共识弱于 AEO。
- "AI search visibility"、"ChatGPT SEO"、"LLM SEO" —— 长尾，高商业意图。
- "How do I get my brand cited by ChatGPT" 类查询 —— emerging 高意图长尾。

**关键警告**：Ahrefs / Semrush 数据显示 **65–85% ChatGPT prompt 在 Semrush 关键词库里没有匹配**。传统关键词量在结构性低估 AI 搜索需求。ChatGPT 处理 ~12–18% Google 搜索量，但只发送 1/190 的 referral 流量。

**实操结论**：不要追固定关键词列表；建类目权威 + 围绕"AI search visibility / answer engine optimization"实体的 topical authority。

来源：[EMarketer GEO/AEO FAQ](https://www.emarketer.com/content/faq-on-geo-aeo--where-ai-search-seo-overlap-2026)、[Ahrefs ChatGPT 12% of Google volume](https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/)

### 2.4 可链接资产模式

Datalily 2026 State of Data-Driven Content Marketing：
> **每 5 个 B2B SaaS marketer 中超过 1 个说原创研究报告 ROI 最高；86% 计划增加自有研究预算。**

经市场验证的模式：

1. **年度 "State of [category]" 报告** + 自有数据 —— Conductor / Otterly / Profound / Ahrefs 全在打
2. **免费工具** + 可分享输出 —— HubSpot AEO Grader 是金标准；Ahrefs Brand Radar / AI Visibility Checker 第二
3. **公开 methodology 页** —— 应对 AEO 独有的可复现性 / 信任问题
4. **公开 benchmark / 排行榜** —— "Top 50 most-cited domains" 类型（5W 的 Index 是案例）
5. **对比 / "alternatives to X" 页** —— 高商业意图、高引用率

来源：[5W AI Platform Citation Source Index 2026](https://www.prnewswire.com/news-releases/5w-releases-ai-platform-citation-source-index-2026-the-50-websites-that-now-decide-what-brands-are-visible-inside-chatgpt-claude-perplexity-gemini-and-google-ai-overviews-302759804.html)

### 2.5 B2B SaaS 转化优化（2026 基准）

#### 2.5.1 Landing page 转化数据

- **B2B SaaS landing page 平均：2–5%**，top performer **8–15%**
- **Self-serve 页：4–10%**；**demo request 页：1.5–4%**（top quartile 8–15%）
- **单 CTA 页：13.5% vs. 多 CTA：10.5%**
- **定制页：11.6% vs. 模板页：3.8%**
- **无导航 landing page 转化 2–3 倍** vs. 全站 nav
- **3 字段表单 ~25% 转化；7+ 字段 <15%**
- 按公司规模 / 行业个性化可提升 **>200%**

#### 2.5.2 免费工具 / 免费版 / "audit my brand" 模式

类目里实际**已成 table-stakes**。HubSpot AEO Grader 是金标准：无账号即可看品牌 sentiment + recognition + share-of-voice 跨 ChatGPT/Perplexity/Gemini。Ahrefs 通过 Brand Radar / AI Visibility Checker 提供等价物。Otterly 有免费版。

**"audit my brand" 同时干三件事**：
- Lead-gen
- 演示产品核心价值
- 可分享输出 → 自然 word-of-mouth

Freemium 数据：visitor → trial **5–15%**；trial → paid **~4%** 平均。**免费工具单独 outperform freemium**（针对单一 job 的产品）。

#### 2.5.3 Demo vs 免费试用 vs Early-access

- **Demo（企业级 $50K+ ACV）：55–75% 关单率**；demo-qualified leads 年流失 3.5% vs. trial-acquired 高得多
- **带卡免费试用：30%+ trial-to-paid**（无卡的 5 倍）
- **不带卡试用：8.9%**（2026 平均，从 2025 的 18.2% 下降）
- **B2B SaaS 平均 free-to-paid：8%**
- **Waitlist**：top 表现者（Superhuman、Linear 风格）50% waitlist-to-customer

**对 SolCrys 的推荐矩阵**：早期 + 新类目 + 企业级 ACV，**主推免费 brand audit + book-a-demo**，超过免费试用。Audit 演示产品能力，demo 处理复杂度。Self-serve trial 太早，除非 time-to-value <5 分钟。

#### 2.5.4 Trust signal（按 B2B SaaS 转化影响排序）

1. **G2 / Capterra 徽章 + 评分** —— 对比页 2–3× 提升；demo rate +25%
2. **可识别客户 logo** —— logo + 具体 ROI 指标最好
3. **SOC 2 Type II / GDPR 徽章靠近 CTA** —— **+10–20%**；处理企业安全反对
4. **定价透明度** —— Google Ads SQL +13%；定价 + 竞品 conquest +35–40%
5. **具名团队 / 创始人 bio + credentials** —— 同时是 AEO E-E-A-T 和转化最强信号
6. **真产品截图 / 视频** —— "visual proof" demo +25%

来源：[SaaS Hero landing page trust signals](https://www.saashero.net/design/landing-page-design-trust-signals/)、[GrowthSpree B2B SaaS 2026](https://www.growthspreeofficial.com/blogs/b2b-saas-conversion-rate-benchmarks-2026-funnel-stage-vertical)

### 2.6 反模式与风险（2026 新增）

#### 2.6.1 已被打击的 AEO 操作

- **关键词堆砌 FAQ block**、**只改 schema 不改文案**、**品牌 mention 密度造作** —— 引用提升都在误差范围内（1.2% 提升 vs. 噪声）
- **Bing 已正式将 "AI Manipulation" 列为 abuse category** —— 惩罚专为触发 AI 引用而做的堆砌或轻改写
- **OWASP 2026 #1 AI 威胁：indirect prompt injection** —— Google 报告 2025/11–2026/2 期间恶意活动相对增加 32%。在网页里嵌隐藏 prompt 操纵 AI 引擎现在被检测且被惩罚
- **2026/3/24 Google Spam Update** 明确针对 scaled content abuse —— 20 小时内流量跌 50–80%

#### 2.6.2 Google 对 AI 内容的立场（2026）

政策不变，执法更严：
- AI 内容**可接受当且仅当高质量、有用、显示专业** —— 不可接受当其规模化、单薄、无编辑
- SpamBrain 加强执法（不是新 guideline）
- 用 AI 作为真实编辑流程一部分的站点没有负面影响
- AdSense 政策现在显式要求**人工监督 + E-E-A-T 信号**

#### 2.6.3 Parasite SEO（2026 风险显著上升）

Google 第二次 March 2026 spam update 把 page-level 处罚应用于 site reputation abuse：
> 高 DA 站点托管不相关 niche 第三方内容 —— 那些**特定页面**被去权重。Publisher 通过出租子目录权威获利现在面临真实的页面级处罚，**即使托管内容本身高质量**。

Google 政策更新："no level of publisher involvement in creating third-party content that exploits their site's rankings mitigates its policy violations."

**对 SolCrys 的含义**：依赖 Forbes / HubSpot / Medium contributor 投稿作为主要 AEO 引用策略**风险高**。Earned citation 在 UGC 平台（Reddit、Wikipedia、GitHub）+ 自有渠道（原创研究、免费工具）才是 durable play。

来源：[SEOMediaWorld parasite SEO 2026](https://seomediaworld.com/parasite-seo-in-2026-risks-and-strategy/)、[DigitalApplied Google March 2026 spam update](https://www.digitalapplied.com/blog/scaled-content-abuse-google-march-update-ai-pages-decimated)、[Bing GEO abuse category update](https://www.allaboutai.com/ai-news/bing-updates-official-guidelines-adds-geo-and-broadens-ai-abuse-definitions/)

---

## 3. 缺口分析

### 3.1 P0 站内技术缺口（1 周内可全部修完）

#### P0-1. OG image 全站共用且文件名带 hash —— 破坏社交缓存 · ⏳ 基础设施完成，等图

> **2026-05-02 更新**：脚本已支持 per-page OG，`siteContent.json` 每页 `ogImage` 字段已加。**fallback 行为**：当 `public/og/<filename>.png` 不存在时自动回到 `/solcrys-og-card.png`（无 hash）。**激活步骤**：在 `public/og/` 放 7 张 1200×630 PNG，文件名匹配 `siteContent.json` 中各页 `ogImage` 字段。下次 build 自动按页生效。

[dist/index.html](../dist/index.html) 全站所有页面 `og:image` 都指向 `/assets/report-C8IaPPdQ.png`。
- Vite 内容哈希意味着每次 rebuild URL 都会变 → Twitter / LinkedIn / Slack 缓存失效
- 所有页面同一张图 → 无法区分类目，社交分享 CTR 损失

**修法**：
- 把 OG 图片移到 `public/og/` 不带 hash：例如 `public/og/home.png`、`public/og/answer-engine-optimization.png`
- 在 [src/content/siteContent.json](../src/content/siteContent.json) 每个 page 加 `ogImage` 字段
- prerender 里按页面输出，不复用同一张

#### P0-2. sitemap.xml 所有 lastmod 都是 `2026-04-29` · ✅ 已完成

> **2026-05-02 更新**：`<priority>` 和 `<changefreq>` 已从 [scripts/prerender.mjs](../scripts/prerender.mjs) 移除。`<lastmod>` 改用每页真实 `updated` 字段（当前 6 个 cluster 页确实都是 `2026-04-29`，因为内容没动）。**后续维护规则**：仅当真实改 resource 内容时才在 [siteContent.json](../src/content/siteContent.json) 改对应页的 `updated`。绝对不要按 deploy 时间盖。

[dist/sitemap.xml](../dist/sitemap.xml) 11 个 URL 全是同一天。Google 官方："`lastmod` consistently and verifiably accurate" 才被信任，否则**整张 sitemap 被降权**。

**修法**：
- 每个 resource page 单独维护 `updated` 字段
- 把 `<priority>` 和 `<changefreq>` 删掉（Google 完全忽略）
- 实际改内容才更新 `lastmod`，不要按 deploy 自动盖

#### P0-3. SoftwareApplication schema 太薄 · ✅ 部分完成（offers/aggregateRating 故意留空）

> **2026-05-02 更新**：已加 `applicationSubCategory: "Marketing Technology"`、`featureList`（来源 `home.proofPoints`）、`screenshot`、`audience`、`softwareVersion`、完整 `publisher.logo`。**故意未加**：`offers`（无真实定价）、`aggregateRating`（无真实 G2 评分）。等定价层级和 G2 入驻完成再补——**禁止造假**。

当前 [dist/index.html](../dist/index.html)：
```json
{"@type":"SoftwareApplication","name":"SolCrys AI",
 "applicationCategory":"BusinessApplication","operatingSystem":"Web"}
```

DigitalApplied 数据：完整 SoftwareApplication schema 在 **Gemini 引用率 +33%**。

**修法**：补
- `offers`（即使 "Contact for pricing" 也要 `Offer` + `priceCurrency` + `availability`）
- `aggregateRating`（一旦有 G2 / Capterra 评分立刻接入；**禁止造假**）
- `featureList`（5–10 条核心功能）
- `screenshot`（指向真产品截图）
- `softwareVersion`、`releaseNotes`
- `audience` → `Audience` with `audienceType: "Marketing teams"`

#### P0-4. Founder 描述违反自己的方法论 · ⏳ Schema 框架就位，等真实数据

> **2026-05-02 更新**：`Person.worksFor` 已加（指向 SolCrys）。`alumniOf` / 历史 `worksFor` / `knowsAbout` / 文案修复**未做** —— 不能编造创始人过往。**激活步骤**：用户提供三人真实过往雇主、学校、与 AEO 相关的一句 highlight，我按 schema 模板填进去。当前 Gwen 的 `"AI search & GTM strategy"` 仍是漂浮 tagline。

[seo-aeo-methodology.md §4.7](seo-aeo-methodology.md) 明确写：
> avoid generic taglines such as "AI search & GTM strategy" that float free of any prior role

但 [dist/about/index.html](../dist/about/index.html) 里：
```
Gwen Chen — "AI search & GTM strategy. AEO, content authority, and brand visibility."
```

完全是漂浮 tagline。Eason、Jia 也都没绑定到 verifiable past role 的具体公司。

**修法**（schema + 文案同步）：
- `Person.worksFor` 加历史经历数组
- `Person.alumniOf` 学校
- `Person.knowsAbout`、`Person.award`
- 文案改成 "Previously at [Company], where she [shipped X]" 的具体句式

不只是方法论合规，**Person 实体绑定可验证过往是 LLM E-E-A-T 抽取最强信号之一**。

#### P0-5. Static nav 的 hash 链接断了 · ✅ 已完成

> **2026-05-02 更新**：静态 home 的三个对应 H2 加了 `id="aeo"` / `id="approach"` / `id="features"`。静态 nav 同时加了 `Our Approach` 链接（与 React Navbar 完全对齐）。从任何静态页点 `/#aeo` 现在都能落到正确锚点。

[dist/answer-engine-optimization/index.html](../dist/answer-engine-optimization/index.html) 静态版导航里 `/#aeo` 和 `/#features` —— 这些 anchor 只在 React 客户端组件里，prerendered HTML 没有对应 ID。爬虫和无 JS 用户点了会落空。

**修法**：要么把这两个 section 也写进 prerender，要么把 nav 改成跳真实页面（如 `/resources/`、`/about/`）。

#### P0-6. IndexNow 没接入 · ✅ 脚本就位，⏳ 等 key

> **2026-05-02 更新**：[scripts/ping-indexnow.mjs](../scripts/ping-indexnow.mjs) 已加，自动在 `npm run deploy` 之后跑（`postdeploy` hook）。同时 [package.json](../package.json) 加了 `npm run indexnow` 作为手动触发。**激活步骤**：(1) `openssl rand -hex 16` 生成 key；(2) `echo "<KEY>" > public/<KEY>.txt`；(3) deploy 环境（GitHub Actions secrets / 本地 .env）设 `INDEXNOW_KEY=<KEY>`。脚本在 key 缺失时安全 no-op（不会让 CI 失败）。

Bing 2026：**搜索结果点击的 22% 来自 IndexNow 提交**，几分钟内索引。15 分钟工作量。

**修法**：[scripts/prerender.mjs](../scripts/prerender.mjs) 末尾或 GitHub Actions 里加 POST：
```bash
curl -X POST https://api.indexnow.org/IndexNow \
  -H "Content-Type: application/json" \
  -d '{"host":"solcrys.com","key":"<YOUR_KEY>",
       "urlList":["https://solcrys.com/", ...]}'
```
key 文件放 `public/<key>.txt`。

#### P0-7. 缺少必要的 schema 类型 · ✅ Service 已加，其余按需

> **2026-05-02 更新**：`Service` schema 已加到首页。`Organization.sameAs` 改成数组格式，等 Wikidata Q-number 出来直接 push 进 [siteContent.json](../src/content/siteContent.json) 的 `site.sameAs`。`Course` / `LearningResource` 暂未加（resource 页 Article schema 已经够用，Learning Resource rich result 在 SaaS 类目实际收益不明显）。`WebSite.SearchAction` 没加（已弃用，与策略一致）。

- **`Service`** ✅ —— 已添加
- **`Organization.sameAs` 数组结构** ✅ —— 已就绪，等 Wikidata
- **`Person.sameAs`** ⏳ —— 当前只有 LinkedIn，等 Wikidata Person 实体 Q-number
- **`Course` / `LearningResource`** ⏸️ —— 按需，先不加
- **`WebSite.SearchAction`** ❌ —— 不加（已弃用）

#### P0-8. 其他细节 · ✅ 大部分完成

> **2026-05-02 更新**：

- `<html lang="en">` ⏸️ —— 多语言暂未上，保持 `en`
- `<link rel="apple-touch-icon">` ✅ —— 已加（512x512 sizes 标注）
- `<meta property="og:site_name">` / `<meta property="og:locale">` ✅ —— 已加
- `<link rel="manifest">` ⏸️ —— PWA 暂不优先
- `<link rel="preconnect">` ⏸️ —— 当前没用第三方 fonts/CDN，待引入时再加
- LCP 图 `srcset` ⏸️ —— 当前 `report-*.png` 单分辨率，建议下一轮做响应式版本

### 3.2 P1 实体存在性缺口（最高 ROI）

| 缺口 | 现状 | 影响 |
|---|---|---|
| Wikidata 实体 | 无 | LLM grounding 最强单一信号缺失 |
| Wikipedia 文章 | 无 | ChatGPT 第 2 引用域 |
| YouTube 频道 | 无 | Ahrefs 0.737 相关性 vs. DR 0.27 |
| Reddit 有机存在 | 无 | Perplexity 24% 引用源 |
| G2 / Capterra 入驻 | 无 | 对比页 2-3× 转化提升 |
| Crunchbase / LinkedIn 完整度 | 部分 | 实体 cross-reference |

### 3.3 P1 可引用资产缺口

| 资产类型 | 是否有 | 类目对手 |
|---|---|---|
| 免费 audit 工具 | 无 | HubSpot、Ahrefs、Otterly 都有 |
| 原创数据报告 | 无 | Otterly、Profound、Conductor 都有 |
| 竞品对比页 | 无 | 几乎所有头部都有 |
| Glossary | 无 | HubSpot、Frase 都有 |
| 公开 methodology 页 | 内部文档未发布 | 可立刻发 |
| 客户案例 | 无 | 早期，但需要骨架 |

### 3.4 P1 转化路径缺口

| 缺口 | 当前 | 建议 |
|---|---|---|
| `/pricing/` | 无 | 即使 "contact" 也要 `Offer` schema 化 |
| `/demo/` | 仅 EarlyAccessDialog | 独立无导航页，3 字段表单 + Calendly |
| `/audit/` | 无 | P1-2 免费工具 |
| `/customers/` | 无 | 1-2 个 logo 立刻上 |
| `/trust/` 或 `/security/` | 无 | SOC 2、GDPR、DPA |
| Trust signal stack | 无 | logo / G2 / 安全徽章 / 命名团队 |

---

## 4. 优化策略

### 4.1 站内技术修补（P0，1 周）

详见第 3.1 节。集中改动文件：
- [src/content/siteContent.json](../src/content/siteContent.json) —— 加 `ogImage`、按页面 `updated`
- [scripts/prerender.mjs](../scripts/prerender.mjs) —— 输出 per-page OG、`Service` schema、扩展 `SoftwareApplication`、按 `updated` 写 sitemap
- [public/robots.txt](../public/robots.txt) —— 扩展 AI 爬虫名单（见 4.5）
- 新文件 `public/og/*.png` —— per-page OG 图片
- 新文件 `public/<indexnow-key>.txt` + GitHub Actions 步骤

### 4.2 实体与权威建设（P1，按周）

#### 4.2.1 Wikidata 实体（半天工作量）

操作步骤：
1. 在 [wikidata.org](https://www.wikidata.org) 创建 SolCrys AI 的 Q-number 实体
2. 字段（按这个顺序填，每填一个 LLM 抽取就更稳）：
   - `instance of (P31)` → software company (Q1058914) + marketing technology
   - `country (P17)`
   - `inception (P571)` → 公司创立日期
   - `headquarters location (P159)`
   - `official website (P856)` → https://solcrys.com
   - `chief executive officer (P169)` → Gwen 的 Q-number
   - `industry (P452)` → "Answer Engine Optimization"
3. 给三位创始人各建一个 Person 实体，互相 link
4. 站内 schema `Organization.sameAs` 加 `https://www.wikidata.org/wiki/Q...`

#### 4.2.2 G2 / Capterra / Crunchbase / LinkedIn 完整化

- G2 入驻 → 即使 5 条 review 也激活徽章
- Crunchbase 完整 profile（公司、产品、融资、团队）
- LinkedIn Company Page 频次提升（每周 2-3 帖）
- 创始人个人 LinkedIn 高频更新 AEO 内容

#### 4.2.3 Reddit / 行业社区（持续）

不 spam。做法：
- 一位创始人（最自然是 Gwen 或 Eason）月度 10-20 条**高质量回答**在 r/SEO、r/marketing、r/bigseo、r/PPC
- 不强推 SolCrys，让"答案的质量"被引用
- 同时建 r/AnswerEngineOptimization 或参与既有 AEO 子版

### 4.3 内容资产生产（P1，8-12 周）

#### 4.3.1 Free AEO Audit 工具（最高单一转化杠杆）

最小可行版（2-4 周）：
- `/audit` 页面：输入域名 + 邮箱
- 后端跑预设 5-10 个 prompt（用 SolCrys 已有的 prompt set）
- 输出：mention rate、citation rate、competitor share of voice
- **带可分享截图 + SolCrys 水印** → 自然 viral
- 邮箱进 lead 漏斗

为什么必做：
- 直接演示产品核心能力（不是讲，是做给你看）
- 报告"分享按钮" → 自带 backlink 增长
- 邮箱列表 = 真转化漏斗，远强于现在的 EarlyAccessDialog
- B2B SaaS landing 平均转化 2-5%，免费工具能到 8-15%

#### 4.3.2 "State of AI Search Visibility 2026" 原创报告（6-12 周）

最小数据集思路：
- 用自己的产品跑 100-500 个品牌 × 5 个 AI 引擎
- 公开 share-of-voice、引用源 Top 50、按行业的引用密度
- PR 出去带域名链接（5W 公司发 AI Platform Citation Source Index 拿到 PRNewswire 头条）
- 关键：**数据原创、方法透明**（[seo-aeo-methodology.md](seo-aeo-methodology.md) 已经写得好，可直接 repurpose）

#### 4.3.3 6 篇竞品对比页（3-4 周）

每篇 1500-2000 字，模板复用 [src/pages/ResourcePage.tsx](../src/pages/ResourcePage.tsx)：

- `/solcrys-vs-profound/`
- `/solcrys-vs-peec/`
- `/solcrys-vs-otterly/`
- `/solcrys-vs-athenahq/`
- `/solcrys-vs-brandlight/`
- `/solcrys-vs-goodie/`

聚合页：
- `/profound-alternatives/`
- `/otterly-alternatives/`

**伦理**：客观对比，**主动列出对方更强的场景**。LLM 在引用时会过滤明显有偏向的内容。

#### 4.3.4 Glossary 和 Methodology 页（1 周）

- `/glossary/` —— 10-20 条 AEO/GEO/AI search 术语，每条 200-400 字 + `DefinedTerm` schema
- `/methodology/` —— 把内部 [seo-aeo-methodology.md](seo-aeo-methodology.md) 重排版发表

#### 4.3.5 YouTube 频道（每月 2 个视频）

- "How to audit your brand's AI search visibility"
- "ChatGPT 引用谁的内容？1000 个品牌的数据"
- 6 篇 resource page 各做一个解释视频

视频 transcript 喂回站内 → resource page 加 `VideoObject` schema。**一份内容三个分发面**（Google、YouTube、AI Overviews）。

### 4.4 转化路径建设（P1）

#### 新增页面

| 页面 | 优先级 | 说明 |
|---|---|---|
| `/pricing/` | P1 | 哪怕只有 "Starter / Growth / Enterprise: contact"，要有 `Offer` schema |
| `/demo/` | P1 | 独立无导航页，3 字段表单，Calendly 嵌入 |
| `/audit/` | P1 | 4.3.1 的免费工具 |
| `/customers/` | P2 | 1-2 个 logo 立刻上 |
| `/trust/` | P2 | SOC 2 启动后立刻发 |

#### Trust signal stack（按 ROI 排）

1. G2 / Capterra 评分入驻（哪怕 5 条 review，徽章效果显著）
2. SOC 2 Type II / GDPR / DPA → `/trust/`
3. 客户 logo + 一句结果（"X 公司 30 天内 citation rate 5% → 22%"）
4. 创始人具名 + 可验证过往（见 P0-4）
5. 真产品截图 / 30 秒 demo 视频

### 4.5 爬虫策略（修订版 robots.txt）

研究结论与目前 [public/robots.txt](../public/robots.txt) 的对照：

| Bot | 类型 | 当前 | 建议 |
|---|---|---|---|
| OAI-SearchBot | ChatGPT 搜索 | Allow | 保持 |
| ChatGPT-User | 用户触发 | Allow | 保持 |
| GPTBot | OpenAI 训练 | Allow | **保持 Allow**（AEO 工具进训练语料是优势）|
| PerplexityBot | Perplexity 检索 | Allow | 保持 |
| Perplexity-User | 用户触发 | Allow | 保持 |
| Claude-SearchBot | Claude 搜索 | Allow | 保持 |
| ClaudeBot | Anthropic 训练 | Allow | **保持 Allow** |
| Google-Extended | Gemini 训练 | 未列 | **加 Allow**（不加默认允许，但显式更稳）|
| Google-CloudVertexBot | Vertex AI grounding | 未列 | 加 Allow |
| DuckAssistBot | DuckDuckGo AI | 未列 | 加 Allow |
| MistralAI-User | Mistral 用户触发 | 未列 | 加 Allow |
| Applebot-Extended | Apple Intelligence 训练 | 未列 | 加 Allow |
| Amazonbot | Amazon Nova | 未列 | 加 Allow |
| Bytespider | ByteDance | 未列 | **不显式 Allow**（不遵守 robots，无意义）|
| Meta-ExternalAgent | Meta AI | 未列 | 加 Allow |
| CCBot | Common Crawl | 未列 | 加 Allow（间接进多家 LLM）|

理由：SolCrys 卖的是"AEO 监测工具"，**让 AI 系统都知道你 = 商业利益**，opt-out 训练对你是反向操作。

---

## 5. 实施路线图

| 周次 | 任务 | 类型 | 状态 | 预期影响 |
|---|---|---|---|---|
| Week 1 | OG 拆分基础设施；sitemap lastmod 修复；删 priority/changefreq；nav hash 修复；扩 robots 名单；IndexNow 脚本 | P0 技术 | ✅ 完成（2026-05-02）| 修复信号污染，加速 Bing 索引 |
| Week 1 | OG 实际图片（7 张 PNG） | P0 内容 | ⏳ 等用户出图 | per-page 社交 CTR 提升 |
| Week 1 | IndexNow key 生成 + env 配置 | P0 ops | ⏳ 等用户操作 | 真正的 IndexNow 提交 |
| Week 1 | 建 Wikidata 实体（公司 + 3 个 founder） | P1 实体 | ⏳ 等用户操作 | 长期 LLM grounding 最强单一信号 |
| Week 2 | SoftwareApplication 扩展（featureList / screenshot / audience）；Service schema | P0 技术 | ✅ 完成（2026-05-02）| 提升 Gemini 引用率 |
| Week 2 | Person 加 alumniOf / 历史 worksFor + 改 founder 描述文案 | P0 技术 | ⏳ 等用户提供过往经历 | 修复方法论违规 + Person 实体 grounding |
| Week 2 | 公开 `/methodology/` 和 `/glossary/`（DefinedTerm schema） | P1 内容 | 抢占 entity definition |
| Week 3-4 | 6 篇竞品对比页 (`/solcrys-vs-X/` + `/X-alternatives/`) | P1 内容 | ChatGPT 对比类引用 +51% |
| Week 3-4 | `/pricing/`、`/demo/`、`/customers/` 骨架 | P1 转化 | demo +35-40% |
| Week 5-8 | "Free AEO Audit" 工具 MVP | P1 资产 | 类目 #1 lead-gen 套路 |
| Week 5-8 | YouTube 频道开播，每月 2 个视频 | P1 资产 | Ahrefs 0.737 相关性的最强信号 |
| Week 6-12 | "State of AI Search Visibility 2026" 报告（数据 + PR） | P1 资产 | 类目 link magnet |
| Ongoing | Reddit / 行业社区有机参与 | P1 实体 | Perplexity 24% 引用源 |
| Q3 | G2 / Capterra 入驻 + SOC 2 启动 | P2 信任 | 转化漏斗 trust stack |

---

## 6. 测量框架

[seo-aeo-methodology.md §6](seo-aeo-methodology.md) 已经定义了 SEO + AEO 双指标。补两件事：

### 6.1 INP 监控（2026 最重要的 CWV 指标）

- **INP ≤200ms 是 Google 官方"good"，但实操目标 <150ms**
- 43% 站点 INP 不及格 —— 是最难过的 CWV 指标
- 接入：Vercel Speed Insights / web-vitals.js → 自定义 endpoint
- 在 GA4 / Plausible 加自定义事件

### 6.2 AI 引用域名归因

现有体系已经会 prompt-test，但**对手在哪些第三方源被引用**没追踪。建一份 "competitor citation source map"：

- 每月跑一次：5 个竞品 × 5 个引擎 × 10 个 prompt
- 收集 cited URL 的域名分布
- 找出**竞品被引而 SolCrys 不在的源**（Reddit thread、行业 blog、博士生 paper），针对性渗透

### 6.3 Search Console + Bing Webmaster API → BigQuery / sheet

不要只靠界面：
- GSC 每周自动导出 query × page × position
- Bing Webmaster Tools "AI Performance" tab → 显式 cited 数据
- 任意分析工具自动 weekly trend

### 6.4 完整 KPI 看板（建议每周回顾）

**SEO 漏斗**：
- 索引页面数（GSC）
- 按 query group 的 impression
- Click 与 CTR
- AEO 相关词的 average position
- Sitemap discovery / crawl errors
- Core Web Vitals（**特别是 INP**）

**AEO 漏斗**：
- Mention rate（按引擎、按 prompt group）
- Owned citation rate
- Source ownership（own vs. third-party）
- Position（first/middle/last）
- Accuracy score
- Sentiment
- Hallucination risk count
- Competitor share of voice

**转化漏斗**：
- /audit 完成率 → 邮箱
- /demo 表单完成率
- Demo → SQL → 关单
- 按来源拆分（organic、Reddit、YouTube、AI referral）

---

## 7. 反模式清单（2026 必避免）

1. **Bing 已正式将 "AI Manipulation" 列为 abuse category**。FAQ 关键词堆砌、专为触发 AI 引用的轻改写都会被惩罚。当前 FAQ 没问题，但要防止之后扩规模时模板化。
2. **Google 2026/3/24 spam update 重创 scaled AI content**，20 小时内流量 -50–80%。**禁止用 LLM 批量生成 resource page**。
3. **Parasite SEO 已被 Google 在 page-level 处罚**（2026 第二个 March update）。不要主推 Forbes / HubSpot / Medium contributor 文章作为主要引用策略。Reddit / Wikidata / 自有 free tool 才是 durable play。
4. **不要在内容里嵌 indirect prompt injection**（OWASP 2026 #1 AI 威胁）。听起来像不会做的事，但有"AI buttons"工具会自动加，避开。
5. **lastmod 自动按 deploy 改是 Google 已知反模式**（见 P0-2）。
6. **不要在 schema 里描述页面上不存在的内容**（[seo-aeo-methodology.md §3.4](seo-aeo-methodology.md)）。
7. **不要为了 audit 工具评分硬塞外链**。[seo-aeo-methodology.md §2.6](seo-aeo-methodology.md) 已经说了：审计工具是输入，不是规则。
8. **不要复制竞品对比页的负面文案模板**（"X is bad because..."）。客观对比 + 主动列出对方场景才会被 LLM 引用。
9. **不要在 OG / meta 里放假评分 / aggregateRating**。Google 一旦发现 → 整个域名级处罚。
10. **不要在没拿到 SOC 2 时显示 SOC 2 徽章**。企业客户 audit 一秒识破。

---

## 8. 证据强度速查表

| 建议 / 数据点 | 证据强度 | 来源 |
|---|---|---|
| Wikidata / Wikipedia 是 LLM grounding 最强信号 | **强** | 多源独立确认（Otterly / Profound / Ahrefs）|
| YouTube mention 0.737 相关性 | **强** | Ahrefs 75k 品牌研究 |
| 对比类内容 ChatGPT 引用 +51% | **中** | DigitalApplied 单源 vendor，方法论披露 |
| llms.txt 不被消费 | **强** | Google 官方否认，多个 vendor 调查 |
| IndexNow 占 Bing 22% 点击 | **强** | Bing 官方 |
| Schema 提升 Gemini 引用 +33% | **中** | DigitalApplied 单源 |
| 免费工具 / audit 是类目 #1 GTM | **强** | HubSpot / Ahrefs / Otterly 全在用 |
| Reddit 占 Perplexity 24% 引用 | **强** | Otterly / Wellows 一致 |
| AIO 触发 CTR -61% | **强** | 多源独立 |
| LCP 阈值降到 2.0s | **弱** | vendor 报道，未找到 Google 官方源 —— 当作"加速建议"而非硬阈值 |
| 单 CTA 转化 13.5% > 多 CTA 10.5% | **强** | 多源 B2B 基准 |
| 无导航 landing 转化 2-3 倍 | **强** | 多源一致 |
| Demo 关单率 55-75%（企业级 ACV） | **中** | 多源但样本 bias |
| AEO/GEO 类目融资 $300M+ | **强** | 公开融资数据 |
| 65-85% ChatGPT prompt 在 Semrush 库无匹配 | **强** | Ahrefs 官方 |
| Google 弃用 FAQ rich result 但仍消费结构 | **强** | Google 2025/11 公告 + vendor 一致 |
| Bing 加入 AI Manipulation abuse 类别 | **强** | Bing 官方 2026 |

---

## 9. 参考文献

### 9.1 Google / Bing / OpenAI / Anthropic / Perplexity 官方

- [Google Search Central - SEO Starter Guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide)
- [Google Search Central - JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- [Google Search Central - Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central - AI features and website controls](https://developers.google.com/search/docs/appearance/ai-features)
- [Google Search Central - Structured data guidelines](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- [Google Online Security blog - AI threats in the wild](https://security.googleblog.com/2026/04/ai-threats-in-wild-current-state-of.html)
- [web.dev - INP CWV announcement](https://web.dev/blog/inp-cwv-march-12)
- [Bing Webmaster - IndexNow](https://www.bing.com/indexnow)
- [OpenAI bots documentation](https://platform.openai.com/docs/bots)
- [OpenAI publishers and developers FAQ](https://help.openai.com/en/articles/12627856-publishers-and-developers-faq)
- [Perplexity bots documentation](https://docs.perplexity.ai/guides/bots)
- [llms.txt proposal](https://llmstxt.org/)

### 9.2 行业研究报告

- [Ahrefs - AI brand visibility correlations (75k brands)](https://ahrefs.com/blog/ai-brand-visibility-correlations/)
- [Ahrefs - ChatGPT has 12% of Google's search volume](https://ahrefs.com/blog/chatgpt-has-12-percent-of-googles-search-volume/)
- [DigitalApplied - AI citation visibility audit (500 SaaS sites)](https://www.digitalapplied.com/blog/ai-citation-visibility-audit-500-saas-sites-2026)
- [DigitalApplied - Google March 2026 spam update analysis](https://www.digitalapplied.com/blog/scaled-content-abuse-google-march-update-ai-pages-decimated)
- [Otterly - AI Citations Report 2026 (1M citations)](https://otterly.ai/blog/the-ai-citations-report-2026/)
- [Profound - AI platform citation patterns](https://www.tryprofound.com/blog/ai-platform-citation-patterns)
- [Wellows - Social media in AI citations report 2026](https://wellows.com/blog/social-media-ai-citations-report-2026/)
- [Wellows - Google AI Overviews ranking factors](https://wellows.com/blog/google-ai-overviews-ranking-factors/)
- [Arvow - AI Overviews & AI Mode statistics 2026](https://arvow.com/blog/ai-overviews-ai-mode-statistics-2026)
- [EMarketer - GEO/AEO FAQ 2026](https://www.emarketer.com/content/faq-on-geo-aeo--where-ai-search-seo-overlap-2026)
- [5W - AI Platform Citation Source Index 2026](https://www.prnewswire.com/news-releases/5w-releases-ai-platform-citation-source-index-2026-the-50-websites-that-now-decide-what-brands-are-visible-inside-chatgpt-claude-perplexity-gemini-and-google-ai-overviews-302759804.html)
- [SaaS Intelligence - Reddit's AI citation share grew 73%](https://saasintelligence.substack.com/p/reddits-ai-citation-share-just-grew)

### 9.3 Schema / 技术 SEO

- [Soar Agency - Schema markup for AI citations 2026](https://www.soar.sh/blog/schema-markup-ai-citations-2026)
- [Frase - FAQ schema for AEO/GEO](https://www.frase.io/blog/faq-schema-ai-search-geo-aeo)
- [Search Engine Land - Schema markup in AI search](https://searchengineland.com/schema-markup-ai-search-no-hype-472339)
- [SEO Component - Google ignoring priority/changefreq](https://www.seocomponent.com/blog/ignore-priority-changefreq-fields-sitemap/)
- [IdeaFueled - Core Web Vitals 2026 explained](https://ideafueled.com/blog/core-web-vitals-2026-explained/)
- [Logos Web Designs - Core Web Vitals March 2026](https://logoswebdesigns.com/blog/core-web-vitals-2026-march-update/)
- [Pressonify - IndexNow & instant indexing 2026](https://pressonify.ai/blog/indexnow-instant-indexing-press-releases-2026)

### 9.4 AI 爬虫与 robots.txt

- [No Hacks - 2026 AI user-agent landscape](https://nohacks.co/blog/ai-user-agents-landscape-2026)
- [aicarma - robots.txt for AI](https://aicarma.com/blog/robots-txt-for-ai/)
- [SEJ - Anthropic Claude bots make robots.txt decisions more granular](https://www.searchenginejournal.com/anthropics-claude-bots-make-robots-txt-decisions-more-granular/568253/)
- [Am I Cited - llms.txt overhyped or essential](https://www.amicited.com/blog/llms-txt-truth-overhyped-or-essential/)
- [AEO Engine - llms.txt zero usage analysis](https://aeoengine.ai/blog/llms-txt-zero-usage-ai-bots-ignore)

### 9.5 竞品 / 类目分析

- [Plate Lunch - 24-platform AEO tools comparison](https://www.platelunchcollective.com/aeo-tools-analysis-10-platforms-compared-beyond-marketing-materials-because-youve-been-searching-for-them/)
- [Rankability - 22 best AI search visibility tools](https://www.rankability.com/blog/best-ai-search-visibility-tracking-tools/)

### 9.6 转化 / B2B SaaS 基准

- [SaaS Hero - Landing page design trust signals](https://www.saashero.net/design/landing-page-design-trust-signals/)
- [GrowthSpree - B2B SaaS conversion rate benchmarks 2026](https://www.growthspreeofficial.com/blogs/b2b-saas-conversion-rate-benchmarks-2026-funnel-stage-vertical)
- [Powered By Search - B2B SaaS trial conversion rate benchmarks](https://www.poweredbysearch.com/learn/b2b-saas-trial-conversion-rate-benchmarks/)
- [GrowLeads - Enterprise trials vs demos](https://growleads.io/blog/b2b-saas-trials-vs-demo-sales-conversion/)
- [Stratabeat - SaaS link building](https://stratabeat.com/saas-link-building/)
- [SEOBoostr - SaaS link building 2026](https://www.seoboostr.com/blog/how-saas-link-building-has-changed-and-what-actually-works-in-2026)

### 9.7 反模式 / 风险

- [SEOMediaWorld - Parasite SEO 2026](https://seomediaworld.com/parasite-seo-in-2026-risks-and-strategy/)
- [Search Engine Land - AI buttons risky GEO tactic](https://searchengineland.com/ai-buttons-474137)
- [All About AI - Bing GEO abuse category update](https://www.allaboutai.com/ai-news/bing-updates-official-guidelines-adds-geo-and-broadens-ai-abuse-definitions/)

### 9.8 实体 / 权威建设

- [The Wikipedia Ground Truth (Medium)](https://medium.com/@tommy_81972/the-wikipedia-ground-truth-masterminding-entity-authority-in-the-age-of-ai-search-99304e25e16c)

---

## 10. 附录

### 10.1 推荐 robots.txt 完整版本

```
# Mainstream search
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: DuckDuckBot
Allow: /

# AI search / retrieval (allow for visibility)
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: DuckAssistBot
Allow: /

User-agent: Google-CloudVertexBot
Allow: /

User-agent: MistralAI-User
Allow: /

# AI training (SolCrys allows for category-awareness benefit)
User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

User-agent: Amazonbot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: CCBot
Allow: /

# Social
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

# Catch-all
User-agent: *
Allow: /

Sitemap: https://solcrys.com/sitemap.xml
```

### 10.2 SoftwareApplication 完整 schema 模板

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "SolCrys AI",
  "applicationCategory": "BusinessApplication",
  "applicationSubCategory": "Marketing Technology",
  "operatingSystem": "Web",
  "url": "https://solcrys.com",
  "description": "...",
  "softwareVersion": "1.0",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "availability": "https://schema.org/PreOrder",
    "url": "https://solcrys.com/pricing/"
  },
  "featureList": [
    "Prompt-level AI visibility tracking",
    "Citation and competitor share-of-voice analysis",
    "Answer accuracy and hallucination risk monitoring",
    "Multi-engine coverage (ChatGPT, Perplexity, Gemini, Claude, AIO)",
    "Content gap to action mapping"
  ],
  "screenshot": "https://solcrys.com/og/dashboard-screenshot.png",
  "audience": {
    "@type": "Audience",
    "audienceType": "Marketing teams"
  },
  "publisher": {
    "@type": "Organization",
    "name": "SolCrys AI",
    "sameAs": [
      "https://www.linkedin.com/company/solcrys-ai",
      "https://www.wikidata.org/wiki/QXXXXXX",
      "https://www.crunchbase.com/organization/solcrys-ai"
    ]
  }
}
```

### 10.3 Person schema 修订模板

```json
{
  "@type": "Person",
  "name": "Gwen Chen",
  "jobTitle": "Co-Founder & CEO",
  "description": "Previously at [Company], where she shipped [specific project]. AI search and GTM strategy for marketing teams transitioning from rankings to answer visibility.",
  "sameAs": [
    "https://www.linkedin.com/in/gwenchenx/",
    "https://www.wikidata.org/wiki/QXXXXXX"
  ],
  "worksFor": {
    "@type": "Organization",
    "name": "SolCrys AI"
  },
  "alumniOf": [
    {
      "@type": "EducationalOrganization",
      "name": "[University]"
    }
  ],
  "knowsAbout": [
    "Answer Engine Optimization",
    "AI search visibility",
    "B2B GTM strategy"
  ]
}
```

### 10.4 发布前验证 checklist

每次结构性 SEO/AEO 改动前后跑一遍：

**本地构建**：
```bash
npm run build
npm test
npm run lint
```

**静态输出检查**：
```bash
find dist -maxdepth 2 -type f | sort
```

**关键 URL HTTP 状态**：
```bash
curl -I https://solcrys.com/
curl -I https://solcrys.com/resources/
curl -I https://solcrys.com/answer-engine-optimization/
curl -I https://solcrys.com/sitemap.xml
curl -I https://solcrys.com/llms.txt
curl -I https://solcrys.com/robots.txt
```

**HTML 内容检查**（每个重要 URL）：
- [ ] H1 在原始 HTML 里
- [ ] 直接答案在原始 HTML 里
- [ ] canonical URL 正确
- [ ] JSON-LD 存在且 valid JSON
- [ ] 内部链接用规范的 trailing-slash 路由
- [ ] 没有页面依赖 GitHub Pages SPA fallback
- [ ] OG image URL 不带 hash 且唯一
- [ ] sitemap lastmod 反映真实修改日期

**外部验证**（部署后）：
- [ ] Google Search Console 提交 / 检查 URL
- [ ] Bing Webmaster Tools 提交 sitemap + IndexNow ping
- [ ] Google Rich Results Test 验证 JSON-LD
- [ ] URL Inspection 确认 Google 看到的内容与用户一致
- [ ] PageSpeed Insights 检查 INP / LCP / CLS
- [ ] 监控 crawl errors 和 indexing status

### 10.5 内容质量规则（继承自 [seo-aeo-methodology.md §7](seo-aeo-methodology.md) + 新增）

继承：
- 在解释产品前先回答用户的问题
- 用具体名词替代模糊营销话术
- 让实体关系清晰：SolCrys AI、AEO 平台、品牌可见性、AI 答案引擎
- 比较放进表格，操作步骤放进有序列表
- FAQ 简洁直接可答
- 不为关键词变体生成大量近重复页面
- updated date 准确
- schema 与可见内容对齐
- 创始人 / 团队 bio 锚定在可验证过往经历

新增（基于 2026 调研）：
- **每个 cluster 页加一个数据 / 统计**（直接引用 +37%、统计事实 +22%）
- **每个对比类 section 命名具体竞品**（ChatGPT +51%）
- **answer-format H2**（"What is X? How does X work?"）（+22%）
- **避免 "AI buttons" / 隐藏 prompt** 给爬虫看的内容（OWASP 2026 #1）
- **公开方法论** > 隐藏（AEO 类目独有的信任问题）

---

## 文档维护

- **版本**：1.1（2026-05-02 加入实施进度）
- **变更日志**：
  - **1.0**（2026-05-02）：首次发布，完整调研 + 策略 + 路线图
  - **1.1**（2026-05-02）：P0 第一波站内技术修补全部落地，加 §0.5 实施进度，inline 标注每个 P0 状态
- **下次重大复审**：2026-08（季度）或重大算法更新后
- **小修小改**：直接 PR 到本文件，更新文档日期
- **关联文档同步**：[site-plan.md](site-plan.md) 已实施部分将随下次结构变化同步更新；[seo-aeo-methodology.md](seo-aeo-methodology.md) 中的 founder credentials 规则待获得真实过往数据后兑现
