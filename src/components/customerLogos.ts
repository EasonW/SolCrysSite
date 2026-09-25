/**
 * Single source of truth for the customer logo wall.
 *
 * Shared by the homepage hero trust bar (rendered as a marquee via
 * [[LogoMarquee]] in HeroSection) and the static wall in
 * CustomerTestimonialSection. New customers go HERE, in one place, so the two
 * surfaces can never drift apart.
 *
 * Every customer logo on the site renders in ONE colour: black on light,
 * white on dark, via [[LOGO_MONO]]. No logo keeps its brand colour, so no
 * single customer stands out in the strip. `className` is sizing ONLY; the
 * renderer adds LOGO_MONO and `w-auto`. Image-less entries (e.g. BOBOYM)
 * render as text in [[LOGO_MONO_TEXT]].
 *
 * `featured` marks the curated subset shown as a calm STATIC strip in the
 * homepage hero (motion is kept out of the hero message zone). The full list
 * scrolls in the lower Customer Stories wall via [[LogoMarquee]].
 */
export type CustomerLogo = {
  label: string;
  image?: string;
  className?: string;
  featured?: boolean;
};

/**
 * Flattens any logo artwork (colour, dark, or near-white like NextSilicon) to
 * a black silhouette, inverted to white in dark mode. Needs a transparent
 * background: an opaque one would turn into a solid block. Don't use it on a
 * logo sitting on a fixed white card; there it would go white-on-white in
 * dark mode.
 */
export const LOGO_MONO = "brightness-0 dark:invert";

/** Text-only logo in the same black/white as [[LOGO_MONO]]. */
export const LOGO_MONO_TEXT = "text-black dark:text-white";

export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { label: "UiPath", image: "/customers/uipath-logo.svg", className: "h-7", featured: true },
  { label: "NextSilicon", image: "/customers/nextsilicon-logo.svg", className: "h-4 md:h-5", featured: true },
  { label: "Cornelis", image: "/customers/cornelis-logo.png", className: "h-9 md:h-10", featured: true },
  { label: "Wyze", image: "/customers/wyze-logo.png", className: "h-5 md:h-6", featured: true },
  { label: "ClearlyKept", image: "/customers/clearlykept-logo.png", className: "h-5 md:h-6", featured: true },
  { label: "Verbatim", image: "/customers/verbatim-logo.svg", className: "h-5 md:h-6" },
  { label: "Headley Media", image: "/customers/headley-logo.png", className: "h-6 md:h-7" },
  { label: "Acorn Stairlifts", image: "/customers/acorn-logo.png", className: "h-6 md:h-7" },
  { label: "CLW Group", image: "/customers/clw-logo.png", className: "h-6 md:h-7" },
  { label: "TechArena", image: "/customers/techarena-logo.svg", className: "h-4 md:h-5", featured: true },
  { label: "BOBOYM" },
];

/** Curated subset for the static hero trust strip (no motion). */
export const FEATURED_LOGOS = CUSTOMER_LOGOS.filter((logo) => logo.featured);
