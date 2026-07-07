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
import { useHashScroll } from "@/hooks/useHashScroll";

/**
 * Homepage section order follows the new-category narrative for a
 * first-time (category-unaware) visitor:
 *   who we are (Hero) → why now + what AEO is (Problem) → the new way
 *   (Loop) → try it (FreeTracker) → what you get (Platform) → proof
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
