import React from 'react';
import { HeroSection } from '../components/sections/HeroSection';
import { MarqueeSection } from '../components/sections/MarqueeSection';
import { AboutJJNutritionSection } from '../components/sections/AboutJJNutritionSection';
import { ReviewsSection } from '../components/sections/ReviewsSection';
import { AboutSection } from '../components/sections/AboutSection';
import { ServicesOverviewSection } from '../components/sections/ServicesOverviewSection';
import { ConsultationPricingSection } from '../components/sections/ConsultationPricingSection';
import { BlogsEntryStrip } from '../components/sections/BlogsEntryStrip';
import { ContactSection } from '../components/sections/ContactSection';

interface HomePageProps {
  onBookNow: (serviceId?: string, tierId?: string) => void;
  onNavigateService?: (service: string) => void;
  onNavigateBlogs: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onBookNow,
  onNavigateService,
  onNavigateBlogs,
}) => {
  return (
    <main>
      {/* 1. Hero section */}
      <HeroSection
        onBookNow={() => onBookNow()}
        onExploreServices={() => {
          if (onNavigateService) {
            onNavigateService('ALL');
          } else {
            const el = document.getElementById('services');
            if (el) {
              const navbarOffset = 80;
              const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        }}
      />

      {/* 2. Partners infinite-loop strip */}
      <MarqueeSection />

      {/* 3. About JJ Nutrition (Practice Introduction) */}
      <AboutJJNutritionSection
        onExploreServices={() => {
          if (onNavigateService) {
            onNavigateService('ALL');
          } else {
            const el = document.getElementById('services');
            if (el) {
              const navbarOffset = 80;
              const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        }}
        onBookNow={() => onBookNow()}
      />

      {/* 4. Complete Patient Reviews section */}
      <ReviewsSection />

      {/* 5. About Selvi (Practitioner Introduction) */}
      <AboutSection
        onBookNow={() => onBookNow()}
        onNavigateService={(id) => {
          if (onNavigateService) {
            onNavigateService(id);
          } else {
            const el = document.getElementById('services');
            if (el) {
              const navbarOffset = 80;
              const targetY = el.getBoundingClientRect().top + window.scrollY - navbarOffset;
              window.scrollTo({ top: targetY, behavior: 'smooth' });
            }
          }
        }}
      />

      {/* 6. Clinical Services (10 Targeted Protocols - Interactive Explorer) */}
      <ServicesOverviewSection
        onSelectService={(service) => {
          // If interactive explorer selects service or books
          onBookNow(service.id);
        }}
        onBookService={(serviceId) => onBookNow(serviceId)}
      />

      {/* 7. Transparent Consultation Tiers ($5, $75, $150 AUD) */}
      <ConsultationPricingSection
        onSelectTier={(tierId) => onBookNow(undefined, tierId)}
      />

      {/* 8. Blogs Entry Strip (Full-width editorial connection to /blogs) */}
      <BlogsEntryStrip onNavigateBlogs={onNavigateBlogs} />

      {/* 9. Contact Section (Direct cards, message form, and booking trigger) */}
      <ContactSection onBookNow={() => onBookNow()} />
    </main>
  );
};
