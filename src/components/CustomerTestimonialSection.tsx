import { ArrowRight } from "lucide-react";
import CustomerQuoteCarousel, { type CustomerQuote } from "@/components/CustomerQuoteCarousel";
import LogoMarquee from "./LogoMarquee";

const WYZE_TEAL = "#00D4B4";
const NEXTSILICON_INDIGO = "#5700FF";
const CLEARLYKEPT_AMBER = "#F59E0B";
const BOBOYM_ORANGE = "#FB923C";
const UIPATH_ORANGE = "#FA4616";
const TECHARENA_CYAN = "#00C4D3";

const BOBOYM_AMAZON_STORE =
  "https://www.amazon.com/BOBOYM-20-Inch-Expandable-Suitcase-360%C2%B0Rolling/dp/B0FXWHWTXN/";

const CUSTOMER_QUOTES: CustomerQuote[] = [
  {
    name: "Maria Voloh",
    role: "Sr. Director, Global Digital Marketing",
    company: "UiPath",
    photoUrl: "/customers/maria-voloh.jpg",
    companyLogoUrl: "/customers/uipath-logo.svg",
    companyLogoClassName: "h-7",
    accent: UIPATH_ORANGE,
    quote:
      "We've been trying out SolCrys AI for a while now, and the MCP feature lets us pull visibility insights on citations, gaps, and monthly action plans — it also recommends next steps in our optimization journey. We can then turn the insights straight into content. We're excited to keep partnering with the SolCrys team to unlock even more of our presence across AI answer engines.",
    attribution: { type: "linkedin", href: "https://www.linkedin.com/in/mariavoloh/" },
  },
  {
    name: "Brandon Draeger",
    role: "VP of Marketing",
    company: "NextSilicon",
    photoUrl: "/customers/brandon-draeger.jpg",
    companyLogoUrl: "/customers/nextsilicon-logo.svg",
    companyLogoClassName: "h-4 md:h-5 invert dark:invert-0",
    accent: NEXTSILICON_INDIGO,
    quote:
      "For the first time, we have clear, system-level visibility into marketing performance — paired with a platform that continuously optimizes it. SolCrys is informing how we think about marketing performance across product launches, campaigns, and major events.",
    attribution: { type: "linkedin", href: "https://www.linkedin.com/in/brandondraeger/" },
  },
  {
    name: "Kari Newhouse",
    role: "Head of Digital",
    company: "TechArena",
    photoUrl: "/customers/kari-newhouse.jpg",
    companyLogoUrl: "/customers/techarena-logo.svg",
    companyLogoClassName: "h-4 md:h-5 dark:brightness-0 dark:invert",
    accent: TECHARENA_CYAN,
    quote:
      "SolCrys AI has been the tool we rely on to advise our own customers — it consistently uncovers opportunities we wouldn't have found ourselves. It hasn't just improved our AI visibility; it's helped us explain why AI is becoming the new buying interface. We use many tools, but we've never worked with a vendor as invested in our success as SolCrys.",
    attribution: { type: "linkedin", href: "https://www.linkedin.com/in/kari-newhouse/" },
  },
  {
    name: "Yun Zhang",
    role: "CEO",
    company: "Wyze",
    photoUrl: "/customers/yun-zhang.jpg",
    companyLogoUrl: "/customers/wyze-logo.png",
    companyLogoClassName: "h-5 md:h-6",
    accent: WYZE_TEAL,
    quote:
      "SolCrys gives us a better understanding of how Wyze appears across AI engines and where we can improve visibility and trust. We're excited to work with the SolCrys team as they build toward the future of brand discovery and agentic commerce.",
    attribution: { type: "linkedin", href: "https://www.linkedin.com/in/yun-zhang-1441933" },
  },
  {
    name: "Michelle Frees",
    role: "Head of Amazon",
    company: "Wyze",
    photoUrl: "/customers/michelle-frees.jpg",
    companyLogoUrl: "/customers/wyze-logo.png",
    companyLogoClassName: "h-5 md:h-6",
    accent: WYZE_TEAL,
    quote:
      "SolCrys AI has become a trusted growth partner for our team. What's been most impressive is how they've elevated our approach to PDP content — taking it to a level of precision and impact we hadn't thought possible.",
    attribution: { type: "linkedin", href: "https://www.linkedin.com/in/michellewangfrees/" },
  },
  {
    name: "Garrett Astler",
    role: "Co-founder",
    company: "ClearlyKept",
    photoUrl: "/customers/garrett-astler.jpg",
    companyLogoUrl: "/customers/clearlykept-logo.png",
    companyLogoClassName: "h-5 md:h-6 dark:brightness-0 dark:invert",
    accent: CLEARLYKEPT_AMBER,
    quote:
      "SolCrys' citation data is one of the most exciting features for us. It gives us clearer, more actionable insights than traditional social listening tools. As a startup owner, I'm also impressed by their MCP support — being able to quickly pull our visibility score, identify gaps, and draft content for our website is exactly what we need.",
    attribution: {
      type: "linkedin",
      href: "https://www.linkedin.com/in/ACoAAAzCAM8B_4zaQelFta2ZX-vhiQRMG2QBCYg",
    },
  },
  {
    name: "Jed Li",
    role: "Founder",
    company: "BOBOYM",
    photoUrl: "/customers/jed-li.jpg",
    accent: BOBOYM_ORANGE,
    quote:
      "SolCrys gave us a much clearer view of the potential for our store across emerging AI shopping channels — Amazon Rufus, Alexa for Shopping, and other AI engines. For the first time, we can see where our products show up, where we are missing, and what needs to improve.",
    attribution: { type: "amazon", href: BOBOYM_AMAZON_STORE },
  },
  {
    name: "Toni Iafrate",
    role: "Chief Communications Officer",
    company: "Company withheld",
    photoUrl: "/customers/toni-iafrate.jpg",
    quote:
      "What stood out to me about SolCrys is that it goes beyond just showing data. Most tools stop at dashboards and metrics, but SolCrys helps teams understand what the data means and what actions to take next.",
    attribution: { type: "withheld" },
  },
];

const CustomerTestimonialSection = () => {
  return (
    <section className="relative py-20 md:py-28 section-fade overflow-hidden">
      {/* Ambient glow behind the quote card — two soft blurred blobs (the
          site's standard glow idiom) instead of a fixed-height wash band,
          which clipped into a visible horizontal stripe once this section
          moved and grew a trailing NVIDIA strip. */}
      <div
        className="absolute left-[8%] top-[34%] -translate-y-1/2 w-[460px] h-[460px] max-w-[45vw] rounded-full blur-[150px] pointer-events-none"
        style={{ backgroundColor: `${NEXTSILICON_INDIGO}1A` }}
      />
      <div
        className="absolute right-[8%] top-[34%] -translate-y-1/2 w-[420px] h-[420px] max-w-[42vw] rounded-full blur-[140px] pointer-events-none"
        style={{ backgroundColor: `${WYZE_TEAL}17` }}
      />

      <div className="container mx-auto px-6 max-w-5xl relative">
        <div className="flex flex-col items-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Customer Stories
          </p>
          <h2 className="font-heading text-3xl md:text-4xl text-foreground text-center max-w-3xl">
            Trusted across enterprise software, AI infrastructure, and consumer brands.
          </h2>
        </div>

        <CustomerQuoteCarousel quotes={CUSTOMER_QUOTES} intervalMs={8000} minHeight="340px" />

        {/* CTA to full case studies */}
        <div className="mt-8 flex justify-center">
          <a
            href="/customers/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground hover:opacity-80 transition-opacity"
          >
            Read the full case studies
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        {/* Logo wall — the full customer set as a seamless marquee. This is the
            page's single moving logo strip, placed below the hero copy and the
            quote carousel so the motion never competes with primary messaging.
            No label here: the "Customer Stories" kicker + H2 + case-studies link
            above already frame it, and it avoids a second "Trusted by". */}
        <div className="mt-10 pt-8 border-t border-border/20">
          <LogoMarquee />
        </div>

        {/* NVIDIA Inception — slim recognition strip. Was a full-width section
            of its own; a program badge is a trust signal, not a chapter of the
            story, so it lives inside the proof zone. Badge stays on white per
            NVIDIA brand guidelines. */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 text-center sm:text-left">
          <a
            href="https://www.nvidia.com/en-us/startups/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NVIDIA Inception Program member page"
            className="shrink-0 rounded-lg bg-white px-3 py-2 shadow-[0_1px_2px_rgba(0,0,0,0.06)]"
          >
            <img
              src="/nvidia-inception-badge.jpg"
              alt="Member of NVIDIA Inception Program"
              width={140}
              height={70}
              loading="lazy"
              className="h-auto w-[140px] max-w-full block"
            />
          </a>
          <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
            Member of the NVIDIA Inception Program — supporting the AI
            infrastructure behind prompt-level AEO measurement, recommendation
            and visibility tracking, and answer-accuracy monitoring.
          </p>
        </div>
      </div>
    </section>
  );
};

export default CustomerTestimonialSection;
