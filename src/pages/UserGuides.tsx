import { ArrowDownToLine, ArrowRight, BookOpen, Check, FileText } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import userGuides from "@/content/userGuides.json";

const UserGuides = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main id="main-content" className="pt-28 pb-20 md:pt-36">
      <section className="container mx-auto max-w-6xl px-6">
        <nav aria-label="Breadcrumb" className="mb-10 flex gap-2 text-xs text-muted-foreground">
          <a href="/resources/" className="hover:text-foreground">Resources</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page" className="text-foreground">User guides</span>
        </nav>
        <div className="grid gap-8 border-b border-border/15 pb-12 md:grid-cols-[1fr_260px] md:items-end">
          <div>
            <p className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[hsl(var(--brand-accent-ink))]">
              <BookOpen className="h-4 w-4" aria-hidden="true" /> SolCrys documentation
            </p>
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl md:leading-[1.08]">Your guide to SolCrys.</h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">From your first workspace to your weekly AEO review. Practical steps, interface examples, and answers when you need them.</p>
          </div>
          <div className="border-l-2 border-[hsl(var(--brand-accent-ink))] pl-5 text-sm">
            <p className="font-medium">A simple place to start</p>
            <p className="mt-2 leading-relaxed text-muted-foreground">Set up with guide 01.<br />Put your results to work with guide 02.</p>
            <p className="mt-4 text-xs text-muted-foreground">Free to read and download.</p>
          </div>
        </div>
      </section>

      <section aria-labelledby="library-heading" className="container mx-auto mt-10 max-w-6xl px-6">
        <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="library-heading" className="text-xl font-semibold">User guides <span className="ml-2 text-sm font-normal text-muted-foreground">{userGuides.guides.length} documents</span></h2>
          <p className="text-xs text-muted-foreground">{userGuides.edition} edition · PDF</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {userGuides.guides.map((guide) => (
            <article key={guide.slug} className="group overflow-hidden rounded-2xl border border-border/15 bg-card">
              <a href={`/guides/${guide.slug}/`} tabIndex={-1} aria-hidden="true" className="relative flex h-52 items-start justify-center overflow-hidden border-b border-border/10 bg-[hsl(var(--brand-accent)/0.06)] pt-7">
                <span className="absolute left-6 top-5 font-mono text-xs text-[hsl(var(--brand-accent-ink))]">GUIDE {guide.number}</span>
                <img src={guide.cover} alt="" width={636} height={900} className="mt-3 w-48 origin-top rotate-[-4deg] rounded-sm border border-black/10 shadow-floating-md transition-transform duration-300 group-hover:rotate-0 motion-reduce:transition-none" />
                <span className="absolute bottom-4 right-5 inline-flex items-center gap-1.5 rounded-full border border-border/10 bg-background px-3 py-1 text-xs text-muted-foreground"><FileText className="h-3 w-3" />{guide.pages} pages</span>
              </a>
              <div className="flex h-[calc(100%-13rem)] flex-col p-6 md:p-8">
                <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[hsl(var(--brand-accent-ink))]">{guide.category}</p>
                <h3 className="text-2xl font-semibold tracking-tight"><a href={`/guides/${guide.slug}/`} className="hover:underline underline-offset-4">{guide.title}</a></h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{guide.description}</p>
                <ul className="my-6 space-y-2.5 text-sm">
                  {guide.highlights.map((topic) => <li key={topic} className="flex items-center gap-2.5"><Check className="h-4 w-4 shrink-0 text-[hsl(var(--brand-accent-ink))]" aria-hidden="true" />{topic}</li>)}
                </ul>
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-4 border-t border-border/10 pt-5">
                  <Button asChild variant="hero" className="rounded-lg"><a href={`/guides/${guide.slug}/`}>Read guide <ArrowRight aria-hidden="true" /></a></Button>
                  <a href={guide.pdf} download className="inline-flex items-center gap-2 text-sm font-medium hover:underline underline-offset-4" aria-label={`Download ${guide.title} PDF`}><ArrowDownToLine className="h-4 w-4" aria-hidden="true" />Download PDF</a>
                  <span className="text-xs text-muted-foreground">{guide.fileSize}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-10 grid gap-6 border-t border-border/15 pt-8 sm:grid-cols-2">
          <div><h2 className="text-base font-semibold">Keep the guide beside your workspace.</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Open a chapter, follow along in SolCrys, or save the PDF for your team. Controls may vary by role, plan, and workspace type.</p><a href="https://app.solcrys.com/login" className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-accent-ink))] hover:underline">Open SolCrys <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></div>
          <div className="sm:pl-8"><h2 className="text-base font-semibold">Looking for the bigger picture?</h2><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Explore AEO strategy and measurement in our resource library, or work through the free AEO Operator course.</p><div className="mt-3 flex flex-wrap gap-5 text-sm font-medium text-[hsl(var(--brand-accent-ink))]"><a href="/resources/" className="hover:underline">Browse resources →</a><a href="/learn/aeo-operator/" className="hover:underline">Take the course →</a></div></div>
        </div>
      </section>
    </main>
    <Footer />
  </div>
);

export default UserGuides;
