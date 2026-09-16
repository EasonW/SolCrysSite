import { Link, useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import { ArrowDownToLine, ArrowLeft, ArrowRight, ExternalLink, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import userGuides from "@/content/userGuides.json";
import userGuideText from "@/content/userGuideText.json";
import NotFound from "@/pages/NotFound";

const UserGuide = () => {
  const { guideSlug } = useParams();
  const [searchParams] = useSearchParams();
  const guide = userGuides.guides.find((item) => item.slug === guideSlug);
  useEffect(() => {
    if (!guide) return;
    document.title = `${guide.title} — User Guide | SolCrys`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = guide.description;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = `https://solcrys.com/guides/${guide.slug}/`;
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) robots.content = "index,follow,max-image-preview:large";
  }, [guide]);
  useEffect(() => {
    if (searchParams.has("page")) {
      document.getElementById("document-preview")?.scrollIntoView({ block: "start" });
    }
  }, [searchParams, guideSlug]);
  if (!guide) return <NotFound />;
  const companion = userGuides.guides.find((item) => item.slug !== guide.slug);
  const requestedPage = Number(searchParams.get("page") || 1);
  const pageNumber = Number.isInteger(requestedPage) && requestedPage >= 1 && requestedPage <= guide.pages ? requestedPage : 1;
  const currentChapter = guide.chapters.find((chapter) => chapter.page === pageNumber);
  const pageHref = (page: number) => `/guides/${guide.slug}/?page=${page}#document-preview`;
  const pageText = userGuideText[guide.slug as keyof typeof userGuideText]?.[pageNumber - 1];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="container mx-auto max-w-6xl px-6 pb-20 pt-28 md:pt-32">
        <nav aria-label="Breadcrumb" className="mb-8 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <a href="/resources/" className="hover:text-foreground">Resources</a><span aria-hidden="true">/</span>
          <a href="/guides/" className="hover:text-foreground">User guides</a><span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground">{guide.title}</span>
        </nav>
        <header className="max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[hsl(var(--brand-accent-ink))]">Guide {guide.number} · {guide.category}</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{guide.title}</h1>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{guide.description}</p>
          <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><FileText className="h-4 w-4" aria-hidden="true" />PDF · {guide.pages} pages · {guide.fileSize} · {userGuides.edition}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="hero" className="rounded-lg"><a href={guide.pdf} target="_blank" rel="noopener noreferrer">Open PDF <ExternalLink aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></Button>
            <Button asChild variant="hero-outline" className="rounded-lg"><a href={guide.pdf} download><ArrowDownToLine aria-hidden="true" />Download PDF</a></Button>
          </div>
        </header>
        <aside className="my-8 rounded-xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.05)] p-5 text-sm leading-relaxed" aria-label="Before you start"><strong className="font-semibold">Before you start. </strong><span className="text-muted-foreground">{guide.beforeYouStart}</span></aside>
        <div className="grid items-start gap-8 lg:grid-cols-[280px_1fr]">
          <section aria-labelledby="contents-heading" className="order-2 lg:order-1">
            <h2 id="contents-heading" className="text-lg font-semibold">In this guide</h2>
            <p className="mb-4 mt-2 text-xs leading-relaxed text-muted-foreground">Choose a chapter to jump to that page.</p>
            <ol className="divide-y divide-border/10 border-y border-border/15">
              {guide.chapters.map((chapter) => (
                <li key={chapter.page}><Link to={pageHref(chapter.page)} aria-current={pageNumber === chapter.page ? "page" : undefined} className={`group flex items-start gap-3 py-3 text-sm leading-snug hover:text-[hsl(var(--brand-accent-ink))] ${pageNumber === chapter.page ? "font-medium text-[hsl(var(--brand-accent-ink))]" : ""}`} aria-label={`${chapter.title}, page ${chapter.page}`}><span className="w-5 shrink-0 pt-0.5 font-mono text-[11px] text-muted-foreground">{String(chapter.page).padStart(2, "0")}</span><span>{chapter.title}</span></Link></li>
              ))}
            </ol>
          </section>
          <section id="document-preview" aria-labelledby="preview-heading" className="order-1 min-w-0 scroll-mt-24 overflow-hidden rounded-xl border border-border/15 bg-muted/40 lg:order-2">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/10 px-4 py-3">
              <h2 id="preview-heading" className="text-sm font-medium">Document preview</h2>
              <nav aria-label="Document pages" className="flex items-center gap-3 text-sm">
                {pageNumber > 1 ? <Link to={pageHref(pageNumber - 1)} className="rounded-md p-2 hover:bg-muted" aria-label="Previous page"><ArrowLeft className="h-4 w-4" /></Link> : <span aria-hidden="true" className="p-2 text-muted-foreground/30"><ArrowLeft className="h-4 w-4" /></span>}
                <span aria-live="polite" aria-atomic="true" className="text-xs text-muted-foreground">Page {pageNumber} of {guide.pages}</span>
                {pageNumber < guide.pages ? <Link to={pageHref(pageNumber + 1)} className="rounded-md p-2 hover:bg-muted" aria-label="Next page"><ArrowRight className="h-4 w-4" /></Link> : <span aria-hidden="true" className="p-2 text-muted-foreground/30"><ArrowRight className="h-4 w-4" /></span>}
              </nav>
            </div>
            <img key={pageNumber} src={`/guides/${guide.slug}/page-${String(pageNumber).padStart(2, "0")}.jpg`} alt={`${guide.title}, page ${pageNumber}: ${currentChapter?.title ?? "Guide page"}. Text is available below the preview.`} width={1061} height={1500} className="h-auto w-full bg-white" />
            {pageText && <details key={`text-${pageNumber}`} className="border-t border-border/10 px-5 py-4"><summary className="cursor-pointer text-sm font-medium">Read page {pageNumber} as text</summary><div className="mt-4 whitespace-pre-line break-words text-sm leading-relaxed text-muted-foreground">{pageText}</div></details>}
            <p className="border-t border-border/10 px-5 py-4 text-xs leading-relaxed text-muted-foreground">For zoom, printing, or a full-screen view, <a href={`${guide.pdf}#page=${pageNumber}`} target="_blank" rel="noopener noreferrer" className="font-medium text-foreground underline underline-offset-2">open the PDF in a new tab</a>.</p>
          </section>
        </div>
        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-muted-foreground">Interface examples use fictional brands, people, and results. Available controls depend on your role, plan, and workspace type.</p>
        <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-t border-border/15 pt-8">
          <a href="/guides/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" aria-hidden="true" />All user guides</a>
          {companion && <a href={`/guides/${companion.slug}/`} className="group text-sm"><span className="mb-1 block text-xs text-muted-foreground">{guide.number === "01" ? "Next: put your results to work" : "Need to configure your workspace?"}</span><span className="inline-flex items-center gap-2 font-medium text-[hsl(var(--brand-accent-ink))] group-hover:underline">{companion.title}<ArrowRight className="h-4 w-4" aria-hidden="true" /></span></a>}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default UserGuide;
