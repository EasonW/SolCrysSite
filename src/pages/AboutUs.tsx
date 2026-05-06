import { useScrollReveal } from "@/hooks/useScrollReveal";
import FounderCard from "@/components/FounderCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gwenImg from "@/assets/gwen-chen.jpg";
import easonImg from "@/assets/eason-wang.jpg";
import jiaImg from "@/assets/jia-chang.jpg";
import siteContent from "@/content/siteContent.json";

const founders = [
  {
    image: gwenImg,
    initials: "GC",
    name: "Gwen Chen",
    title: "Co-Founder & CEO",
    background: "Ex-AWS · Ex-Google (AppSheet)",
    expertise: "Customer-driven B2B GTM; hosts the Signals podcast with marketing & growth leaders",
    linkedin: "https://www.linkedin.com/in/gwenchenx/",
  },
  {
    image: easonImg,
    initials: "EW",
    name: "Eason Wang",
    title: "Co-Founder & CPO",
    background: "Ex-Microsoft (since MSRA) · PhD in Machine Learning",
    expertise: "18+ years shipping enterprise products; focused on agentic AI workflows",
    linkedin: "https://www.linkedin.com/in/eason-wang/",
  },
  {
    image: jiaImg,
    initials: "JC",
    name: "Jia Chang",
    title: "Co-Founder & CTO",
    background: "Ex-Microsoft engineering leader",
    expertise: "14+ years architecting scalable data infrastructure — the backbone of AEO measurement",
    linkedin: "https://www.linkedin.com/in/jia-c/",
  },
];

const AboutUs = () => {
  const containerRef = useScrollReveal();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main ref={containerRef} className="text-foreground overflow-x-hidden pt-16">
        {/* Hero */}
        <section className="relative min-h-[80vh] flex items-center justify-center">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
            <p className="fade-in-scroll section-label mb-6">About SolCrys</p>
            <h1 className="fade-in-scroll font-heading text-4xl md:text-6xl font-bold leading-tight">
              AI search visibility and Answer Engine Optimization for marketing teams.
            </h1>
            <p className="fade-in-scroll mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SolCrys was built by search, growth, data, and product operators to help brands
              connect AI visibility measurement with evidence-backed content action.
            </p>
            <p className="fade-in-scroll mt-5 text-xs text-muted-foreground/80 uppercase tracking-wider">
              Maintained by {siteContent.site.maintainer} · Last updated{" "}
              <time dateTime={siteContent.site.updated}>{siteContent.site.updated}</time>
            </p>
          </div>
        </section>

        {/* Glow divider */}
        <div className="glow-line w-full" />

        {/* Story */}
        <section className="max-w-3xl mx-auto px-6 py-24">
          <p className="fade-in-scroll section-label mb-4">Our Story</p>
          <div className="fade-in-scroll space-y-6 text-base md:text-lg text-muted-foreground leading-relaxed">
            <p>
              Our background sits at the intersection of SEO, search intent, product discovery,
              and data-driven growth. AI-generated answers add a new distribution layer to that
              work: a brand can perform well in traditional search, yet still be absent,
              uncited, or misrepresented inside the answer a buyer sees first.
            </p>
            <p>
              Marketing teams now need to know which prompts matter, which sources AI systems
              cite, how competitors are framed, and how to establish topical authority across
              AI-visible sources.
            </p>
            <p>
              SolCrys was built to connect AI visibility measurement with practical content
              action. The platform helps teams monitor mentions, citations, share of voice,
              sentiment, and answer accuracy, then translate those findings into page updates,
              publisher and analyst content briefs, FAQ improvements, and user-generated content
              (UGC) strategies.
            </p>
            <p>
              Our focus is straightforward: help brands sharpen their content strategy so their
              content is easier for answer engines to retrieve, trust, cite, and summarize.
            </p>
          </div>
        </section>

        {/* Glow divider */}
        <div className="glow-line w-full" />

        {/* Founding Team */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <p className="fade-in-scroll section-label mb-4">Founding Team</p>
            <h2 className="fade-in-scroll font-heading text-3xl md:text-4xl text-foreground">
              Built by operators across AI search, product, and engineering
            </h2>
            <p className="fade-in-scroll mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              The founding team combines AI search strategy, product systems thinking, and AI
              architecture experience for the shift from rankings to answer visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founders.map((founder) => (
              <FounderCard key={founder.name} {...founder} />
            ))}
          </div>
        </section>

        {/* Glow divider */}
        <div className="glow-line w-full" />

        {/* Recognition */}
        <section className="max-w-4xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-[auto_1fr] items-center gap-10 md:gap-12">
            <div className="fade-in-scroll flex justify-center md:justify-start">
              <a
                href="https://www.nvidia.com/en-us/startups/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="NVIDIA Inception Program member page"
                className="block rounded-xl bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.06)] transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.06),0_16px_40px_rgba(118,185,0,0.18)]"
              >
                <img
                  src="/nvidia-inception-badge.jpg"
                  alt="Member of NVIDIA Inception Program"
                  width={220}
                  height={110}
                  loading="lazy"
                  className="h-auto w-[220px] max-w-full block"
                />
              </a>
            </div>

            <div className="text-center md:text-left">
              <p className="fade-in-scroll section-label mb-4">Recognition</p>
              <h2 className="fade-in-scroll font-heading text-2xl md:text-3xl text-foreground mb-4">
                Member of the NVIDIA Inception Program
              </h2>
              <p className="fade-in-scroll text-muted-foreground text-base md:text-lg leading-relaxed">
                SolCrys was selected for NVIDIA Inception, NVIDIA's program
                supporting AI startups with platform access, technical
                expertise, and ecosystem connections. We're applying that
                support to the AI infrastructure behind prompt-level
                measurement, citation tracking, and answer-accuracy monitoring
                — the layer of AEO that has to scale as answer engines and the
                prompts buyers ask continue to multiply.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
