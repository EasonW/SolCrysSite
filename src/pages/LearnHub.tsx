import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { courses, coursePath, totalLessons } from "@/lib/course";
import { ArrowRight, BookOpen, Clock, Layers } from "lucide-react";

const LearnHub = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-20">
        <section className="container mx-auto px-6 max-w-5xl">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-4">
            Learn
          </p>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Free courses on Answer Engine Optimization
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl mb-4">
            Self-paced, open, and free to read in full — no login, no email
            gate, no paywall. The hands-on labs run on a free SolCrys account
            with no credit card.
          </p>
          <p className="text-base text-muted-foreground leading-relaxed max-w-3xl">
            We publish these openly on purpose. A platform that argues for
            measurable, verifiable AEO and then locks its own teaching material
            behind a paid tier is arguing against itself.
          </p>
        </section>

        <section className="container mx-auto px-6 max-w-5xl mt-14">
          <div className="grid grid-cols-1 gap-6">
            {courses.map((course) => (
              <article
                key={course.slug}
                className="rounded-2xl border border-border/60 bg-card/40 p-8 hover:border-[hsl(var(--brand-accent)/0.45)] transition-colors"
              >
                <p className="text-[11px] uppercase tracking-wider font-semibold text-[hsl(var(--brand-accent))] mb-3">
                  Self-paced course · Free
                </p>
                <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                  <a href={coursePath(course.slug)} className="hover:underline underline-offset-4">
                    {course.title}
                  </a>
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6 max-w-3xl">
                  {course.tagline}
                </p>

                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground mb-7">
                  <span className="inline-flex items-center gap-1.5">
                    <Layers className="h-4 w-4" />
                    {course.modules.length} modules · {totalLessons(course)} lessons
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    ~{course.estimatedMinutes} min of reading
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    {course.level}
                  </span>
                </div>

                <Button asChild variant="hero" size="lg">
                  <a href={coursePath(course.slug)}>
                    Start the course
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default LearnHub;
