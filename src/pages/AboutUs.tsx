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
    background: "Ex-Amazon, Alibaba",
    expertise: "SEO & Growth since 2007",
    linkedin: "https://www.linkedin.com/in/gwenchenx/",
  },
  {
    image: easonImg,
    initials: "EW",
    name: "Eason Wang",
    title: "Co-Founder & CPO",
    background: "Ex-Tencent, Alibaba",
    expertise: "Search & Product since 2003",
    linkedin: "https://www.linkedin.com/in/eason-wang/",
  },
  {
    image: jiaImg,
    initials: "JC",
    name: "Jia Chang",
    title: "Co-Founder & CTO",
    background: "Ex-Microsoft, Amazon",
    expertise: "Data & Security since 2008",
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
            <p className="fade-in-scroll section-label mb-6">About SolCrys AI</p>
            <h1 className="fade-in-scroll font-heading text-4xl md:text-6xl font-bold leading-tight">
              AI search visibility and Answer Engine Optimization for marketing teams.
            </h1>
            <p className="fade-in-scroll mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              SolCrys AI was built by search, growth, data, and product operators to help brands
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
              SolCrys AI was built to connect AI visibility measurement with practical content
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
              Built by veterans of the world's leading tech companies
            </h2>
            <p className="fade-in-scroll mt-4 text-muted-foreground text-lg max-w-2xl mx-auto">
              Decades of combined experience in search, SEO, data infrastructure, and security
              from Amazon, Microsoft, Tencent, and Alibaba.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {founders.map((founder) => (
              <FounderCard key={founder.name} {...founder} />
            ))}
          </div>

          <div className="fade-in-scroll mt-12 overflow-x-auto rounded-xl border border-border/30 bg-card/30">
            <table className="w-full border-collapse text-left text-sm">
              <thead className="bg-card/60 text-foreground">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Role</th>
                  <th className="px-4 py-3 font-semibold">Background</th>
                  <th className="px-4 py-3 font-semibold">Search/AEO relevance</th>
                </tr>
              </thead>
              <tbody>
                {founders.map((founder) => (
                  <tr key={founder.name} className="border-t border-border/30">
                    <td className="px-4 py-3 align-top">
                      <a href={founder.linkedin} className="hover:text-[hsl(195_90%_55%)]">
                        {founder.name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground align-top">{founder.title}</td>
                    <td className="px-4 py-3 text-muted-foreground align-top">{founder.background}</td>
                    <td className="px-4 py-3 text-muted-foreground align-top">{founder.expertise}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
