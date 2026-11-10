import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useAnimationFrame, useReducedMotion } from 'framer-motion';
import { AUTHENTIC_PARTNERS } from '../../data/clinicalData';

/**
 * Optically calibrated metrics for tightly trimmed monochrome partner logos:
 * Each logo's max-width and height are proportioned to its exact artwork aspect ratio,
 * guaranteeing equal visual weight, crisp legibility (especially on mobile), and zero distortion.
 */
interface LogoMetric {
  maxW: string;
  hClass: string;
}

const PARTNER_METRICS: Record<string, LogoMetric> = {
  // Aspect: 2.15 (Wide wordmark with crest) -> balanced 32px desktop / 28px mobile
  'Australian Natural Therapists Association': {
    maxW: 'max-w-[85px] sm:max-w-[95px] md:max-w-[105px]',
    hClass: 'h-7 sm:h-7.5 md:h-8',
  },
  // Aspect: 1.02 (Compact circular crest) -> restrained 26px mobile / 30px desktop so it doesn't overpower
  'Complementary Medicine Association': {
    maxW: 'max-w-[32px] sm:max-w-[36px] md:max-w-[40px]',
    hClass: 'h-6.5 sm:h-7 md:h-7.5',
  },
  // Aspect: 1.34 (Square-ish symbol + wordmark) -> 26px mobile / 30px desktop
  'Metagenics Clinical Range': {
    maxW: 'max-w-[46px] sm:max-w-[52px] md:max-w-[58px]',
    hClass: 'h-6.5 sm:h-7 md:h-7.5',
  },
  // Aspect: 2.81 (Horizontal wordmark) -> 28px mobile / 32px desktop
  'BioCeuticals Practitioner Support': {
    maxW: 'max-w-[105px] sm:max-w-[115px] md:max-w-[125px]',
    hClass: 'h-7 sm:h-7.5 md:h-8',
  },
  // Aspect: 6.13 (Wide clinical wordmark) -> 24px mobile / 28px desktop
  'Orthoplex Clinical Research': {
    maxW: 'max-w-[155px] sm:max-w-[170px] md:max-w-[185px]',
    hClass: 'h-6 sm:h-6.5 md:h-7',
  },
  // Aspect: 4.66 (Previously tiny, now tightly cropped & 26px mobile / 30px desktop!)
  'Nutrition Care Pharmaceuticals': {
    maxW: 'max-w-[130px] sm:max-w-[145px] md:max-w-[160px]',
    hClass: 'h-6.5 sm:h-7 md:h-7.5',
  },
  // Aspect: 1.01 (Circular seal) -> restrained 26px mobile / 30px desktop
  'Eagle Natural Health': {
    maxW: 'max-w-[32px] sm:max-w-[36px] md:max-w-[40px]',
    hClass: 'h-6.5 sm:h-7 md:h-7.5',
  },
  // Aspect: 3.31 (Horizontal wordmark) -> 28px mobile / 32px desktop
  'MediHerb Herbal Formulations': {
    maxW: 'max-w-[115px] sm:max-w-[125px] md:max-w-[135px]',
    hClass: 'h-7 sm:h-7.5 md:h-8',
  },
  // Aspect: 1.00 (Square symbol) -> 25px mobile / 28px desktop
  'Designs for Health Science': {
    maxW: 'max-w-[32px] sm:max-w-[34px] md:max-w-[38px]',
    hClass: 'h-6 sm:h-6.5 md:h-7',
  },
  // Aspect: 7.29 (Ultra-wide wordmark) -> 22px mobile / 26px desktop
  'RN Labs Functional Medicine': {
    maxW: 'max-w-[170px] sm:max-w-[190px] md:max-w-[210px]',
    hClass: 'h-5.5 sm:h-6 md:h-6.5',
  },
  // Aspect: 4.29 (Previously tiny, now tightly cropped & 26px mobile / 30px desktop!)
  'Flordis Integrative Health': {
    maxW: 'max-w-[125px] sm:max-w-[135px] md:max-w-[150px]',
    hClass: 'h-6.5 sm:h-7 md:h-7.5',
  },
};

export const MarqueeSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [isHovered, setIsHovered] = useState(false);
  const groupRef = useRef<HTMLDivElement>(null);
  const [groupWidth, setGroupWidth] = useState<number>(0);
  const x = useMotionValue(0);

  // ResizeObserver guarantees exact subpixel rendered width even after images load or screen resizes
  useEffect(() => {
    if (!groupRef.current) return;
    const observer = new ResizeObserver(() => {
      if (groupRef.current) {
        const w = groupRef.current.offsetWidth;
        if (w > 0) {
          setGroupWidth(w);
        }
      }
    });
    observer.observe(groupRef.current);
    return () => observer.disconnect();
  }, []);

  // Frame-by-frame continuous linear movement (no CSS keyframe restarts or boundary gaps)
  useAnimationFrame((_, delta) => {
    if (shouldReduceMotion || isHovered || groupWidth <= 0) return;

    // Refined constant editorial velocity (~35px per second)
    const speedPxPerMs = 0.035;
    const moveBy = delta * speedPxPerMs;

    let nextX = x.get() - moveBy;
    // Seamless mathematical modulo wrap: when shifted by exactly 1 complete group width, wrap cleanly
    if (nextX <= -groupWidth) {
      nextX += groupWidth;
    }
    x.set(nextX);
  });

  const renderLogoGroup = (groupIdx: number, isMeasuringGroup = false) => (
    <div
      key={`group-${groupIdx}`}
      ref={isMeasuringGroup ? groupRef : undefined}
      className="flex items-center gap-9 sm:gap-14 md:gap-16 lg:gap-20 flex-shrink-0 pr-9 sm:pr-14 md:pr-16 lg:pr-20"
      aria-hidden={!isMeasuringGroup}
    >
      {AUTHENTIC_PARTNERS.map((partner) => {
        const metric = PARTNER_METRICS[partner.name] || {
          maxW: 'max-w-[120px] sm:max-w-[140px]',
          hClass: 'h-7 sm:h-7.5 md:h-8',
        };

        return (
          <div
            key={`${groupIdx}-${partner.name}`}
            className="flex items-center justify-center flex-shrink-0 transition-opacity duration-300 opacity-70 hover:opacity-100"
            title={partner.name}
          >
            <div className={`flex items-center justify-center ${metric.hClass} ${metric.maxW} w-auto`}>
              <img
                src={partner.src}
                alt={partner.name}
                loading="eager"
                decoding="sync"
                className="max-h-full max-w-full w-auto h-auto object-contain select-none pointer-events-none"
                onError={(e) => {
                  const target = e.target as HTMLElement;
                  target.style.display = 'none';
                  if (target.parentElement) {
                    const textSpan = document.createElement('span');
                    textSpan.className = 'font-montserrat text-xs font-normal tracking-wide text-navy/70 whitespace-nowrap';
                    textSpan.innerText = partner.name;
                    target.parentElement.appendChild(textSpan);
                  }
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="bg-transparent border-y border-border-blue/60 py-4.5 sm:py-7 select-none relative overflow-hidden">
      {/* Refined Understated Heading: "Partners" in Montserrat Regular */}
      <div className="max-w-7xl mx-auto px-4 mb-2.5 sm:mb-4 text-center">
        <h3 className="font-montserrat font-normal text-xs sm:text-[13px] tracking-[0.04em] text-slate/85">
          Partners
        </h3>
      </div>

      {/* Horizontal Continuous Marquee Track */}
      <div
        className="relative flex overflow-hidden w-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Soft edge masks for smooth lateral gradient fade */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-r from-[#F7FAFD] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 md:w-28 bg-gradient-to-l from-[#F7FAFD] to-transparent z-10 pointer-events-none" />

        {/* Seamless Multi-Group Continuous Animation */}
        <motion.div
          style={{ x }}
          className="flex items-center whitespace-nowrap will-change-transform py-1.5"
        >
          {/* 4 Identical Consecutive Groups: Guarantees 100% gapless coverage on all viewports up to 4K displays */}
          {[0, 1, 2, 3].map((idx) => renderLogoGroup(idx, idx === 0))}
        </motion.div>
      </div>
    </section>
  );
};
