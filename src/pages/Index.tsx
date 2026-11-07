import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import LoopSection from "@/components/LoopSection";
import FreeTrackerSection from "@/components/FreeTrackerSection";
import PlatformLayersSection from "@/components/PlatformLayersSection";
import CustomerTestimonialSection from "@/components/CustomerTestimonialSection";
import SolutionsSection from "@/components/SolutionsSection";
import MCPSkillsSection from "@/components/MCPSkillsSection";
import PromptPulseSection from "@/components/PromptPulseSection";
import ResourcesSection from "@/components/ResourcesSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import EarlyAccessDialog from "@/components/EarlyAccessDialog";
import { Button } from "@/components/ui/button";
import { useHashScroll } from "@/hooks/useHashScroll";
import homeContent from "@/content/homeContent.json";

/**
 * Homepage section order follows the new-category narrative for a
 * first-time (category-unaware) visitor:
 *   who we are (Hero) → why now + what AEO is (Problem) → the new way
 *   (Loop) → try it (FreeTracker) → what you get (Platform) → what we
 *   build for you (Work: SolCrys Sites + Motion) → proof
 *   (Testimonials + NVIDIA strip) → who it's for (Solutions) →
 *   depth (MCP, Prompt Pulse, Resources) → objections (FAQ) → act (CTA).
 * Mirrored in scripts/prerender.mjs homeHtml() — keep the two in sync.
 */
const Index = () => {
  useHashScroll();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <LoopSection />
      <FreeTrackerSection />
      <PlatformLayersSection />
      <SelectedWorkSection
        heading={homeContent.home.work.heading}
        intro={homeContent.home.work.intro}
        actions={
          <>
            <EarlyAccessDialog mode="project" surface="home_work">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Start a project
              </Button>
            </EarlyAccessDialog>
            <Button asChild variant="hero-outline" size="lg" className="text-base px-8 py-6">
              <a href="/sites/">See SolCrys Sites</a>
            </Button>
          </>
        }
      />
      <CustomerTestimonialSection />
      <SolutionsSection />
      <MCPSkillsSection />
      <PromptPulseSection />
      <ResourcesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
