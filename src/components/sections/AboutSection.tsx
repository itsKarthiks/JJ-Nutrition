import React, { useRef, useState, useEffect } from 'react';
import { motion, useReducedMotion, useInView, animate, Variants } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { IMAGES } from '../../assets/images';
import ScrollReveal from '../ui/ScrollReveal';

interface AboutSectionProps {
  onBookNow: () => void;
  onLearnMore?: () => void;
  onNavigateService?: (service: string) => void;
}

interface StatItem {
  id: string;
  targetNumber: number;
  suffix: string;
  trailingWord?: string;
  label: string;
  isAccent?: boolean;
}

const PRACTITIONER_STATS: StatItem[] = [
  {
    id: 'stat-years',
    targetNumber: 12,
    suffix: '+',
    trailingWord: 'Years',
    label: 'Clinical Nutrition Practice',
    isAccent: false,
  },
  {
    id: 'stat-consults',
    targetNumber: 2800,
    suffix: '+',
    trailingWord: '',
    label: 'Individual Consultations Delivered',
    isAccent: false,
  },
  {
    id: 'stat-focus',
    targetNumber: 10,
    suffix: '',
    trailingWord: 'Focus Areas',
    label: 'Dedicated Clinical Protocols',
    isAccent: false,
  },
  {
    id: 'stat-outcomes',
    targetNumber: 98,
    suffix: '%',
    trailingWord: 'Satisfied',
    label: 'Documented Health Outcomes',
    isAccent: true,
  },
];

const StatCounter: React.FC<{
  target: number;
  suffix: string;
  trailingWord?: string;
  isAccent?: boolean;
  isInView: boolean;
  delay?: number;
}> = ({ target, suffix, trailingWord, isAccent, isInView, delay = 0 }) => {
  const shouldReduceMotion = useReducedMotion();
  const [count, setCount] = useState(shouldReduceMotion ? target : 0);
  const hasAnimatedRef = useRef(false);

  useEffect(() => {
    if (shouldReduceMotion) {
      setCount(target);
      return;
    }
    if (isInView && !hasAnimatedRef.current) {
      hasAnimatedRef.current = true;
      const controls = animate(0, target, {
        duration: 1.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (latest) => {
          setCount(Math.round(latest));
        },
        onComplete: () => {
          setCount(target);
        },
      });
      return () => controls.stop();
    }
  }, [isInView, target, delay, shouldReduceMotion]);

  const formattedNumber = count.toLocaleString('en-US');

  return (
    <span
      className={`font-montserrat font-bold text-xl md:text-xl lg:text-[23px] xl:text-[25px] leading-tight tracking-tight inline-flex items-baseline gap-1 ${
        isAccent ? 'text-[#0789D2]' : 'text-[#111827]'
      }`}
    >
      <span>{formattedNumber}{suffix}</span>
      {trailingWord && (
        <span className="font-montserrat font-semibold text-base sm:text-lg md:text-lg lg:text-[20px] xl:text-[22px]">
          {trailingWord}
        </span>
      )}
    </span>
  );
};

export const AboutSection: React.FC<AboutSectionProps> = ({
  onBookNow,
  onLearnMore,
  onNavigateService,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const desktopStatsRef = useRef<HTMLDivElement>(null);
  const mobileStatsRef = useRef<HTMLDivElement>(null);

  // Trigger counters when the cards container approaches the CENTRE of the viewport
  const isDesktopStatsInView = useInView(desktopStatsRef, {
    once: true,
    margin: '-20% 0px -25% 0px',
  });
  const isMobileStatsInView = useInView(mobileStatsRef, {
    once: true,
    margin: '-10% 0px -25% 0px',
  });

  const handleExploreProtocols = () => {
    if (onLearnMore) {
      onLearnMore();
    } else if (onNavigateService) {
      onNavigateService('ALL');
    }
  };

  const headingContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
      },
    },
  };

  const headingLineVariants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="about-selvi"
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-transparent scroll-mt-20 md:scroll-mt-28 py-6 sm:py-8 md:py-10 my-3 sm:my-5 md:my-6"
      aria-label="About Clinical Practitioner Selvi"
    >
      {/* ============================================================== */}
      {/* 1. TOP-LEFT SECTION-LEVEL HEADING (Matches About JJ Nutrition)  */}
      {/* ============================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8 md:mb-10">
        <motion.h2
          variants={headingContainerVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          whileInView={shouldReduceMotion ? {} : 'visible'}
          viewport={{ once: true, margin: '-40px' }}
          className="font-sans text-3xl sm:text-4xl md:text-[44px] text-[#111827] uppercase font-normal leading-tight text-left"
        >
          <motion.span variants={headingLineVariants} className="block">
            A Personal Approach to
          </motion.span>
          <motion.span variants={headingLineVariants} className="block text-accent font-medium">
            Better Nutrition.
          </motion.span>
        </motion.h2>
      </div>

      {/* ============================================================== */}
      {/* 2. DESKTOP & IPAD THREE-COLUMN COMPOSITION (md+)                */}
      {/* LEFT: Full-Height Asymmetric Practitioner Image                 */}
      {/* CENTRE: Four Compact Vertically Stacked Statistic Cards        */}
      {/* RIGHT: Centred Practitioner Story Paragraph & CTA Buttons       */}
      {/* ============================================================== */}
      <div className="hidden md:flex w-full items-stretch min-h-[460px] md:min-h-[470px] lg:min-h-[490px] xl:min-h-[510px]">
        
        {/* COLUMN A: Full-Height Asymmetric Practitioner Image */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -25 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-[28%] md:w-[28%] lg:w-[32%] xl:w-[32%] flex-shrink-0 relative self-stretch"
        >
          <div
            className="w-full h-full relative overflow-hidden bg-surface-pale"
            style={{
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
              borderTopRightRadius: '140px',
              borderBottomRightRadius: '140px',
            }}
          >
            <img
              src={IMAGES.selviPractitionerClean}
              alt="Practitioner Selvi - Clinical Nutritionist"
              className="w-full h-full object-cover object-[center_12%] select-none pointer-events-none"
              onError={(e) => {
                (e.target as HTMLImageElement).src = IMAGES.selviAbout;
              }}
            />
          </div>
        </motion.div>

        {/* COLUMN B: Centre - Four Vertically Stacked Statistic Cards */}
        <div
          ref={desktopStatsRef}
          className="w-[26%] md:w-[26%] lg:w-[23%] xl:w-[22%] flex-shrink-0 flex flex-col justify-between py-3 md:py-4 lg:py-5 px-3 md:px-4 lg:px-5 gap-3"
        >
          {PRACTITIONER_STATS.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              whileHover={shouldReduceMotion ? {} : { y: -2 }}
              viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : 0.08 + index * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="flex-1 flex flex-col justify-center p-3.5 md:p-4 lg:p-4.5 rounded-2xl bg-white border border-[#DCE8F1] shadow-[0_2px_12px_rgba(16,36,61,0.03)] hover:border-accent/40 hover:shadow-xs transition-all duration-300"
            >
              <StatCounter
                target={stat.targetNumber}
                suffix={stat.suffix}
                trailingWord={stat.trailingWord}
                isAccent={stat.isAccent}
                isInView={isDesktopStatsInView}
                delay={0.12 + index * 0.09}
              />
              <span className="font-montserrat text-xs md:text-xs lg:text-[13px] text-[#555555] font-medium leading-snug mt-1">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* COLUMN C: Right - About Selvi Editorial Content & Actions (Centred) */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: 20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col items-center justify-center text-center py-4 md:py-6 lg:py-8 pl-4 md:pl-6 lg:pl-10 xl:pl-14 pr-6 sm:pr-8 md:pr-10 lg:pr-14"
        >
          <div className="max-w-lg mx-auto text-center">
            {/* Approved Practitioner Story Copy with Progressive Line-by-Line Reveal */}
            <ScrollReveal
              splitBy="lines"
              mode="scrub"
              effect="rise"
              baseOffset={16}
              baseOpacity={0.15}
              enableBlur
              blurStrength={3}
              as="p"
              textClassName="text-[#1A1A1A] text-sm md:text-base lg:text-[16.5px] leading-relaxed font-normal text-center font-montserrat"
              containerClassName="text-center"
            >
              As the founder and clinical practitioner behind JJ Nutrition, Selvi leads every consultation with dedicated, individualised care. Focusing on the root biochemical causes of metabolic and nutritional imbalances, she oversees each personalised health protocol to provide clear, practitioner-supervised guidance tailored to your body's unique biology.
            </ScrollReveal>

            {/* Centred CTA Buttons */}
            <motion.div
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20px' }}
              transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex items-center justify-center gap-3 sm:gap-4 flex-wrap mt-6 md:mt-8"
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
                  Book a Consultation
                </span>
                <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                  <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </span>
              </motion.button>

              {/* Secondary CTA: Explore Protocols */}
              {(onLearnMore || onNavigateService) && (
                <motion.button
                  onClick={handleExploreProtocols}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="group inline-flex items-center justify-between gap-3 sm:gap-4 pl-5 sm:pl-6 pr-1.5 sm:pr-2 py-1.5 sm:py-2 rounded-full bg-white text-[#111827] border border-border-blue hover:border-accent hover:text-accent transition-all duration-300 shadow-2xs hover:shadow-sm cursor-pointer select-none"
                >
                  <span className="font-montserrat text-xs sm:text-sm font-semibold tracking-wide">
                    Explore Clinical Protocols
                  </span>
                  <span className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-navy/5 group-hover:bg-accent/15 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-[#111827] group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </span>
                </motion.button>
              )}
            </motion.div>
          </div>
        </motion.div>

      </div>

      {/* ============================================================== */}
      {/* 3. MOBILE CUSTOM CONTENT ORDER (< md)                          */}
      {/* Order strictly:                                                */}
      {/* 1. Heading                                                     */}
      {/* 2. Asymmetric Practitioner Image                              */}
      {/* 3. Description / Content (Centred)                             */}
      {/* 4. CTA Buttons (Centred)                                       */}
      {/* 5. Four Statistic Cards in a 2x2 Grid                          */}
      {/* ============================================================== */}
      <div className="block md:hidden px-4 sm:px-6 pt-4 sm:pt-6">
        
        {/* Step 2: Asymmetric Practitioner Image */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, x: -20 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-30px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="w-[92%] sm:w-[88%] -ml-4 sm:-ml-6 h-[290px] sm:h-[340px] overflow-hidden bg-surface-pale mb-6 shadow-xs"
          style={{
            borderTopLeftRadius: 0,
            borderBottomLeftRadius: 0,
            borderTopRightRadius: '56px',
            borderBottomRightRadius: '56px',
          }}
        >
          <img
            src={IMAGES.selviPractitionerClean}
            alt="Practitioner Selvi - Clinical Nutritionist"
            className="w-full h-full object-cover object-[center_12%] select-none pointer-events-none"
            onError={(e) => {
              (e.target as HTMLImageElement).src = IMAGES.selviAbout;
            }}
          />
        </motion.div>

        {/* Step 3: Description Paragraph (Centred) */}
        <div className="text-center max-w-md mx-auto mb-6">
          <ScrollReveal
            splitBy="lines"
            mode="scrub"
            effect="rise"
            baseOffset={14}
            baseOpacity={0.15}
            as="p"
            textClassName="text-[#1A1A1A] text-sm sm:text-base leading-relaxed font-normal text-center font-montserrat"
            containerClassName="text-center"
          >
            As the founder and clinical practitioner behind JJ Nutrition, Selvi leads every consultation with dedicated, individualised care. Focusing on the root biochemical causes of metabolic and nutritional imbalances, she oversees each personalised health protocol to provide clear, practitioner-supervised guidance tailored to your body's unique biology.
          </ScrollReveal>
        </div>

        {/* Step 4: CTA Buttons (Centred side-by-side on mobile) */}
        <motion.div
          initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
          whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="flex flex-row items-center justify-center gap-2 sm:gap-3 mb-8 w-full max-w-sm mx-auto"
        >
          <motion.button
            onClick={onBookNow}
            whileTap={{ scale: 0.98 }}
            className="flex-1 min-w-0 group inline-flex items-center justify-between gap-1 pl-2.5 sm:pl-3.5 pr-1 py-1.5 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_16px_rgba(66,169,229,0.3)] cursor-pointer select-none min-h-[42px]"
          >
            <span className="font-montserrat text-[9.5px] min-[390px]:text-[10.5px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
              Book a Consultation
            </span>
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
              <ArrowUpRight className="w-3 h-3 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </motion.button>

          {(onLearnMore || onNavigateService) && (
            <motion.button
              onClick={handleExploreProtocols}
              whileTap={{ scale: 0.98 }}
              className="flex-1 min-w-0 group inline-flex items-center justify-between gap-1 pl-2.5 sm:pl-3.5 pr-1 py-1.5 rounded-full bg-white text-[#111827] border border-border-blue hover:border-accent hover:text-accent transition-all duration-300 shadow-2xs cursor-pointer select-none min-h-[42px]"
            >
              <span className="font-montserrat text-[9.5px] min-[390px]:text-[10.5px] sm:text-xs font-semibold tracking-wide whitespace-nowrap">
                Explore Clinical Protocols
              </span>
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-navy/5 group-hover:bg-accent/15 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                <ArrowUpRight className="w-3 h-3 text-[#111827] group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </motion.button>
          )}
        </motion.div>

        {/* Step 5: Four Statistic Cards in a 2x2 Grid with Animated Counters */}
        <div ref={mobileStatsRef} className="grid grid-cols-2 gap-3 sm:gap-4 w-full">
          {PRACTITIONER_STATS.map((stat, index) => (
            <motion.div
              key={`mobile-${stat.id}`}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 15 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10% 0px -20% 0px' }}
              transition={{
                duration: 0.5,
                delay: shouldReduceMotion ? 0 : 0.06 + index * 0.05,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#DCE8F1] shadow-[0_2px_10px_rgba(16,36,61,0.03)] flex flex-col justify-between min-h-[96px]"
            >
              <StatCounter
                target={stat.targetNumber}
                suffix={stat.suffix}
                trailingWord={stat.trailingWord}
                isAccent={stat.isAccent}
                isInView={isMobileStatsInView}
                delay={0.1 + index * 0.08}
              />
              <span className="font-montserrat text-[11px] sm:text-xs text-[#555555] font-medium leading-snug mt-1.5">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};
