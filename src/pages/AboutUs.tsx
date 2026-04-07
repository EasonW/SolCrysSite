import { useScrollReveal } from "@/hooks/useScrollReveal";
import FounderCard from "@/components/FounderCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import gwenImg from "@/assets/gwen-chen.jpg";
import easonImg from "@/assets/eason-wang.jpg";
import jiaImg from "@/assets/jia-chang.jpg";

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
            <p className="fade-in-scroll section-label mb-6">About Us</p>
            <h1 className="fade-in-scroll font-heading text-5xl md:text-7xl font-bold leading-tight">
              <span className="gradient-text">SolCrys</span>{" "}
              <span className="text-foreground">AI</span>
            </h1>
            <p className="fade-in-scroll mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Engineering the new blueprint of AI search.
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
              We've been in the SEO trenches since 2007, navigating every major shift from
              keyword stuffing to intent modeling. But the transition to AI-generated search
              isn't just another algorithm update—it's a paradigm shift. Today, traditional
              Google rankings no longer guarantee visibility, and marketers are watching their
              traffic and CTRs evaporate.
            </p>
            <p>
              The industry's response so far? Tools that simply track this decline.
            </p>
            <p>
              SolCrys AI was built because tracking losing metrics isn't a strategy. We are
              moving the industry from passive observation to proactive action. Our platform is
              a closed-loop content optimization agent that doesn't just report on performance
              gaps—it actively generates specific recommendations and deploys content
              optimizations to close them.
            </p>
            <p>
              We founded SolCrys AI to give marketing teams the engine they need to stop
              bleeding traffic and start dominating the AI-first search landscape.
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AboutUs;
