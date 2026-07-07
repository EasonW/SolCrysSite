/**
 * Single source of truth for the customer logo wall.
 *
 * Shared by the homepage hero trust bar (rendered as a marquee via
 * [[LogoMarquee]] in HeroSection) and the static wall in
 * CustomerTestimonialSection. New customers go HERE, in one place, so the two
 * surfaces can never drift apart.
 *
 * `className` carries the per-logo sizing + dark-mode treatment. Most logos
 * are dark artwork on the default light background and use
 * `dark:brightness-0 dark:invert` to flatten to white if dark mode is ever
 * enabled — matching the existing UiPath/NextSilicon/Wyze/ClearlyKept logos.
 * `color` is only used as the text colour for image-less entries (e.g. BOBOYM).
 * Note: `w-auto` is added by the renderer, not here.
 *
 * `featured` marks the curated subset shown as a calm STATIC strip in the
 * homepage hero (motion is kept out of the hero message zone). The full list
 * scrolls in the lower Customer Stories wall via [[LogoMarquee]].
 */
export type CustomerLogo = {
  label: string;
  image?: string;
  className?: string;
  color?: string;
  featured?: boolean;
};

export const CUSTOMER_LOGOS: CustomerLogo[] = [
  { label: "UiPath", image: "/customers/uipath-logo.svg", className: "h-7", color: "#FA4616", featured: true },
  { label: "NextSilicon", image: "/customers/nextsilicon-logo.svg", className: "h-4 md:h-5 invert dark:invert-0", color: "#5700FF", featured: true },
  { label: "Wyze", image: "/customers/wyze-logo.png", className: "h-5 md:h-6", color: "#00D4B4", featured: true },
  { label: "ClearlyKept", image: "/customers/clearlykept-logo.png", className: "h-5 md:h-6 dark:brightness-0 dark:invert", color: "#F59E0B", featured: true },
  { label: "Verbatim", image: "/customers/verbatim-logo.svg", className: "h-5 md:h-6 dark:brightness-0 dark:invert", color: "#FF4040", featured: true },
  { label: "Headley Media", image: "/customers/headley-logo.png", className: "h-6 md:h-7 dark:brightness-0 dark:invert", color: "#14517D" },
  { label: "Acorn Stairlifts", image: "/customers/acorn-logo.png", className: "h-6 md:h-7 dark:brightness-0 dark:invert", color: "#8B0030" },
  { label: "CLW Group", image: "/customers/clw-logo.png", className: "h-6 md:h-7 dark:brightness-0 dark:invert", color: "#D81E06" },
  { label: "TechArena", image: "/customers/techarena-logo.svg", className: "h-4 md:h-5 dark:brightness-0 dark:invert", color: "#00C4D3" },
  { label: "BOBOYM", color: "#FB923C" },
];

/** Curated subset for the static hero trust strip (no motion). */
export const FEATURED_LOGOS = CUSTOMER_LOGOS.filter((logo) => logo.featured);
