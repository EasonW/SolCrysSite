import { useEffect } from "react";
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

// Scroll to URL hash after React mounts. Native browser scroll-to-hash fires
// before our React-rendered sections exist (especially deeper ones below the
// hero), so we poll for the target element until it appears, then scroll.
const useHashScroll = () => {
  useEffect(() => {
    const scrollToHash = (smooth: boolean) => {
      if (!window.location.hash) return;
      const id = decodeURIComponent(window.location.hash.slice(1));
      let attempts = 0;
      const tryScroll = () => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: smooth ? "smooth" : "auto", block: "start" });
        } else if (attempts++ < 40) {
          setTimeout(tryScroll, 50); // up to 2 seconds
        }
      };
      tryScroll();
    };
    scrollToHash(false); // mount: instant — user just clicked a link, expects to land
    const onHashChange = () => scrollToHash(true);
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);
};

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
