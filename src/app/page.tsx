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

async function getHomeData() {
  try {
    const [categories, featuredProducts, reviews] = await Promise.all([
      db.getCategories(),
      db.getProducts({ featured: true, limit: 4 }),
      db.getApprovedReviews(),
    ]);
    return { categories, featuredProducts, reviews };
  } catch (error) {
    console.error('Failed to fetch home page data:', error);
    return { categories: [], featuredProducts: [], reviews: [] };
  }
}

export default async function Home() {
  const { categories, featuredProducts, reviews } = await getHomeData();

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
