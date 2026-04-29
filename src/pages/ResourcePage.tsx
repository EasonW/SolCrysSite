import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import siteContent from "@/content/siteContent.json";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

type ResourcePageData = (typeof siteContent.resourcePages)[number];
type ResourceSectionData = ResourcePageData["sections"][number];

interface ResourcePageProps {
  slug?: string;
}

const renderSection = (section: ResourceSectionData) => (
  <section key={section.heading} className="border-t border-border/30 py-10">
    <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-5">{section.heading}</h2>
    <div className="space-y-4 text-muted-foreground leading-relaxed">
      {section.body.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
    {"bullets" in section && section.bullets ? (
      <ul className="mt-6 grid gap-3">
        {section.bullets.map((item) => (
          <li key={item} className="rounded-lg border border-border/30 bg-card/40 p-4 text-sm text-muted-foreground">
            {item}
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
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : null}
  </section>
);

const ResourcePage = ({ slug: configuredSlug }: ResourcePageProps) => {
  const { slug: routeSlug } = useParams();
  const activeSlug = configuredSlug ?? routeSlug;
  const page = siteContent.resourcePages.find((item) => item.slug === activeSlug);

  useEffect(() => {
    if (!page) return;
    document.title = page.metaTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = page.description;
    }
  }, [page]);

  if (!page) {
    return <NotFound />;
  }

  const related = siteContent.resourcePages.filter((item) => item.slug !== page.slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <article className="container mx-auto px-6 max-w-4xl">
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
            <p className="text-sm font-medium text-[hsl(195_90%_55%)] tracking-wider uppercase mb-4">
              {page.category}
            </p>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{page.h1}</h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{page.summary}</p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>Updated {page.updated}</span>
            </div>
          </header>

          {page.sections.map(renderSection)}

          <section className="border-t border-border/30 py-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">FAQ</h2>
            <div className="grid gap-4">
              {page.faqs.map((faq) => (
                <article key={faq.question} className="rounded-xl border border-border/30 bg-card/40 p-5">
                  <h3 className="font-display text-lg font-semibold mb-3">{faq.question}</h3>
                  <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="border-t border-border/30 py-10">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-6">Related guides</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {related.map((item) => (
                <a
                  key={item.slug}
                  href={`/${item.slug}/`}
                  className="group rounded-xl border border-border/30 bg-card/40 p-5 transition-colors hover:border-[hsl(195_90%_55%/0.35)]"
                >
                  <h3 className="font-display font-semibold mb-3 group-hover:text-[hsl(195_90%_55%)] transition-colors">
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
