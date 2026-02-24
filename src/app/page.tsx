import {
  HeroSection,
  StatsSection,
  MarqueeStrip,
  CategoriesPreview,
  WhyTranscarpathia,
  FeaturedProducts,
  OrderCalculator,
  AboutPreview,
  AdvantagesSection,
  TargetAudience,
  ReviewsSection,
  ContactFormSection,
} from '@/components/home';

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <MarqueeStrip />
      <CategoriesPreview />
      <WhyTranscarpathia />
      <FeaturedProducts />
      <OrderCalculator />
      <AboutPreview />
      <AdvantagesSection />
      <TargetAudience />
      <ReviewsSection />
      <ContactFormSection />
    </>
  );
}
