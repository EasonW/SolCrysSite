import { ArrowRight } from "lucide-react";

const WYZE_TEAL = "#00D4B4";

const quote =
  "SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce.";

const CustomerTestimonialSection = () => {
  return (
    <section className="relative py-24 md:py-32 section-fade overflow-hidden">
      <div
        className="absolute inset-x-0 top-1/4 h-72 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${WYZE_TEAL}1F, transparent 60%)`,
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative">
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-4">
            Customer Story
          </p>
          <img
            src="/customers/wyze-logo.png"
            alt="Wyze"
            className="h-8 md:h-9 w-auto"
            loading="lazy"
          />
        </div>

        <article className="relative rounded-3xl border border-border/40 bg-card/60 backdrop-blur-sm overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              background: `linear-gradient(to right, transparent, ${WYZE_TEAL}, transparent)`,
            }}
          />

          <div className="grid md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] gap-0">
            <div className="relative bg-muted/30 overflow-hidden min-h-[320px] md:min-h-[440px]">
              <img
                src="/customers/yun-zhang.jpg"
                alt="Yun Zhang, CEO of Wyze"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute top-4 left-4">
                <span
                  className="inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white"
                  style={{ backgroundColor: WYZE_TEAL }}
                >
                  CEO
                </span>
              </div>
            </div>

            <div className="p-8 md:p-12 lg:p-14 flex flex-col justify-center">
              <div
                aria-hidden
                className="font-heading text-7xl leading-none mb-2 select-none"
                style={{ color: WYZE_TEAL, opacity: 0.5 }}
              >
                “
              </div>
              <blockquote className="font-heading text-xl md:text-2xl lg:text-[1.5rem] leading-snug md:leading-[1.35] text-foreground">
                {quote}
              </blockquote>

              <figcaption className="mt-8 pt-6 border-t border-border/40 flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                  <div
                    className="h-10 w-1 rounded-full"
                    style={{ backgroundColor: WYZE_TEAL }}
                  />
                  <div>
                    <p className="font-heading text-base font-semibold text-foreground">
                      Yun Zhang
                    </p>
                    <p className="text-sm text-muted-foreground">CEO, Wyze</p>
                    <a
                      href="https://www.linkedin.com/in/yun-zhang-1441933"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      aria-label="Yun Zhang on LinkedIn"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn
                    </a>
                  </div>
                </div>
                <a
                  href="/customers/"
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
                >
                  Read the full story
                  <ArrowRight className="h-4 w-4" />
                </a>
              </figcaption>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
};

export default CustomerTestimonialSection;
