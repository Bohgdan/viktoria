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
  // Fetch data from database with fallback to empty arrays
  let categories: Awaited<ReturnType<typeof db.getCategories>> = [];
  let featuredProducts: Awaited<ReturnType<typeof db.getProducts>> = [];
  let reviews: Awaited<ReturnType<typeof db.getApprovedReviews>> = [];

  try {
    [categories, featuredProducts, reviews] = await Promise.all([
      db.getCategories(),
      db.getProducts({ featured: true, limit: 4 }),
      db.getApprovedReviews(),
    ]);
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
  }

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
