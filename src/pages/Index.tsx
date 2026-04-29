import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import ApproachSection from "@/components/ApproachSection";
import FeaturesSection from "@/components/FeaturesSection";
import AnswerEngineSection from "@/components/AnswerEngineSection";
import ResourcesSection from "@/components/ResourcesSection";
import SourceNotesSection from "@/components/SourceNotesSection";
import FAQSection from "@/components/FAQSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <AnswerEngineSection />
      <ProblemSection />
      <ApproachSection />
      <FeaturesSection />
      <ResourcesSection />
      <SourceNotesSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;
