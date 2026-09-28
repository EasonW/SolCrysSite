import { useEffect, useState } from "react";

/**
 * PREVIEW — cycles through a short list of words in place. All words share
 * one grid cell, so the line keeps the width of the longest word and nothing
 * around it shifts. Screen readers get the full list once; under
 * prefers-reduced-motion the first word stays put.
 */
const RotatingWord = ({ words, intervalMs = 2400 }: { words: string[]; intervalMs?: number }) => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % words.length), intervalMs);
    return () => window.clearInterval(id);
  }, [words.length, intervalMs]);

  return (
    <>
      <span className="sr-only">{words.join(", ")}</span>
      <span aria-hidden="true" className="inline-grid text-left align-baseline">
        {words.map((word, i) => (
          <span
            key={word}
            className={`[grid-area:1/1] font-semibold text-[hsl(var(--brand-accent-ink))] transition-all duration-500 ease-out motion-reduce:transition-none ${
              i === index ? "translate-y-0 opacity-100" : i === (index + words.length - 1) % words.length ? "-translate-y-2 opacity-0" : "translate-y-2 opacity-0"
            }`}
          >
            {word}
          </span>
        ))}
      </span>
    </>
  );
};

export default RotatingWord;
