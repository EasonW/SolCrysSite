import { useEffect, useRef } from "react";

export function useScrollReveal() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const elements = containerRef.current?.querySelectorAll(".fade-in-scroll");
    if (!elements) return;

    if (
      !window.IntersectionObserver ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return containerRef;
}
