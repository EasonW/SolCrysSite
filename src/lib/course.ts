/**
 * Typed accessors over `src/content/courseContent.json`.
 *
 * Courses live in their OWN content file (not `siteContent.resourcePages`)
 * because a lesson is not a resource page:
 *   - resource pages render at ROOT `/<slug>/`; lessons render under
 *     `/learn/<course>/<module>/<lesson>/` and must not pollute the flat
 *     root namespace or the /resources/ index.
 *   - lessons carry ORDER (module → lesson sequence, prev/next). Resource
 *     pages have no ordering field.
 *   - the JSON-LD differs: Course, not WebPage + FAQPage.
 *
 * The separation is also editorial: resource pages are the citation surface,
 * the course is an activation surface. A lesson deliberately carries only the
 * spine (concept → product steps → lab → self-check) and links OUT to the
 * canonical resource page for depth, so the two never compete for the same
 * primary keyword. See 17_learn_course/solcrys_course_design_2026-08-05.md §3.4.
 */
import courseContent from "@/content/courseContent.json";

export type CourseSection = {
  heading: string;
  body: string[];
  bullets?: string[];
};

export type CourseLab = {
  title: string;
  requiresAccount: boolean;
  quota: string;
  steps: string[];
  note?: string;
};

export type CourseProduct = {
  heading: string;
  steps: string[];
};

export type Lesson = {
  slug: string;
  title: string;
  minutes: number;
  summary: string;
  sections: CourseSection[];
  product: CourseProduct | null;
  lab: CourseLab | null;
  check: string[];
  readNext: string[];
};

export type CourseModule = {
  slug: string;
  number: string;
  title: string;
  blurb: string;
  lessons: Lesson[];
};

export type Course = {
  slug: string;
  title: string;
  tagline: string;
  metaTitle: string;
  description: string;
  h1: string;
  summary: string;
  ogImage: string;
  published: string;
  updated: string;
  provider: string;
  level: string;
  estimatedMinutes: number;
  audience: string[];
  outcomes: string[];
  requirements: string[];
  labBudget: {
    heading: string;
    intro: string;
    rows: string[][];
    note: string;
  };
  faqs: { question: string; answer: string }[];
  modules: CourseModule[];
};

export const courses = courseContent.courses as unknown as Course[];
export const coursesUpdated = courseContent.updated as string;

export const getCourse = (slug: string): Course | undefined =>
  courses.find((c) => c.slug === slug);

/** Flat, ordered walk of every lesson in a course — the spine for prev/next. */
export type FlatLesson = {
  module: CourseModule;
  lesson: Lesson;
  /** 1-based position across the whole course. */
  position: number;
};

export const flattenLessons = (course: Course): FlatLesson[] => {
  const out: FlatLesson[] = [];
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      out.push({ module, lesson, position: out.length + 1 });
    }
  }
  return out;
};

export const lessonPath = (
  courseSlug: string,
  moduleSlug: string,
  lessonSlug: string,
): string => `/learn/${courseSlug}/${moduleSlug}/${lessonSlug}/`;

export const coursePath = (courseSlug: string): string => `/learn/${courseSlug}/`;

export const findLesson = (
  course: Course,
  moduleSlug: string,
  lessonSlug: string,
): { flat: FlatLesson; prev: FlatLesson | null; next: FlatLesson | null } | undefined => {
  const flat = flattenLessons(course);
  const idx = flat.findIndex(
    (f) => f.module.slug === moduleSlug && f.lesson.slug === lessonSlug,
  );
  if (idx === -1) return undefined;
  return {
    flat: flat[idx],
    prev: idx > 0 ? flat[idx - 1] : null,
    next: idx < flat.length - 1 ? flat[idx + 1] : null,
  };
};

export const totalLessons = (course: Course): number =>
  course.modules.reduce((n, m) => n + m.lessons.length, 0);
