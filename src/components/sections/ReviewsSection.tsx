import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useAnimationFrame,
  useInView,
  useReducedMotion,
  Transition,
} from 'framer-motion';
import {
  Star,
  CheckCircle2,
  X,
} from 'lucide-react';
import { PATIENT_REVIEWS, PatientReview } from '../../data/clinicalData';

type AnimationStage = 'initial' | 'center' | 'peeking' | 'expanding' | 'settling' | 'looping';

export const ReviewsSection: React.FC = () => {
  const [selectedReview, setSelectedReview] = useState<PatientReview | null>(null);
  const [stage, setStage] = useState<AnimationStage>('initial');
  const [isHovered, setIsHovered] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const sectionRef = useRef<HTMLDivElement>(null);
  const galleryContainerRef = useRef<HTMLDivElement>(null);
  const resumeTimeoutRef = useRef<number | null>(null);
  const hasTriggeredRef = useRef(false);

  const isInView = useInView(galleryContainerRef, {
    once: true,
    margin: '-15% 0px -25% 0px',
  });
  const shouldReduceMotion = useReducedMotion();

  // Screen size detection for responsive card width & gap
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );
  const [containerWidth, setContainerWidth] = useState(1200);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      if (galleryContainerRef.current) {
        setContainerWidth(galleryContainerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;
  const isTablet = windowWidth >= 640 && windowWidth < 1024;

  const cardWidth = isMobile ? 300 : isTablet ? 340 : 380;
  const cardGap = isMobile ? 16 : isTablet ? 20 : 24;
  const cardSlot = cardWidth + cardGap;
  const peekDistance = isMobile ? 20 : 42;

  // Construct looping set: ensure enough items so singleSetWidth > viewport
  const { loopBase, displayItems, singleSetWidth, centerIndex } = useMemo(() => {
    let base = [...PATIENT_REVIEWS];
    // Duplicate base until we have at least 6 cards for smooth wide looping
    while (base.length < 6 && base.length > 0) {
      base = [...base, ...PATIENT_REVIEWS];
    }
    // 3 full repetitions: [Copy 0 (preceding), Copy 1 (central set), Copy 2 (following)]
    const fullList = [...base, ...base, ...base];
    const setWidth = base.length * cardSlot;
    const cIndex = base.length; // First card of Copy 1 is our central Card 0!
    return { loopBase: base, displayItems: fullList, singleSetWidth: setWidth, centerIndex: cIndex };
  }, [cardSlot]);

  // Horizontal track anchor: positions Item centerIndex in the exact horizontal center of the gallery
  const initialTrackX = useMemo(() => {
    const halfWidth = Math.max(0, (containerWidth - cardWidth) / 2);
    return halfWidth - centerIndex * cardSlot;
  }, [containerWidth, cardWidth, centerIndex, cardSlot]);

  // Framer Motion continuous translation value for the track
  const trackX = useMotionValue(initialTrackX);

  // Keep trackX synchronized with initialTrackX if resized prior to looping
  useEffect(() => {
    if (stage !== 'looping') {
      trackX.set(initialTrackX);
    }
  }, [initialTrackX, stage, trackX]);

  // Unified, seamless entrance animation timeline
  useEffect(() => {
    if (!isInView || hasTriggeredRef.current) return;
    hasTriggeredRef.current = true;

    if (shouldReduceMotion) {
      setStage('looping');
      trackX.set(initialTrackX);
      return;
    }

    // Stage 1: Central card fades in and scales smoothly (650ms after heading)
    const t1 = setTimeout(() => {
      setStage('center');
    }, 650);

    // Stage 2: Cards peek out smoothly rotated (-5deg / +5deg) (1400ms)
    const t2 = setTimeout(() => {
      setStage('peeking');
    }, 1450);

    // Stage 3: All remaining cards emerge continuously from the center deck and expand outward (2450ms)
    const t3 = setTimeout(() => {
      setStage('expanding');
    }, 2450);

    if (isMobile) {
      // Mobile: Stage 3.5 -> Once cards spread into horizontal row (3600ms), smoothly scale up from 0.78 to 1.0
      const t3_5 = setTimeout(() => {
        setStage('settling');
      }, 3600);

      // Mobile: Stage 4 -> Marquee begins smoothly after cards have scaled up to full size (4500ms)
      const t4 = setTimeout(() => {
        setStage('looping');
      }, 4500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t3_5);
        clearTimeout(t4);
      };
    } else {
      // Desktop / iPad: Stage 4 begins at exactly 3850ms (strictly preserving existing approved timing)
      const t4 = setTimeout(() => {
        setStage('looping');
      }, 3850);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
        clearTimeout(t4);
      };
    }
  }, [isInView, shouldReduceMotion, initialTrackX, trackX, isMobile]);

  // Helper to schedule autoplay resumption with a quiet pause window
  const scheduleResume = useCallback((delayMs = 1800) => {
    if (resumeTimeoutRef.current) {
      window.clearTimeout(resumeTimeoutRef.current);
    }
    resumeTimeoutRef.current = window.setTimeout(() => {
      setIsHovered(false);
      setIsDragging(false);
    }, delayMs);
  }, []);

  // Continuous linear animation loop using useAnimationFrame
  useAnimationFrame((_, delta) => {
    if (
      stage !== 'looping' ||
      shouldReduceMotion ||
      isHovered ||
      isFocused ||
      isDragging ||
      singleSetWidth <= 0
    ) {
      return;
    }

    // Speed: ~32px per second (slow, refined editorial read rate)
    const speedPxPerMs = 0.032;
    const moveBy = delta * speedPxPerMs;

    let currentX = trackX.get() - moveBy;
    // Seamless wrap: when scrolled by singleSetWidth, wrap cleanly by singleSetWidth
    if (currentX <= initialTrackX - singleSetWidth) {
      currentX += singleSetWidth;
    }
    trackX.set(currentX);
  });

  // Modal keyboard listener (Escape key to dismiss)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedReview) {
        setSelectedReview(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedReview]);

  /**
   * Continuous transform calculations for each card:
   * Every card i naturally sits at index * cardSlot in the flex row.
   * When transform x = -index * cardSlot, the card is physically positioned directly at the Card 0 origin!
   * As transform x -> 0, the card smoothly slides from the central stack to its resting horizontal row slot!
   */
  const getCardTransform = (index: number): {
    x: number;
    y: number;
    rotate: number;
    scale: number;
    opacity: number;
    transition?: Transition;
  } => {
    const d = index - centerIndex;
    const isCenter = d === 0;
    const isLeftPeeker = d === -1;
    const isRightPeeker = d === 1;

    // Mobile-specific compact deck scale (0.78 fits 360px-430px screens with zero clipping)
    const mobileDeckScale = 0.78;
    const centerRevealScale = isMobile ? mobileDeckScale : 1;
    const deckTuckedScale = isMobile ? mobileDeckScale * 0.94 : 0.92;
    const peekerScale = isMobile ? mobileDeckScale : 0.96;
    const expandingScale = isMobile ? mobileDeckScale : 1;

    // Stage: looping or reduced-motion -> all cards settled at resting positions (x: 0, scale: 1)
    if (stage === 'looping' || shouldReduceMotion) {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        transition: {
          type: 'spring' as const,
          stiffness: 160,
          damping: 22,
        },
      };
    }

    // Stage: settling -> Cards have unfolded horizontally; on mobile, smoothly scale up to full 1.0 display size
    if (stage === 'settling') {
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: 1,
        opacity: 1,
        transition: isMobile
          ? {
              type: 'spring' as const,
              stiffness: 120,
              damping: 18,
              mass: 0.8,
            }
          : {
              duration: 0.1,
            },
      };
    }

    // Stage: initial -> all cards tucked behind Center at visual offset 0 (x = -d * cardSlot)
    if (stage === 'initial') {
      return {
        x: -d * cardSlot,
        y: 16,
        rotate: 0,
        scale: isMobile ? mobileDeckScale * 0.9 : 0.88,
        opacity: 0,
        transition: { duration: 0.1 },
      };
    }

    // Stage: center -> Center card reveals smoothly; all others remain tucked behind Center card
    if (stage === 'center') {
      if (isCenter) {
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: centerRevealScale,
          opacity: 1,
          transition: {
            duration: 0.65,
            ease: [0.16, 1, 0.3, 1],
          },
        };
      }
      return {
        x: -d * cardSlot,
        y: 0,
        rotate: 0,
        scale: deckTuckedScale,
        opacity: 0,
        transition: { duration: 0.2 },
      };
    }

    // Stage: peeking -> Left peeker peeks left (-peekDistance, -4.5deg / -5deg); Right peeker peeks right (+peekDistance, +4.5deg / +5deg)
    if (stage === 'peeking') {
      const peekerRotation = isMobile ? 4.5 : 5;
      if (isCenter) {
        return {
          x: 0,
          y: 0,
          rotate: 0,
          scale: centerRevealScale,
          opacity: 1,
          transition: { duration: 0.4 },
        };
      }
      if (isLeftPeeker) {
        // Natural flex offset is -cardSlot relative to Center.
        // To visually place card at -peekDistance: (-cardSlot) + x = -peekDistance => x = cardSlot - peekDistance
        return {
          x: cardSlot - peekDistance,
          y: 0,
          rotate: -peekerRotation,
          scale: peekerScale,
          opacity: 1,
          transition: {
            type: 'spring' as const,
            stiffness: 150,
            damping: 18,
          },
        };
      }
      if (isRightPeeker) {
        // Natural flex offset is +cardSlot relative to Center.
        // To visually place card at +peekDistance: (+cardSlot) + x = +peekDistance => x = -cardSlot + peekDistance
        return {
          x: -cardSlot + peekDistance,
          y: 0,
          rotate: peekerRotation,
          scale: peekerScale,
          opacity: 1,
          transition: {
            type: 'spring' as const,
            stiffness: 150,
            damping: 18,
          },
        };
      }
      // Other cards (|d| >= 2) stay tucked behind Center card
      return {
        x: -d * cardSlot,
        y: 0,
        rotate: 0,
        scale: deckTuckedScale,
        opacity: 0,
        transition: { duration: 0.2 },
      };
    }

    // Stage: expanding -> ALL cards smoothly emerge from the central stack into their horizontal row slots (x: 0)
    if (stage === 'expanding') {
      const absD = Math.abs(d);
      const staggerDelay = isCenter ? 0 : isLeftPeeker || isRightPeeker ? 0.04 : 0.08 + (absD - 2) * 0.06;
      return {
        x: 0,
        y: 0,
        rotate: 0,
        scale: expandingScale,
        opacity: 1,
        transition: {
          type: 'spring' as const,
          stiffness: 140,
          damping: 20,
          mass: 0.9,
          delay: staggerDelay,
        },
      };
    }

    return { x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 };
  };

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="bg-transparent py-14 sm:py-20 md:py-24 relative overflow-hidden select-none"
      aria-label="Verified Patient Reviews Gallery"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ============================================================== */}
        {/* 1. SECTION HEADING (Right-aligned, matching About JJ Nutrition) */}
        {/* ============================================================== */}
        <div className="w-full flex justify-end text-right mb-8 sm:mb-10 md:mb-12">
          <motion.h2
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-sans text-3xl sm:text-4xl md:text-[44px] text-[#111827] uppercase font-normal leading-tight text-right max-w-2xl"
          >
            Real Patients, <br />
            <span className="text-accent font-medium">Restored Cellular Vitality.</span>
          </motion.h2>
        </div>

        {/* ============================================================== */}
        {/* 2. PREMIUM ANIMATED REVIEW GALLERY CONTAINER                   */}
        {/* Single, permanent, stable flex track for all animation stages  */}
        {/* ============================================================== */}
        <div
          ref={galleryContainerRef}
          className="relative w-full overflow-hidden py-3"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => scheduleResume(1400)}
          onFocusCapture={() => setIsFocused(true)}
          onBlurCapture={() => scheduleResume(1400)}
        >
          {/* Edge lateral gradient masks for smooth soft fade */}
          <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-r from-[#F7FAFD] to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-24 bg-gradient-to-l from-[#F7FAFD] to-transparent z-20 pointer-events-none" />

          <motion.div
            style={{ x: trackX }}
            drag={stage === 'looping' ? 'x' : false}
            dragConstraints={{
              left: initialTrackX - singleSetWidth,
              right: initialTrackX,
            }}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={() => {
              setIsDragging(false);
              scheduleResume(2000);
            }}
            className="flex items-stretch cursor-grab active:cursor-grabbing will-change-transform"
          >
            {displayItems.map((review, index) => {
              const isDuplicate = index < centerIndex || index >= centerIndex + loopBase.length;
              const cardAnim = getCardTransform(index);
              const absD = Math.abs(index - centerIndex);
              const zIndexValue =
                stage === 'looping'
                  ? 1
                  : absD === 0
                  ? 30
                  : absD === 1
                  ? 20
                  : Math.max(1, 18 - absD);

              return (
                <motion.div
                  key={`review-${review.id}-${index}`}
                  animate={{
                    x: cardAnim.x,
                    y: cardAnim.y,
                    rotate: cardAnim.rotate,
                    scale: cardAnim.scale,
                    opacity: cardAnim.opacity,
                  }}
                  transition={cardAnim.transition}
                  style={{
                    width: cardWidth,
                    marginRight: cardGap,
                    zIndex: zIndexValue,
                  }}
                  className="flex-shrink-0 flex flex-col will-change-transform"
                  aria-hidden={isDuplicate}
                >
                  <ReviewCardContent
                    review={review}
                    isDuplicate={isDuplicate}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. ACCESSIBLE FULL STORY MODAL DIALOG                          */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedReview && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/40 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-review-title"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-8 border border-border-blue shadow-2xl overflow-y-auto max-h-[85vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedReview(null)}
                aria-label="Close review dialog"
                className="absolute top-5 right-5 p-2 rounded-full bg-surface-pale text-[#333333] hover:text-[#111827] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Review Details */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs uppercase font-bold px-3 py-1 rounded-full bg-surface-pale text-accent">
                  {selectedReview.serviceFocus}
                </span>
                <div className="flex items-center gap-0.5 text-[#F59E0B] ml-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
                  ))}
                </div>
              </div>

              <h3 id="modal-review-title" className="font-montserrat text-xl sm:text-2xl font-medium text-[#111827] mb-4">
                "{selectedReview.quoteTitle}"
              </h3>

              <p className="text-[#1A1A1A] text-sm sm:text-base leading-relaxed mb-6 font-montserrat font-normal">
                "{selectedReview.reviewText}"
              </p>

              {/* Patient Info */}
              <div className="pt-4 border-t border-border-blue/70 mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-montserrat font-medium text-[#111827] text-base">{selectedReview.patientName}</span>
                  <span className="text-xs text-accent font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified Patient
                  </span>
                </div>
                <p className="text-xs text-[#555555]">{selectedReview.location} • {selectedReview.date}</p>
              </div>

              {/* Practitioner Note */}
              <div className="p-4 rounded-2xl bg-surface-light border border-border-blue">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0789D2] block mb-1">
                  Practitioner Selvi's Clinical Note:
                </span>
                <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed italic font-montserrat">
                  "{selectedReview.practitionerNote}"
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

// ==============================================================
// REUSABLE CARD COMPONENT CONTENT
// ==============================================================
interface ReviewCardContentProps {
  review: PatientReview;
  isDuplicate?: boolean;
}

const ReviewCardContent: React.FC<ReviewCardContentProps> = ({
  review,
}) => {
  return (
    <div className="w-full h-full p-6 sm:p-7 rounded-3xl bg-white border border-[#DCE8F1] shadow-[0_4px_20px_rgba(16,36,61,0.04)] hover:shadow-[0_8px_28px_rgba(16,36,61,0.08)] transition-all duration-300 flex flex-col justify-between text-left">
      {/* Top Content: Star Rating + Headline + Review Body */}
      <div>
        {/* Star Rating in Consistent Warm Gold */}
        <div className="flex items-center gap-1 mb-3.5 text-[#F59E0B]" aria-label={`${review.rating || 5} out of 5 stars`}>
          {[...Array(review.rating || 5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#F59E0B] text-[#F59E0B]" />
          ))}
        </div>

        {/* Review Headline / Title — Montserrat Medium (500) */}
        <h4 className="font-montserrat text-base sm:text-lg font-medium text-[#111827] mb-2.5 line-clamp-2 leading-snug">
          "{review.quoteTitle}"
        </h4>

        {/* Review Description */}
        <p className="text-[#1A1A1A] text-xs sm:text-sm leading-relaxed font-normal line-clamp-5 font-montserrat">
          "{review.reviewText}"
        </p>
      </div>

      {/* Card Bottom: Reviewer Name & Location / Date — Montserrat Medium (500) */}
      <div className="pt-4 mt-5 border-t border-[#DCE8F1]">
        <h5 className="font-montserrat font-medium text-[#111827] text-sm sm:text-base leading-tight mb-1">
          {review.patientName}
        </h5>
        <p className="text-[11px] sm:text-xs text-[#555555] font-montserrat font-normal">
          {review.location} • {review.date}
        </p>
      </div>
    </div>
  );
};
