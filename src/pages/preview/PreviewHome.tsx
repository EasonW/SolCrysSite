import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerTestimonialSection from "@/components/CustomerTestimonialSection";
import HeroMasterBrand from "@/components/home/HeroMasterBrand";
import ProductsSection from "@/components/home/ProductsSection";
import MethodResultsSection from "@/components/home/MethodResultsSection";
import SelectedWorkSection from "@/components/home/SelectedWorkSection";
import HomeFaqSection from "@/components/home/HomeFaqSection";
import HomeClosingCTA from "@/components/home/HomeClosingCTA";
import { useHashScroll } from "@/hooks/useHashScroll";
import { PreviewRibbon, usePreviewPage } from "@/preview/PreviewChrome";

/**
 * PREVIEW A — proposed master-brand homepage in the current design system:
 *   why now (Hero) → what we deliver (Products) → how we prove it (Loop +
 *   Cornelis results) → real work → voices → objections (FAQ) → act (CTA).
 * The live homepage (src/pages/Index.tsx) is unchanged.
 */
const PreviewHome = () => {
  useHashScroll();
  usePreviewPage("Master-brand homepage");
  return (
    <div className="min-h-screen bg-background">
      <PreviewRibbon />
      <Navbar variant="preview" />
      <HeroMasterBrand />
      <ProductsSection />
      <MethodResultsSection />
      <SelectedWorkSection />
      <CustomerTestimonialSection />
      <HomeFaqSection />
      <HomeClosingCTA />
      <Footer variant="preview" />
    </div>
  );
};

export default PreviewHome;
