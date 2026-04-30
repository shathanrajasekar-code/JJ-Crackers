import { HeroSection } from '@/components/home/HeroSection';
import { StatsBar } from '@/components/home/StatsBar';
import { BudgetKits } from '@/components/home/BudgetKits';
import { LegacySection } from '@/components/home/LegacySection';
import { GallerySection } from '@/components/home/GallerySection';
import { TestimonialSection } from '@/components/home/TestimonialSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <BudgetKits />
      <LegacySection />
      <GallerySection />
      <TestimonialSection />
    </>
  );
}
