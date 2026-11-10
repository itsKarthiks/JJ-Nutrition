import React, { useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import { AboutDNAAnimation } from '../decorative/AboutDNAAnimation';

interface AboutJJNutritionSectionProps {
  onExploreServices?: () => void;
  onBookNow?: () => void;
}

export const AboutJJNutritionSection: React.FC<AboutJJNutritionSectionProps> = () => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="bg-transparent py-14 sm:py-20 md:py-24 relative overflow-hidden scroll-mt-20 md:scroll-mt-28"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-2xl lg:max-w-3xl text-left">
          {/* Left-Aligned Headline with Approved Hierarchy & Accent */}
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6 }}
            className="font-sans text-3xl sm:text-4xl md:text-[44px] text-[#111827] uppercase font-normal leading-tight mb-6 sm:mb-7"
          >
            Personalised Nutrition, <br />
            <span className="text-accent font-medium">Grounded in Science.</span>
          </motion.h2>

          {/* Left-Aligned Paragraph with ScrollReveal Animation & Rich Dark Navy Color */}
          <ScrollReveal
            highlightColor="#2a78ee"
            mode="scrub"
            splitBy="words"
            effect="flip"
            stagger={0.05}
            duration={0.8}
            smoothing={1}
            baseOpacity={0.1}
            baseRotation={3}
            baseOffset={30}
            enableBlur
            blurStrength={4}
            as="p"
            textClassName="text-[#1A1A1A] text-base sm:text-lg md:text-xl leading-relaxed font-normal font-montserrat"
            containerClassName="text-left"
          >
            JJ Nutrition is an evidence-informed clinical nutrition practice focused on individualised health.
            By evaluating cellular physiology and metabolic individuality, we combine practitioner-led guidance
            with targeted, pharmaceutical-grade supplement support to help you make informed, confident decisions about your wellbeing.
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll-Triggered DNA Path Animation — Positioned in background, non-blocking */}
      <AboutDNAAnimation
        targetRef={sectionRef}
        className="w-full md:w-[460px] lg:w-[540px] xl:w-[600px] opacity-25 md:opacity-85 lg:opacity-95"
      />
    </section>
  );
};
