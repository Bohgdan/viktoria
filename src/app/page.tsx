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
import db from '@/lib/db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
  // Fetch data from database
  const [categories, featuredProducts, reviews] = await Promise.all([
    db.getCategories(),
    db.getProducts({ featured: true, limit: 4 }),
    db.getApprovedReviews(),
  ]);

  return (
    <>
      <HeroSection />
      <StatsSection />
      <MarqueeStrip />
      <CategoriesPreview categories={categories} />
      <WhyTranscarpathia />
      <FeaturedProducts products={featuredProducts} />
      <OrderCalculator />
      <AboutPreview />
      <AdvantagesSection />
      <TargetAudience />
      <ReviewsSection reviews={reviews} />
      <ContactFormSection />
    </>
  );
}
