import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  flattenLessons,
  getCourse,
  lessonPath,
  totalLessons,
} from "@/lib/course";
import { ArrowRight, CheckCircle2, Clock, FlaskConical, Users } from "lucide-react";
import { useParams } from "react-router-dom";
import NotFound from "./NotFound";

interface CoursePageProps {
  slug?: string;
}

const CoursePage = ({ slug: slugProp }: CoursePageProps) => {
  const params = useParams();
  const slug = slugProp ?? params.courseSlug;
  const course = slug ? getCourse(slug) : undefined;

  if (!course) return <NotFound />;

  const first = flattenLessons(course)[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        {/* Hero */}
        <section className="container mx-auto px-6 max-w-4xl">
          <nav className="text-sm text-muted-foreground mb-6" aria-label="Breadcrumb">
            <a href="/learn/" className="hover:text-foreground">
              Learn
            </a>
            <span className="mx-2">/</span>
            <span className="text-foreground">{course.title}</span>
          </nav>

          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-4">
            Free self-paced course
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-5">
            {course.h1}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            {course.tagline}
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-9">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />~{course.estimatedMinutes} min reading
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4" />
              {course.modules.length} modules · {totalLessons(course)} lessons
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4" />
              {course.level}
            </span>
          </div>

          {first && (
            <Button asChild variant="hero" size="lg">
              <a href={lessonPath(course.slug, first.module.slug, first.lesson.slug)}>
                Start the course
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          )}

          <p className="text-sm text-muted-foreground mt-4">
            Free to read in full — no login, no email required. Labs use a free
            SolCrys account, no credit card.
          </p>
        </section>

        {/* Summary */}
        <section className="container mx-auto px-6 max-w-4xl mt-16">
          <p className="text-lg text-foreground/90 leading-relaxed">
            {course.summary}
          </p>
        </section>

        {/* Outcomes + audience */}
        <section className="container mx-auto px-6 max-w-4xl mt-16 grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">
              What you will be able to do
            </h2>
            <ul className="space-y-3">
              {course.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-muted-foreground leading-relaxed">
                  <CheckCircle2 className="h-5 w-5 flex-none text-[hsl(var(--brand-accent))] mt-0.5" />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold mb-4">Who it is for</h2>
            <ul className="space-y-3">
              {course.audience.map((a) => (
                <li key={a} className="text-muted-foreground leading-relaxed">
                  {a}
                </li>
              ))}
            </ul>
            <h3 className="font-display text-base font-semibold mt-7 mb-3">
              What you need
            </h3>
            <ul className="space-y-2">
              {course.requirements.map((r) => (
                <li key={r} className="text-sm text-muted-foreground leading-relaxed">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Lab budget */}
        <section className="container mx-auto px-6 max-w-4xl mt-16">
          <div className="rounded-2xl border border-[hsl(var(--brand-accent)/0.35)] bg-[hsl(var(--brand-accent)/0.05)] p-7">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--brand-accent))] mb-3">
              <FlaskConical className="h-4 w-4" />
              The labs
            </p>
            <h2 className="font-display text-xl font-semibold mb-3">
              {course.labBudget.heading}
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              {course.labBudget.intro}
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <tbody>
                  {course.labBudget.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-border/40">
                      <td className="py-2.5 pr-4 font-medium whitespace-nowrap">{row[0]}</td>
                      <td className="py-2.5 pr-4 text-muted-foreground">{row[1]}</td>
                      <td className="py-2.5 text-muted-foreground whitespace-nowrap">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-muted-foreground mt-5 leading-relaxed">
              {course.labBudget.note}
            </p>
          </div>
        </section>

        {/* Syllabus */}
        <section className="container mx-auto px-6 max-w-4xl mt-16">
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8">
            Syllabus
          </h2>
          <div className="space-y-8">
            {course.modules.map((module) => (
              <div key={module.slug}>
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-sm font-mono text-[hsl(var(--brand-accent))]">
                    {module.number}
                  </span>
                  <h3 className="font-display text-xl font-semibold">{module.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4 leading-relaxed">{module.blurb}</p>
                <ol className="rounded-xl border border-border/50 divide-y divide-border/40 overflow-hidden">
                  {module.lessons.map((lesson) => (
                    <li key={lesson.slug}>
                      <a
                        href={lessonPath(course.slug, module.slug, lesson.slug)}
                        className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-card/60 transition-colors group"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium text-foreground group-hover:text-[hsl(var(--brand-accent))] transition-colors">
                            {lesson.title}
                          </span>
                          <span className="block text-sm text-muted-foreground mt-0.5">
                            {lesson.summary}
                          </span>
                        </span>
                        <span className="flex-none text-xs text-muted-foreground whitespace-nowrap">
                          {lesson.minutes} min
                          {lesson.lab ? " · lab" : ""}
                        </span>
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="container mx-auto px-6 max-w-4xl mt-16">
          <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8">
            Questions about the course
          </h2>
          <div className="space-y-7">
            {course.faqs.map((faq) => (
              <div key={faq.question}>
                <h3 className="font-display text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        {first && (
          <section className="container mx-auto px-6 max-w-4xl mt-16">
            <div className="rounded-2xl border border-border/60 bg-card/40 p-8 text-center">
              <h2 className="font-display text-2xl font-semibold mb-3">
                Start with Module {course.modules[0].number}
              </h2>
              <p className="text-muted-foreground mb-6">
                {course.modules[0].blurb}
              </p>
              <Button asChild variant="hero" size="lg">
                <a href={lessonPath(course.slug, first.module.slug, first.lesson.slug)}>
                  {first.lesson.title}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default CoursePage;
