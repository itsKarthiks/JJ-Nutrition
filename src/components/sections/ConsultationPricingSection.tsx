import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Clock, Check, ChevronDown, ArrowUpRight } from 'lucide-react';
import { CONSULTATION_TIERS } from '../../data/clinicalData';

interface ConsultationPricingSectionProps {
  onSelectTier: (tierId: string) => void;
}

export const ConsultationPricingSection: React.FC<ConsultationPricingSectionProps> = ({
  onSelectTier,
}) => {
  const [expandedTierId, setExpandedTierId] = useState<string | null>(null);
  const shouldReduceMotion = useReducedMotion();

  const toggleExpand = (id: string) => {
    setExpandedTierId((prev) => (prev === id ? null : id));
  };

  return (
    <section
      id="consultations"
      className="bg-transparent py-16 sm:py-20 md:py-24 relative overflow-hidden scroll-mt-20 md:scroll-mt-28"
      aria-label="Clinical Consultation Packages"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================== */}
        {/* 1. SECTION HEADING (Natural flow with zero pill / currency)   */}
        {/* ============================================================== */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12 lg:mb-14">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6 }}
            className="font-sans text-3xl sm:text-4xl md:text-5xl text-[#111827] uppercase font-normal leading-tight mb-3 sm:mb-4"
          >
            SELECT YOUR CONSULTATION TIER <br />
            <span className="text-accent font-medium">& BEGIN YOUR HEALTH RECOVERY</span>
          </motion.h2>

          <motion.p
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#1A1A1A] text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl mx-auto font-montserrat"
          >
            Clear, honest pricing with zero hidden subscription locks. Choose the consultation depth
            that fits your clinical situation.
          </motion.p>
        </div>

        {/* ============================================================== */}
        {/* 2. THREE CONSULTATION CARDS (Equal collapsed heights, expandable)*/}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 items-start">
          {CONSULTATION_TIERS.map((tier, idx) => {
            const isExpanded = expandedTierId === tier.id;

            return (
              <motion.div
                key={tier.id}
                initial={shouldReduceMotion ? {} : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
                whileHover={shouldReduceMotion ? {} : { y: -3 }}
                viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
                transition={{
                  duration: 0.5,
                  delay: shouldReduceMotion ? 0 : idx * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="rounded-3xl p-6 sm:p-7 lg:p-8 bg-white border border-[#DCE8F1] shadow-[0_4px_20px_rgba(16,36,61,0.04)] hover:shadow-[0_8px_28px_rgba(16,36,61,0.08)] transition-all duration-300 flex flex-col items-center text-center relative min-h-[350px] sm:min-h-[360px] md:min-h-[416px] lg:min-h-[370px] justify-between"
              >
                {/* Top Block: Title, Duration, Price, Subtitle, Show/Hide */}
                <div className="w-full flex flex-col items-center text-center">
                  {/* 1. Plan Name (Centred, Montserrat Medium 500, fixed height slot for exact row alignment) */}
                  <div className="min-h-[32px] md:min-h-[56px] lg:min-h-[36px] flex items-center justify-center mb-1.5 w-full">
                    <h3 className="font-montserrat text-xl sm:text-2xl lg:text-[24px] font-medium text-[#111827] leading-tight">
                      {tier.name}
                    </h3>
                  </div>

                  {/* 2. Duration (Centred, Montserrat Regular 400) */}
                  <div className="flex items-center justify-center gap-1.5 text-[#555555] mb-3 h-5">
                    <Clock className="w-3.5 h-3.5 text-accent flex-shrink-0" strokeWidth={1.85} />
                    <span className="font-montserrat text-xs font-normal uppercase tracking-wider">
                      {tier.duration}
                    </span>
                  </div>

                  {/* 3. Price (Centred, Bold 700) */}
                  <div className="mb-3 flex items-center justify-center h-12">
                    <span className="font-montserrat text-4xl sm:text-5xl font-bold text-[#111827] tracking-tight">
                      A${tier.priceAUD}
                    </span>
                  </div>

                  {/* 4. Short Description (Centred, Montserrat Regular 400, equal height slot for identical collapsed card heights) */}
                  <div className="min-h-[44px] md:min-h-[66px] lg:min-h-[44px] flex items-center justify-center mb-3 w-full">
                    <p className="font-montserrat text-xs sm:text-sm text-[#333333] font-normal leading-relaxed max-w-xs px-1">
                      {tier.subtitle}
                    </p>
                  </div>

                  {/* 5. Show / Hide Control (Understated, Centred, Montserrat Regular 400) */}
                  <button
                    type="button"
                    onClick={() => toggleExpand(tier.id)}
                    aria-expanded={isExpanded}
                    className="inline-flex items-center justify-center gap-1.5 text-xs font-normal text-accent hover:text-accent-strong transition-colors cursor-pointer select-none py-1 px-3 rounded-full hover:bg-surface-pale/60 group mb-3"
                  >
                    <span className="font-montserrat font-normal">{isExpanded ? 'Hide' : 'Show'}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-300 ${
                        isExpanded ? 'rotate-180 text-accent-strong' : 'text-accent group-hover:translate-y-0.5'
                      }`}
                    />
                  </button>

                  {/* 6. Expandable Inclusions (Expands naturally when clicked, Montserrat Regular 400) */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key={`expanded-${tier.id}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden w-full mb-4"
                      >
                        <div className="pt-4 pb-1 border-t border-[#DCE8F1] text-left w-full">
                          <span className="text-[11px] font-normal uppercase tracking-wider text-[#111827] block mb-3 font-montserrat text-center sm:text-left">
                            INCLUDED IN THIS CONSULTATION:
                          </span>
                          <ul className="space-y-2.5">
                            {tier.features.map((feature, fIdx) => (
                              <li
                                key={fIdx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1A1A1A] font-montserrat font-normal leading-snug"
                              >
                                <Check className="w-4 h-4 text-accent flex-shrink-0 mt-0.5" strokeWidth={2} />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 7. Select & Schedule Button (Pill-shaped, sky-blue, bottom of card) */}
                <div className="w-full mt-auto pt-2">
                  <motion.button
                    type="button"
                    onClick={() => onSelectTier(tier.id)}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    className="w-full group inline-flex items-center justify-between gap-3 pl-6 pr-2 py-2 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_16px_rgba(66,169,229,0.3)] hover:shadow-[0_6px_22px_rgba(7,137,210,0.4)] cursor-pointer select-none"
                  >
                    <span className="font-montserrat text-xs sm:text-sm font-semibold tracking-wide mx-auto">
                      Select & Schedule
                    </span>
                    <span className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                      <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
