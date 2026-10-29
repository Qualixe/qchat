import { FeatureSections } from "@/components/marketing/feature-sections";
import { Hero } from "@/components/marketing/hero";
import { HowItWorks, IntegrationsSection } from "@/components/marketing/how-and-integrations";
import { FaqSection, FinalCta, PricingSection } from "@/components/marketing/pricing-faq-cta";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <FeatureSections />
      <HowItWorks />
      <IntegrationsSection />
      <PricingSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
