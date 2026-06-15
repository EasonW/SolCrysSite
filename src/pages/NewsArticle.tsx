import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import newsroom from "@/content/newsroom.json";
import { AUDIT_URL, trackAuditClick } from "@/lib/audit-cta";
import gwenImg from "@/assets/gwen-chen.jpg";
import easonImg from "@/assets/eason-wang.jpg";
import jiaImg from "@/assets/jia-chang.jpg";
import { ArrowLeft, ArrowRight, CalendarDays, Linkedin } from "lucide-react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

type NewsPost = (typeof newsroom.posts)[number];
type BodyBlock = NewsPost["body"][number];

// Maps a person's display name → image asset path. Existing hero
// images live under public/news/ (RJ); founder photos are Vite imports
// so the bundler hashes them like everywhere else they're used (AboutUs).
const personPhoto: Record<string, string> = {
  "Raejeanne Skillern": "/news/raejeanne-skillern.png",
  "Gwen Chen": gwenImg,
  "Eason Wang": easonImg,
  "Jia Chang": jiaImg,
};

const formatDate = (iso: string) =>
  new Date(iso + "T00:00:00").toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const renderBlock = (block: BodyBlock, index: number) => {
  switch (block.type) {
    case "heading":
      return (
        <h2
          key={index}
          className="font-display text-2xl md:text-3xl font-semibold tracking-tight mt-12 mb-4"
        >
          {block.text}
        </h2>
      );
    case "subheading":
      return (
        <h3
          key={index}
          className="font-display text-lg md:text-xl font-semibold text-foreground mt-8 mb-3"
        >
          {block.text}
        </h3>
      );
    case "quote":
      return (
        <figure
          key={index}
          className="my-8 rounded-2xl border border-[hsl(var(--brand-accent)/0.25)] bg-[hsl(var(--brand-accent)/0.04)] p-6 md:p-8"
        >
          <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
            “{block.text}”
          </blockquote>
          {("attribution" in block && block.attribution) ? (
            <figcaption className="mt-4 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{block.attribution}</span>
              {"role" in block && block.role ? (
                <span className="text-muted-foreground"> — {block.role}</span>
              ) : null}
            </figcaption>
          ) : null}
        </figure>
      );
    case "bullets":
      return (
        <ul key={index} className="my-5 grid gap-2">
          {("items" in block && Array.isArray(block.items) ? block.items : []).map((item) => (
            <li
              key={item}
              className="rounded-lg border border-border/30 bg-card/40 p-4 text-base text-muted-foreground leading-relaxed"
            >
              {item}
            </li>
          ))}
        </ul>
      );
    case "cta":
      // Prominent inline CTA. `href` may be absolute (e.g. app subdomain
      // for the audit funnel) or a same-site relative path; both work.
      // When the href matches AUDIT_URL we forward the click to the
      // existing GA tracker so launch-note conversions show up under
      // the same `request_audit_open` event as homepage CTAs.
      if (!("text" in block) || !("href" in block)) return null;
      return (
        <div key={index} className="my-8 flex justify-start">
          <a
            href={block.href}
            onClick={
              block.href === AUDIT_URL
                ? () => trackAuditClick("news_article")
                : undefined
            }
            className="group inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {block.text}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>
      );
    case "signatures":
      // Multi-author byline rendered at the END of a body. Used for
      // collective launch notes / founder updates signed by 2+ people.
      // (Distinct from the single `author` field rendered above the
      // dek for traditional founder notes.)
      if (!("authors" in block) || !Array.isArray(block.authors)) return null;
      return (
        <div
          key={index}
          className="mt-12 pt-8 border-t border-border/40 grid gap-6 sm:grid-cols-3"
        >
          {block.authors.map((author) => {
            const photo = personPhoto[author.name];
            return (
              <div key={author.name} className="flex items-start gap-3 text-sm">
                {photo ? (
                  <img
                    src={photo}
                    alt={author.name}
                    className="h-12 w-12 flex-none rounded-full object-cover border border-border/40"
                    loading="lazy"
                  />
                ) : null}
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{author.name}</p>
                  <p className="text-muted-foreground leading-snug mt-0.5">
                    {author.role}
                  </p>
                  {author.linkedin ? (
                    <a
                      href={author.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${author.name} on LinkedIn`}
                      className="mt-2 inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      );
    case "paragraph":
    default:
      return (
        <p key={index} className="text-base md:text-lg text-muted-foreground leading-relaxed mb-5">
          {("text" in block && block.text) || ""}
        </p>
      );
  }
};

interface NewsArticleProps {
  slug?: string;
}

const NewsArticle = ({ slug: configuredSlug }: NewsArticleProps) => {
  const { slug: routeSlug } = useParams();
  const activeSlug = configuredSlug ?? routeSlug;
  const post = newsroom.posts.find((item) => item.slug === activeSlug);

  useEffect(() => {
    if (!post) return;
    document.title = post.metaTitle;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) {
      description.content = post.description;
    }
  }, [post]);

  if (!post) {
    return <NotFound />;
  }

  const kindLabels = newsroom.kindLabels as Record<string, string>;
  const heroPhotoSrc =
    post.heroImage && post.heroImage.type === "person"
      ? personPhoto[post.heroImage.name]
      : undefined;

  const related = (post.relatedSlugs ?? [])
    .map((s) => newsroom.posts.find((p) => p.slug === s))
    .filter((p): p is NewsPost => Boolean(p));

  const isPressRelease = post.kind === "press-release";
  const author = "author" in post && post.author ? post.author : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <article className="container mx-auto px-6 max-w-3xl">
          <nav className="mb-8 text-sm text-muted-foreground">
            <a href="/" className="hover:text-foreground">
              Home
            </a>
            <span className="mx-2">/</span>
            <a href="/news/" className="hover:text-foreground">
              Newsroom
            </a>
            <span className="mx-2">/</span>
            <span>{post.title}</span>
          </nav>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <span className="inline-flex items-center rounded-full border border-[hsl(var(--brand-accent)/0.35)] bg-[hsl(var(--brand-accent)/0.08)] px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-[hsl(var(--brand-accent))]">
                {kindLabels[post.kind] ?? post.kind}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </span>
            </div>
            {isPressRelease ? (
              <p className="text-xs uppercase tracking-wider text-muted-foreground/80 mb-4">
                For Immediate Release
              </p>
            ) : null}
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight leading-tight mb-5">
              {post.title}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">{post.dek}</p>

            {author ? (
              <div className="mt-6 flex items-center gap-3 text-sm text-muted-foreground">
                {personPhoto[author.name] ? (
                  <img
                    src={personPhoto[author.name]}
                    alt={author.name}
                    className="h-11 w-11 flex-none rounded-full object-cover border border-border/40"
                    loading="lazy"
                  />
                ) : null}
                <span>
                  By <span className="font-medium text-foreground">{author.name}</span>,{" "}
                  {author.role}
                </span>
                {author.linkedin ? (
                  <a
                    href={author.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${author.name} on LinkedIn`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </header>

          {heroPhotoSrc && post.heroImage ? (
            <figure className="mb-10 overflow-hidden rounded-2xl border border-border/30 bg-card/30">
              <img
                src={heroPhotoSrc}
                alt={post.heroImage.alt}
                className="w-full h-auto object-cover"
                loading="eager"
              />
              <figcaption className="px-5 py-3 text-xs text-muted-foreground border-t border-border/30">
                <span className="font-medium text-foreground">{post.heroImage.name}</span>
                {post.heroImage.role ? ` — ${post.heroImage.role}` : ""}
              </figcaption>
            </figure>
          ) : null}

          {post.leadParagraph ? (
            <p className="text-lg md:text-xl text-foreground leading-relaxed mb-6 font-medium">
              {post.leadParagraph}
            </p>
          ) : null}

          <div className="prose-content">{post.body.map(renderBlock)}</div>

          {isPressRelease && "mediaContact" in post && post.mediaContact ? (
            <section className="mt-12 rounded-xl border border-border/40 bg-card/40 p-6">
              <p className="text-xs font-medium tracking-wider uppercase text-muted-foreground mb-3">
                Media Contact
              </p>
              <p className="text-sm text-foreground">
                <span className="font-medium">{post.mediaContact.name}</span> ·{" "}
                <a
                  href={`mailto:${post.mediaContact.email}`}
                  className="text-[hsl(var(--brand-accent))] hover:underline"
                >
                  {post.mediaContact.email}
                </a>
              </p>
            </section>
          ) : null}

          {"shareLinks" in post && post.shareLinks ? (
            <div className="mt-10 flex items-center gap-3 text-sm text-muted-foreground">
              <span>Share:</span>
              {post.shareLinks.linkedin ? (
                <a
                  href={post.shareLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              ) : null}
            </div>
          ) : null}

          {related.length > 0 ? (
            <section className="mt-16 border-t border-border/30 pt-10">
              <h2 className="text-xl md:text-2xl font-semibold tracking-tight mb-6">
                Related
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                {related.map((item) => (
                  <a
                    key={item.slug}
                    href={`/news/${item.slug}/`}
                    className="group rounded-xl border border-border/30 bg-card/40 p-5 transition-colors hover:border-[hsl(var(--brand-accent)/0.35)]"
                  >
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">
                      {kindLabels[item.kind] ?? item.kind}
                    </p>
                    <h3 className="font-display font-semibold mb-3 group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                      {item.title}
                    </h3>
                    <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                      Read
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                ))}
              </div>
            </section>
          ) : null}

          <div className="mt-12">
            <a
              href="/news/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Newsroom
            </a>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default NewsArticle;
