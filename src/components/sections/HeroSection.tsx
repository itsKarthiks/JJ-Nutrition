import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { IMAGES } from '../../assets/images';
import CircularText from '../ui/CircularText/CircularText';
import Aurora from '../ui/Aurora';

interface HeroSectionProps {
  onBookNow: () => void;
  onExploreServices?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onBookNow, onExploreServices }) => {
  // Only mount and animate Aurora on Desktop and iPad / Tablet viewports (>= 768px)
  const [isTabletOrDesktop, setIsTabletOrDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const updateMatch = () => setIsTabletOrDesktop(mq.matches);
    updateMatch();
    mq.addEventListener('change', updateMatch);
    return () => mq.removeEventListener('change', updateMatch);
  }, []);

  return (
    <section id="home" className="relative bg-transparent pt-0 lg:pt-36 pb-16 md:pb-24 overflow-hidden">
      {/* Aurora Atmospheric Background Layer — Active only on Desktop & iPad / Tablet (>= 768px) */}
      <div className="hidden md:block absolute inset-0 z-0 pointer-events-none overflow-hidden select-none">
        {isTabletOrDesktop && (
          <Aurora
            colorStops={["#42a9e5", "#ffffffff", "#42a9e5"]}
            amplitude={1}
            blend={0.5}
            height={0.45}
            speed={1}
            glow={0.6}
            scale={1}
            brightness={1}
            layers={1}
            direction="top"
            opacity={1}
            mouseInteraction
            intro
            lightMode={false}
            className="w-full h-full"
          />
        )}
        {/* Soft bottom gradient veil to transition smoothly into warm off-white #FAF9F6 */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, transparent 35%, rgba(250, 249, 246, 0.45) 70%, #FAF9F6 100%)',
          }}
        />
      </div>

      {/* Main Hero Container: edge-to-edge on mobile for full-bleed hero, standard container on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 sm:gap-10 lg:gap-12 items-center">

          {/* ============================================================== */}
          {/* HERO IMAGE: Order 1 on Mobile (< lg), Order 2 on Desktop (lg+) */}
          {/* Mobile: Starts at top: 0 (under floating glass navbar), arched capsule bottom */}
          {/* ============================================================== */}
          <div className="w-full lg:col-span-5 order-1 lg:order-2 flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full sm:max-w-lg lg:max-w-none"
            >
              {/* Main Capsule Hero Image Container */}
              <div className="relative w-full h-[58vh] min-h-[460px] max-h-[620px] lg:h-auto lg:aspect-[3/4] rounded-t-none lg:rounded-t-[160px] rounded-b-[64px] sm:rounded-b-[84px] lg:rounded-b-3xl overflow-hidden shadow-[0_20px_50px_rgba(16,36,61,0.08)] bg-surface-pale">
                <img
                  src={IMAGES.heroModel}
                  alt="Clinical Nutrition Practitioner Telehealth Consultation - JJ Nutrition"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* ================= MOBILE CIRCULAR TEXT BADGE ================= */}
              {/* Positioned at the bottom-right corner of the mobile hero image with clean white circular background */}
              <div className="lg:hidden absolute -bottom-5 right-4 sm:-bottom-6 sm:right-6 z-20 pointer-events-auto">
                <div className="relative flex items-center justify-center p-1.5 rounded-full bg-white border border-border-blue/60 shadow-[0_4px_16px_rgba(16,36,61,0.08)]">
                  <CircularText
                    text="HEALTH*NUTRITION*SCIENCE* "
                    spinDuration={6}
                    draggable={true}
                    hoverTilt={30}
                    fontWeight={400}
                    fill={true}
                    ring={true}
                    ringColor="rgba(66, 169, 229, 0.4)"
                    size={84}
                    fontSize={8.5}
                    letterSpacing={1.2}
                    color="#10243D"
                    className="font-montserrat tracking-widest"
                  >
                    {/* Stationary DNA Icon at the exact visual center, rotated ~45 deg */}
                    <div className="w-9 h-9 flex items-center justify-center pointer-events-none select-none">
                      <img
                        src="/DNAicon.png"
                        alt="JJ Nutrition DNA Icon"
                        className="w-7 h-7 object-contain filter drop-shadow-sm transform rotate-45"
                      />
                    </div>
                  </CircularText>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ============================================================== */}
          {/* HERO TEXT: Order 2 on Mobile (< lg), Order 1 on Desktop (lg+)  */}
          {/* Clean Visual Hierarchy: HEADLINE -> SHORT DESCRIPTION -> 2 CTA BUTTONS */}
          {/* ============================================================== */}
          <div className="w-full lg:col-span-7 order-2 lg:order-1 flex flex-col items-start px-4 sm:px-0">

            {/* Hero Headline — Simple, Memorable, Confident */}
            <div className="relative mb-4 sm:mb-5 w-full mt-2 sm:mt-4 lg:mt-0">
              <motion.h1
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 }}
                className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-[68px] leading-[1.08] lg:leading-[1.05] text-[#111827] font-normal tracking-tight uppercase"
              >
                Nutrition, <br />
                guided by <span className="text-accent font-medium">science.</span>
              </motion.h1>
            </div>

            {/* Short Supporting Description — High-Contrast Dark Body Text */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg text-[#1A1A1A] max-w-xl leading-relaxed mb-8 font-normal font-montserrat"
            >
              Discover a more personalised approach to nutrition and wellbeing. Led by practitioner Selvi, JJ Nutrition combines evidence-informed nutritional guidance with carefully considered supplement support to help you make confident decisions about your health.
            </motion.p>

            {/* CTA Buttons — Reference 3 Pill Design with Circular Arrow Container */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex items-center flex-wrap gap-3.5 sm:gap-4 w-full sm:w-auto"
            >
              {/* Primary CTA: Book Consultation */}
              <motion.button
                onClick={onBookNow}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="group inline-flex items-center justify-between gap-3 sm:gap-4 pl-5 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_16px_rgba(66,169,229,0.3)] hover:shadow-[0_6px_22px_rgba(7,137,210,0.4)] cursor-pointer select-none"
              >
                <span className="font-montserrat text-xs sm:text-sm font-semibold tracking-wide">
                  Book Consultation
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.button>

              {/* Secondary CTA: Explore Services */}
              {onExploreServices && (
                <motion.button
                  onClick={onExploreServices}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center justify-between gap-3 sm:gap-4 pl-5 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full bg-white text-navy border border-border-blue hover:border-accent hover:text-accent transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer select-none"
                >
                  <span className="font-montserrat text-xs sm:text-sm font-semibold tracking-wide">
                    Explore Services
                  </span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy/5 group-hover:bg-accent/15 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-navy group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </motion.button>
              )}
            </motion.div>

          </div>
        </div>

      </div>

      {/* ================= DESKTOP & IPAD CIRCULAR TEXT BADGE ================= */}
      {/* Positioned at the bottom-rightmost corner of the screen/hero section, completely transparent (no background/shadow) */}
      <div className="hidden lg:block absolute bottom-8 right-8 xl:bottom-10 xl:right-12 z-20 pointer-events-auto">
        <CircularText
          text="HEALTH*NUTRITION*SCIENCE* "
          spinDuration={6}
          draggable={true}
          hoverTilt={30}
          fontWeight={400}
          fill={true}
          ring={true}
          ringColor="rgba(66, 169, 229, 0.45)"
          size={98}
          fontSize={9.5}
          letterSpacing={1.3}
          color="#10243D"
          className="font-montserrat tracking-widest bg-transparent"
        >
          {/* Stationary DNA Icon at the exact visual center, rotated ~45 deg */}
          <div className="w-11 h-11 flex items-center justify-center pointer-events-none select-none">
            <img
              src="/DNAicon.png"
              alt="JJ Nutrition DNA Icon"
              className="w-[34px] h-[34px] object-contain filter drop-shadow-sm transform rotate-45"
            />
          </div>
        </CircularText>
      </div>
    </section>
  );
};
