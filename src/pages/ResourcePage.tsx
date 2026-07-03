import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight, ArrowUpRight, CalendarDays, HelpCircle, User } from "lucide-react";
import { Fragment, ReactNode, useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

type ResourcePageData = (typeof siteContent.resourcePages)[number];
type ResourceSectionData = ResourcePageData["sections"][number];
type ResourceSubsection = { heading: string; body: string[]; bullets?: string[] };

// Matches either a markdown link [text](url) or **bold** segment.
// Bold uses a non-greedy capture so adjacent bold spans don't merge.
const INLINE_TOKEN_REGEX = /\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+?)\*\*/g;

const renderInline = (text: string): ReactNode => {
  if (!text.includes("](") && !text.includes("**")) return text;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let keyIndex = 0;
  for (const match of text.matchAll(INLINE_TOKEN_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) {
      nodes.push(text.slice(lastIndex, start));
    }
    if (match[1] !== undefined && match[2] !== undefined) {
      // Link: [text](url)
      nodes.push(
        <a
          key={`lnk-${keyIndex++}`}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[hsl(var(--brand-accent))] underline-offset-4 hover:underline"
        >
          {match[1]}
        </a>
      );
    } else if (match[3] !== undefined) {
      // Bold: **text**
      nodes.push(
        <strong key={`b-${keyIndex++}`} className="font-semibold text-foreground">
          {match[3]}
        </strong>
      );
    }
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes.map((node, idx) => <Fragment key={`f-${idx}`}>{node}</Fragment>);
};

interface ResourcePageProps {
  slug?: string;
}

const renderSubsection = (subsection: ResourceSubsection) => (
  <div key={subsection.heading} className="mt-6 first:mt-7">
    <h3 className="font-display text-lg font-semibold text-foreground mb-3">{subsection.heading}</h3>
    <div className="space-y-3 text-muted-foreground leading-relaxed">
      {subsection.body.map((paragraph) => (
        <p key={paragraph}>{renderInline(paragraph)}</p>
      ))}
    </div>
    {subsection.bullets ? (
      <ul className="mt-4 grid gap-2">
        {subsection.bullets.map((item) => (
          <li
            key={item}
            className="rounded-lg border border-border/30 bg-card/30 p-3 text-sm text-muted-foreground"
          >
            {renderInline(item)}
          </li>
        ))}
      </ul>
    ) : null}
  </div>
);

const renderSection = (section: ResourceSectionData) => {
  const subsections = ("subsections" in section ? section.subsections : undefined) as
    | ResourceSubsection[]
    | undefined;

  return (
    <section key={section.heading} className="border-t border-border/30 py-10">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">{section.heading}</h2>
      <div className="space-y-4 text-muted-foreground leading-relaxed">
        {section.body.map((paragraph) => (
          <p key={paragraph}>{renderInline(paragraph)}</p>
        ))}
      </div>
      {"bullets" in section && section.bullets ? (
        <ul className="mt-6 grid gap-3">
          {section.bullets.map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border/30 bg-card/40 p-4 text-sm text-muted-foreground"
            >
              {renderInline(item)}
            </li>
          ))}
        </ul>
      ) : null}
      {"table" in section && section.table ? (
        <div className="mt-7 overflow-x-auto rounded-xl border border-border/30">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="bg-card/60">
              <tr>
                {section.table.headers.map((header) => (
                  <th key={header} className="px-4 py-3 font-semibold text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {section.table.rows.map((row) => (
                <tr key={row.join("-")} className="border-t border-border/30">
                  {row.map((cell) => (
                    <td key={cell} className="px-4 py-3 text-muted-foreground align-top">
                      {renderInline(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
      {subsections && subsections.length > 0 ? (
        <div className="mt-2">{subsections.map(renderSubsection)}</div>
      ) : null}
    </section>
  );
};

const ResourcePage = ({ slug: configuredSlug }: ResourcePageProps) => {
  const { slug: routeSlug } = useParams();
  const activeSlug = configuredSlug ?? routeSlug;
  const page = siteContent.resourcePages.find((item) => item.slug === activeSlug);

  const isDraft = page ? (page as { status?: string }).status === "draft" : false;

  useEffect(() => {
    if (!page) return;
    document.title = isDraft ? `[DRAFT] ${page.metaTitle}` : page.metaTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = page.description;
    }
    // Drafts: set noindex,nofollow so a client-side navigation also flips robots correctly.
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) {
      robots.content = isDraft
        ? "noindex,nofollow"
        : "index,follow,max-image-preview:large";
    }
  }, [page, isDraft]);

  if (!page) {
    return <NotFound />;
  }

  // Drafts are excluded from "Related guides" cross-links.
  const explicitRelated =
    "relatedSlugs" in page && Array.isArray(page.relatedSlugs)
      ? (page.relatedSlugs as string[])
          .map((relatedSlug) =>
            siteContent.resourcePages.find((item) => item.slug === relatedSlug)
          )
          .filter((item): item is ResourcePageData => Boolean(item))
          .filter((item) => (item as { status?: string }).status !== "draft")
      : [];
  // Explicit relatedSlugs render in full — they are the internal-linking
  // surface that keeps pages from being orphans, so capping them silently
  // drops declared links. The no-declaration fallback stays capped at 3.
  const related =
    explicitRelated.length > 0
      ? explicitRelated
      : siteContent.resourcePages
          .filter((item) => item.slug !== page.slug)
          .filter((item) => (item as { status?: string }).status !== "draft")
          .slice(0, 3);

  const aeoTargets =
    "aeoTargets" in page && Array.isArray(page.aeoTargets) ? (page.aeoTargets as string[]) : [];

  const sources =
    "sources" in page && Array.isArray(page.sources)
      ? (page.sources as { label: string; url: string }[])
      : [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <article className="container mx-auto px-6 max-w-4xl">
          {isDraft ? (
            <div className="mb-6 rounded-lg border border-amber-500/40 bg-amber-500/10 p-4 text-amber-200">
              <p className="text-xs font-semibold uppercase tracking-[0.15em] mb-1">
                Draft — internal preview
              </p>
              <p className="text-sm leading-relaxed">
                This article is not listed on /resources/, not in the sitemap,
                and not indexed by search engines or AI crawlers. Share the
                direct URL with reviewers only. Promote to publication by
                removing <code className="font-mono text-xs">"status": "draft"</code>{" "}
                from this page's entry in <code className="font-mono text-xs">siteContent.json</code>.
              </p>
            </div>
          ) : null}
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/resources/" className="hover:text-foreground">
              Resources
            </a>
            <span className="mx-2">/</span>
            <span>{page.title}</span>
          </nav>

          <header className="mb-12">
            <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-4">
              {page.category}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{page.h1}</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{renderInline(page.summary)}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {"author" in page && page.author ? (
                <>
                  <span className="flex items-center gap-2.5">
                    {"photoUrl" in page.author && page.author.photoUrl ? (
                      <img
                        src={page.author.photoUrl}
                        alt={page.author.name}
                        width={32}
                        height={32}
                        loading="lazy"
                        className="h-8 w-8 rounded-full object-cover ring-1 ring-border/40"
                      />
                    ) : (
                      <User className="h-4 w-4" />
                    )}
                    <span className="leading-tight">
                      By{" "}
                      {page.author.linkedin ? (
                        <a
                          href={page.author.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-foreground font-medium hover:text-[hsl(var(--brand-accent))] transition-colors"
                        >
                          {page.author.name}
                        </a>
                      ) : (
                        <span className="text-foreground font-medium">{page.author.name}</span>
                      )}
                      {page.author.role ? `, ${page.author.role}` : null}
                    </span>
                  </span>
                  <span className="text-border" aria-hidden="true">·</span>
                </>
              ) : null}
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {"published" in page && page.published && page.published !== page.updated
                  ? `Published ${page.published} · Updated ${page.updated}`
                  : `Updated ${page.updated}`}
              </span>
            </div>
          </header>

          {aeoTargets.length > 0 ? (
            <section className="mb-10 rounded-xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.04)] p-6">
              <div className="flex items-center gap-2 mb-3">
                <HelpCircle className="h-4 w-4 text-[hsl(var(--brand-accent))]" />
                <p className="text-xs font-medium tracking-wider uppercase text-[hsl(var(--brand-accent))]">
                  Questions this guide answers
                </p>
              </div>
              <ul className="grid gap-2">
                {aeoTargets.map((q) => (
                  <li key={q} className="text-sm md:text-base text-muted-foreground">
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {page.sections.map(renderSection)}

          {sources.length > 0 ? (
            <section className="border-t border-border/30 py-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Sources</h2>
              <ul className="grid gap-3">
                {sources.map((source) => (
                  <li key={source.url}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-start gap-2 rounded-lg border border-border/30 bg-card/40 p-4 text-sm text-muted-foreground transition-colors hover:border-[hsl(var(--brand-accent)/0.35)] hover:text-foreground"
                    >
                      <span className="leading-relaxed">{source.label}</span>
                      <ArrowUpRight className="h-4 w-4 mt-0.5 shrink-0 text-[hsl(var(--brand-accent))] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {"faqs" in page && Array.isArray(page.faqs) && page.faqs.length > 0 ? (
            <section className="border-t border-border/30 py-10">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">FAQ</h2>
              <div className="grid gap-4">
                {page.faqs.map((faq) => (
                  <article key={faq.question} className="rounded-xl border border-border/30 bg-card/40 p-5">
                    <h3 className="font-display text-lg font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground leading-relaxed">{renderInline(faq.answer)}</p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}

          <section className="border-t border-border/30 py-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Related guides</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((item) => (
                <a
                  key={item.slug}
                  href={`/${item.slug}/`}
                  className="group rounded-xl border border-border/30 bg-card/40 p-5 transition-colors hover:border-[hsl(var(--brand-accent)/0.35)]"
                >
                  <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                    {item.category}
                  </p>
                  <h3 className="font-display font-semibold mb-3 group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                    Read guide
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </a>
              ))}
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcePage;
