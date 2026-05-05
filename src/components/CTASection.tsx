import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import EarlyAccessDialog from "./EarlyAccessDialog";

const CTASection = () => {
  return (
    <section className="relative py-24 md:py-32 section-fade overflow-hidden">
      {/* Ambient background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[hsl(195_90%_55%/0.05)] blur-[160px]" />

      <div className="container mx-auto px-6 max-w-3xl text-center relative">
        <div className="relative rounded-2xl p-12 md:p-16 border border-[hsl(195_90%_55%/0.2)] bg-card/40 backdrop-blur-sm overflow-hidden">
          {/* Inner glows */}
          <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full bg-[hsl(195_90%_55%/0.08)] blur-3xl" />
          <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-[hsl(40_85%_55%/0.06)] blur-3xl" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
              See where AI answers are helping or hurting your brand.
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Get a free AI visibility audit across priority prompts, cited sources, competitors, and answer accuracy.
            </p>
            <EarlyAccessDialog surface="cta_section">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Get a Free Audit
                <ArrowRight className="ml-1" />
              </Button>
            </EarlyAccessDialog>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
