import type { ReactNode } from "react";
import homeContent from "@/content/homeContent.json";
import { AUDIT_URL } from "@/lib/audit-cta";

// FAQ answers may carry [text](url) links (same token format as resource
// pages). Links into the app or the site stay in-tab; other sites open in a
// new tab. scripts/prerender.mjs renders the same answers with renderInlineHtml.
const LINK_REGEX = /\[([^\]]+)\]\(([^)]+)\)/g;
const APP_HOST = new URL(AUDIT_URL).host;

const opensNewTab = (href: string): boolean => {
  try {
    return /^https?:\/\//.test(href) && new URL(href).host !== APP_HOST;
  } catch {
    return false;
  }
};

const renderAnswer = (text: string): ReactNode => {
  if (!text.includes("](")) return text;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  for (const match of text.matchAll(LINK_REGEX)) {
    const start = match.index ?? 0;
    if (start > lastIndex) nodes.push(text.slice(lastIndex, start));
    nodes.push(
      <a
        key={start}
        href={match[2]}
        {...(opensNewTab(match[2]) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="text-[hsl(var(--brand-accent-ink))] underline underline-offset-4 hover:text-foreground"
      >
        {match[1]}
      </a>,
    );
    lastIndex = start + match[0].length;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));
  return nodes;
};

const FAQSection = () => {
  return (
    <section id="faq" className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div className="container mx-auto px-6 max-w-4xl relative">
        <div className="text-center mb-14">
          <p className="text-sm font-medium text-[hsl(var(--brand-accent))] tracking-wider uppercase mb-3">
            Common Questions
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            Direct answers for AI discovery teams.
          </h2>
        </div>

        <div className="grid gap-4">
          {homeContent.home.faqs.map((item) => (
            <article key={item.question} className="rounded-xl border border-border/30 bg-card/40 backdrop-blur-sm p-6">
              <h3 className="font-display text-lg font-semibold mb-3">{item.question}</h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">{renderAnswer(item.answer)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
