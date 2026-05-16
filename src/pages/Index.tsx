import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import PlatformLayersSection from "@/components/PlatformLayersSection";
import SolutionsSection from "@/components/SolutionsSection";
import AnswerEngineSection from "@/components/AnswerEngineSection";
import ResourcesSection from "@/components/ResourcesSection";
import SourceNotesSection from "@/components/SourceNotesSection";
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
      <AnswerEngineSection />
      <ProblemSection />
      <ApproachSection />
      <PlatformLayersSection />
      <SolutionsSection />
      <ResourcesSection />
      <SourceNotesSection />
      <FAQSection />
      <CustomerTestimonialSection />
      <RecognitionSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
