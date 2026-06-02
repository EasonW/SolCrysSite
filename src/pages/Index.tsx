import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import LoopSection from "@/components/LoopSection";
import ProblemSection from "@/components/ProblemSection";
import PlatformLayersSection from "@/components/PlatformLayersSection";
import MCPSkillsSection from "@/components/MCPSkillsSection";
import SolutionsSection from "@/components/SolutionsSection";
import ResourcesSection from "@/components/ResourcesSection";
import PromptPulseSection from "@/components/PromptPulseSection";
import FAQSection from "@/components/FAQSection";
import RecognitionSection from "@/components/RecognitionSection";
import CustomerTestimonialSection from "@/components/CustomerTestimonialSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import { useHashScroll } from "@/hooks/useHashScroll";

const Index = () => {
  useHashScroll();
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <LoopSection />
      <CustomerTestimonialSection />
      <ProblemSection />
      <PlatformLayersSection />
      <SolutionsSection />
      <MCPSkillsSection />
      <ResourcesSection />
      <PromptPulseSection />
      <FAQSection />
      <RecognitionSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
