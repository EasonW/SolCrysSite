import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import siteContent from "@/content/siteContent.json";
import { AUDIT_URL } from "@/lib/audit-cta";
import {
  coursePath,
  findLesson,
  getCourse,
  lessonPath,
  totalLessons,
} from "@/lib/course";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  FlaskConical,
  HelpCircle,
  Monitor,
} from "lucide-react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

interface LessonPageProps {
  courseSlug?: string;
  moduleSlug?: string;
  lessonSlug?: string;
}

const resourceBySlug = new Map(
  siteContent.resourcePages.map((p) => [p.slug, p] as const),
);

const LessonPage = ({
  courseSlug: courseSlugProp,
  moduleSlug: moduleSlugProp,
  lessonSlug: lessonSlugProp,
}: LessonPageProps) => {
  const params = useParams();
  const courseSlug = courseSlugProp ?? params.courseSlug;
  const moduleSlug = moduleSlugProp ?? params.moduleSlug;
  const lessonSlug = lessonSlugProp ?? params.lessonSlug;

  const course = courseSlug ? getCourse(courseSlug) : undefined;
  const found =
    course && moduleSlug && lessonSlug
      ? findLesson(course, moduleSlug, lessonSlug)
      : undefined;

  if (!course || !found) return <NotFound />;

  const { flat, prev, next } = found;
  const { module, lesson, position } = flat;
  const total = totalLessons(course);

  const related = lesson.readNext
    .map((slug) => resourceBySlug.get(slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <article className="container mx-auto px-6 max-w-3xl">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <a href="/learn/" className="hover:text-foreground">
              Learn
            </a>
            <span className="mx-2">/</span>
            <a href={coursePath(course.slug)} className="hover:text-foreground">
              {course.title}
            </a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{module.title}</span>
          </nav>

          {/* Progress */}
          <div className="flex items-center gap-3 mb-5">
            <span className="text-xs font-mono text-[hsl(var(--brand-accent))]">
              {module.number}
            </span>
            <div
              className="h-1 flex-1 rounded-full bg-border/50 overflow-hidden"
              role="progressbar"
              aria-valuenow={position}
              aria-valuemin={1}
              aria-valuemax={total}
              aria-label={`Lesson ${position} of ${total}`}
            >
              <div
                className="h-full bg-[hsl(var(--brand-accent))]"
                style={{ width: `${(position / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {position} / {total}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
            {lesson.title}
          </h1>

          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground mb-8">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {lesson.minutes} min
            </span>
            {lesson.lab && (
              <span className="inline-flex items-center gap-1.5">
                <FlaskConical className="h-4 w-4" />
                Includes a lab
              </span>
            )}
          </div>

          <p className="text-lg text-foreground/90 leading-relaxed mb-12 pl-5 border-l-2 border-[hsl(var(--brand-accent)/0.5)]">
            {lesson.summary}
          </p>

          {/* Concept sections */}
          <div className="space-y-12">
            {lesson.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-display text-2xl font-semibold tracking-tight mb-4">
                  {section.heading}
                </h2>
                <div className="space-y-4">
                  {section.body.map((p, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-5 space-y-2.5">
                    {section.bullets.map((b) => (
                      <li
                        key={b}
                        className="text-muted-foreground leading-relaxed pl-5 relative before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-[hsl(var(--brand-accent))]"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Where this lives in the product */}
          {lesson.product && (
            <section className="mt-14 rounded-2xl border border-border/60 bg-card/40 p-7">
              <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                <Monitor className="h-4 w-4" />
                In the product
              </p>
              <h2 className="font-display text-lg font-semibold mb-4">
                {lesson.product.heading}
              </h2>
              <ul className="space-y-2.5">
                {lesson.product.steps.map((s) => (
                  <li key={s} className="text-muted-foreground leading-relaxed text-[15px]">
                    {s}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Lab */}
          {lesson.lab && (
            <section className="mt-8 rounded-2xl border border-[hsl(var(--brand-accent)/0.35)] bg-[hsl(var(--brand-accent)/0.05)] p-7">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--brand-accent))]">
                  <FlaskConical className="h-4 w-4" />
                  Lab
                </p>
                {lesson.lab.requiresAccount && (
                  <span className="text-[11px] uppercase tracking-wider font-semibold rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                    Free account needed
                  </span>
                )}
                <span className="text-[11px] uppercase tracking-wider font-semibold rounded-full border border-border/60 px-2.5 py-1 text-muted-foreground">
                  {lesson.lab.quota}
                </span>
              </div>
              <h2 className="font-display text-lg font-semibold mb-4">
                {lesson.lab.title}
              </h2>
              <ol className="space-y-3 list-decimal pl-5 marker:text-[hsl(var(--brand-accent))] marker:font-semibold">
                {lesson.lab.steps.map((s) => (
                  <li key={s} className="text-foreground/90 leading-relaxed text-[15px] pl-1">
                    {s}
                  </li>
                ))}
              </ol>
              {lesson.lab.note && (
                <p className="text-sm text-muted-foreground leading-relaxed mt-5 pt-5 border-t border-border/40">
                  {lesson.lab.note}
                </p>
              )}
              {lesson.lab.requiresAccount && (
                <div className="mt-6">
                  <Button asChild variant="hero" size="sm">
                    <a href={AUDIT_URL}>
                      Start Free
                      <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </a>
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    Free plan, no credit card.
                  </p>
                </div>
              )}
            </section>
          )}

          {/* Self-check */}
          {lesson.check.length > 0 && (
            <section className="mt-14">
              <h2 className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight mb-4">
                <HelpCircle className="h-5 w-5 text-[hsl(var(--brand-accent))]" />
                Check yourself
              </h2>
              <ul className="space-y-3">
                {lesson.check.map((q) => (
                  <li
                    key={q}
                    className="text-muted-foreground leading-relaxed pl-5 relative before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-border"
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Read next — canonical depth lives on the resource pages */}
          {related.length > 0 && (
            <section className="mt-14">
              <h2 className="inline-flex items-center gap-2 font-display text-xl font-semibold tracking-tight mb-2">
                <BookOpen className="h-5 w-5 text-[hsl(var(--brand-accent))]" />
                Go deeper
              </h2>
              <p className="text-sm text-muted-foreground mb-5">
                This lesson is the spine. These guides are the depth.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {related.map((page) => (
                  <a
                    key={page.slug}
                    href={`/${page.slug}/`}
                    className="rounded-xl border border-border/50 bg-card/40 p-4 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors group"
                  >
                    <p className="text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                      {page.category}
                    </p>
                    <p className="font-medium text-foreground leading-snug group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                      {page.title}
                    </p>
                  </a>
                ))}
              </div>
            </section>
          )}

          {/* Prev / next */}
          <nav
            className="mt-16 pt-8 border-t border-border/40 grid grid-cols-1 sm:grid-cols-2 gap-4"
            aria-label="Lesson navigation"
          >
            {prev ? (
              <a
                href={lessonPath(course.slug, prev.module.slug, prev.lesson.slug)}
                className="rounded-xl border border-border/50 bg-card/40 p-5 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors group"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Previous
                </span>
                <span className="block font-medium text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  {prev.lesson.title}
                </span>
              </a>
            ) : (
              <a
                href={coursePath(course.slug)}
                className="rounded-xl border border-border/50 bg-card/40 p-5 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors group"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to
                </span>
                <span className="block font-medium text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  Course overview
                </span>
              </a>
            )}
            {next ? (
              <a
                href={lessonPath(course.slug, next.module.slug, next.lesson.slug)}
                className="rounded-xl border border-border/50 bg-card/40 p-5 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors group sm:text-right"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 sm:justify-end sm:w-full">
                  Next
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="block font-medium text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  {next.lesson.title}
                </span>
              </a>
            ) : (
              <a
                href={coursePath(course.slug)}
                className="rounded-xl border border-border/50 bg-card/40 p-5 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors group sm:text-right"
              >
                <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-semibold text-muted-foreground mb-1.5 sm:justify-end sm:w-full">
                  Finished
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="block font-medium text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                  Back to course overview
                </span>
              </a>
            )}
          </nav>
        </article>
      </main>
      <Footer />
    </div>
  );
};

export default LessonPage;
