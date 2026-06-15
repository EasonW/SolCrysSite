import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import newsroom from "@/content/newsroom.json";
import { ArrowRight, CalendarDays } from "lucide-react";
import { useEffect } from "react";

const News = () => {
  useEffect(() => {
    document.title = "Newsroom | SolCrys";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content =
        "Announcements, founder notes, and company news from SolCrys — the AEO operating system for brands in AI search.";
    }
  }, []);

  const posts = [...newsroom.posts].sort((a, b) => {
    if (a.date === b.date) return 0;
    return a.date < b.date ? 1 : -1;
  });
  const kindLabels = newsroom.kindLabels as Record<string, string>;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-4">
            Newsroom
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Announcements and notes from SolCrys.
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl leading-relaxed mb-12">
            Press releases, founder notes, and updates from the team building the AEO operating
            system for brands in AI search.
          </p>

          <div className="grid gap-6">
            {posts.map((post) => (
              <a
                key={post.slug}
                href={`/news/${post.slug}/`}
                className="group rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-7 transition-all duration-300 hover:border-[hsl(var(--brand-accent)/0.35)] hover:-translate-y-0.5"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-flex items-center rounded-full border border-[hsl(var(--brand-accent)/0.35)] bg-[hsl(var(--brand-accent)/0.08)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[hsl(var(--brand-accent))]">
                    {kindLabels[post.kind] ?? post.kind}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <time dateTime={post.date}>
                      {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                  </span>
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold mb-3 group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">{post.dek}</p>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--brand-accent))]">
                  Read
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </a>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default News;
