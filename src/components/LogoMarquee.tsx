import { CUSTOMER_LOGOS, type CustomerLogo } from "./customerLogos";

/**
 * Infinite, seamless horizontal logo marquee for the homepage hero trust bar.
 *
 * Why a marquee: with 10 customer logos a static row wraps to 2–3 uneven lines
 * in the centered container. A single slow-scrolling row keeps it to one clean
 * line, scales as more customers are added, and matches the page's existing
 * auto-advancing quote carousel.
 *
 * Seamlessness: the track holds TWO identical copies and animates
 * translateX 0 → -50% (see the `marquee` keyframe in tailwind.config). Each copy
 * owns its trailing gap via `pr-*` so the wrap point is gap-perfect.
 *
 * Accessibility: pauses on hover, and `motion-reduce` swaps the animation for a
 * calm static wrap (respects prefers-reduced-motion / WCAG 2.2.2). The second
 * copy is aria-hidden so screen readers read the list once.
 */
const renderLogo = (logo: CustomerLogo, key: string) =>
  logo.image ? (
    <img
      key={key}
      src={logo.image}
      alt={logo.label}
      className={`${logo.className ?? "h-5 md:h-6"} w-auto shrink-0 opacity-70`}
      loading="lazy"
    />
  ) : (
    <span
      key={key}
      className="shrink-0 font-heading text-lg font-semibold tracking-tight opacity-70 md:text-xl"
      style={{ color: logo.color }}
    >
      {logo.label}
    </span>
  );

const Row = ({ copy }: { copy: "a" | "b" }) => (
  <div
    aria-hidden={copy === "b" || undefined}
    className="flex shrink-0 items-center gap-x-10 pr-10 md:gap-x-16 md:pr-16"
  >
    {CUSTOMER_LOGOS.map((logo, i) => renderLogo(logo, `${copy}-${i}`))}
  </div>
);

const LogoMarquee = () => (
  <div className="group relative w-full overflow-hidden [-webkit-mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)] [mask-image:linear-gradient(to_right,transparent,#000_8%,#000_92%,transparent)]">
    {/* Animated seamless track — hidden when the user prefers reduced motion. */}
    <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:hidden">
      <Row copy="a" />
      <Row copy="b" />
    </div>

    {/* Reduced-motion fallback: a calm, centered, static wrap. */}
    <div className="hidden flex-wrap items-center justify-center gap-x-10 gap-y-4 motion-reduce:flex">
      {CUSTOMER_LOGOS.map((logo, i) => renderLogo(logo, `static-${i}`))}
    </div>
  </div>
);

export default LogoMarquee;
