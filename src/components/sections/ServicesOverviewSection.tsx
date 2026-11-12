import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useReducedMotion,
  Variants,
} from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { CLINICAL_SERVICES, ClinicalService } from '../../data/clinicalData';
import ScrollReveal from '../ui/ScrollReveal';

interface ServicesOverviewSectionProps {
  onSelectService?: (service: ClinicalService) => void;
  onBookService: (serviceId: string) => void;
}

// Background images curated for the 10 clinical protocols (subtle, science-grounded botanicals & cellular nutrition)
const SERVICE_BACKGROUND_IMAGES: Record<string, string> = {
  'cardiovascular-combo':
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80',
  'detox-weight-loss':
    'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1200&q=80',
  'bone-health':
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  'energy-enhancement':
    'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1200&q=80',
  'insomnia-support':
    'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&w=1200&q=80',
  'anxiety-support':
    'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=1200&q=80',
  'ulcer-healing':
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
  'alcohol-weaning':
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'iron-deficiency':
    'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80',
  'prostate-health':
    'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=1200&q=80',
};

export const ServicesOverviewSection: React.FC<ServicesOverviewSectionProps> = ({
  onBookService,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const runwayRef = useRef<HTMLDivElement>(null);
  const mobilePillsRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Screen size detection for responsive behavior & discrete mobile gestures
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 768;

  // 10 Clinical Services derived strictly from clinicalData.ts
  const services = useMemo(() => CLINICAL_SERVICES.slice(0, 10), []);
  const activeService = services[activeIndex] || services[0];

  // Desktop/iPad: Framer Motion useScroll tied directly to the runway container
  const { scrollYProgress } = useScroll({
    target: runwayRef,
    offset: ['start start', 'end end'],
  });

  // Map scroll progress (0..1) directly across the 10 discrete service states for Desktop/iPad only
  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    if (shouldReduceMotion || isMobile) return;
    const clamped = Math.max(0, Math.min(0.999, latest));
    const newIdx = Math.min(services.length - 1, Math.floor(clamped * services.length));
    if (newIdx !== activeIndex) {
      setActiveIndex(newIdx);
    }
  });

  // Mobile discrete one-swipe-one-service gesture tracking & pinned scroll state machine
  type MobileServicesState =
    | 'BEFORE_SERVICES'
    | 'ACTIVATING'
    | 'SERVICE_ACTIVE'
    | 'TRANSITIONING'
    | 'AFTER_SERVICES';

  const [, setMobileState] = useState<MobileServicesState>('BEFORE_SERVICES');
  const mobileStateRef = useRef<MobileServicesState>('BEFORE_SERVICES');

  const activeIndexRef = useRef(activeIndex);
  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);

  const transitionLockRef = useRef(false);
  const ignoreGestureRef = useRef(false);
  const isLeavingRef = useRef<'down' | 'up' | null>(null);
  const pinnedScrollYRef = useRef<number | null>(null);
  const mobileExplorerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const el = mobileExplorerRef.current;
    if (!el) return;

    const PIN_TARGET = 84; // Sticky top offset under floating navbar

    const getTargetScrollY = () => {
      const rect = el.getBoundingClientRect();
      return Math.round(rect.top + window.scrollY - PIN_TARGET);
    };

    // Initialize initial state based on current scroll position
    const initRect = el.getBoundingClientRect();
    if (initRect.top > PIN_TARGET + 10) {
      mobileStateRef.current = 'BEFORE_SERVICES';
      setMobileState('BEFORE_SERVICES');
      pinnedScrollYRef.current = null;
    } else if (initRect.top <= PIN_TARGET + 10 && initRect.bottom > 200) {
      mobileStateRef.current = 'SERVICE_ACTIVE';
      setMobileState('SERVICE_ACTIVE');
      pinnedScrollYRef.current = getTargetScrollY();
    } else {
      mobileStateRef.current = 'AFTER_SERVICES';
      setMobileState('AFTER_SERVICES');
      pinnedScrollYRef.current = null;
    }

    const handleBoundaryScroll = () => {
      const state = mobileStateRef.current;
      const rect = el.getBoundingClientRect();

      if (state === 'BEFORE_SERVICES') {
        // If actively transitioning upward out of services, disarm until clearly in About Selvi
        if (isLeavingRef.current === 'up') {
          if (rect.top > PIN_TARGET + 50) {
            isLeavingRef.current = null;
          }
          return;
        }

        // Entering from above: when top of explorer reaches the pinned line
        if (rect.top <= PIN_TARGET + 6 && rect.bottom > 200) {
          mobileStateRef.current = 'SERVICE_ACTIVE';
          setMobileState('SERVICE_ACTIVE');
          const targetY = getTargetScrollY();
          pinnedScrollYRef.current = targetY;
          window.scrollTo({ top: targetY, behavior: 'instant' });
          setActiveIndex(0);
          activeIndexRef.current = 0;
          ignoreGestureRef.current = true;
        }
      } else if (state === 'AFTER_SERVICES') {
        // If actively transitioning downward out of services, disarm until clearly in Consultations
        if (isLeavingRef.current === 'down') {
          if (rect.top < PIN_TARGET - 50) {
            isLeavingRef.current = null;
          }
          return;
        }

        // Entering from below: when top of explorer reaches the pinned line from negative coordinates
        if (rect.top >= PIN_TARGET - 8 && rect.top <= window.innerHeight * 0.45) {
          mobileStateRef.current = 'SERVICE_ACTIVE';
          setMobileState('SERVICE_ACTIVE');
          const targetY = getTargetScrollY();
          pinnedScrollYRef.current = targetY;
          window.scrollTo({ top: targetY, behavior: 'instant' });
          setActiveIndex(services.length - 1);
          activeIndexRef.current = services.length - 1;
          ignoreGestureRef.current = true;
        }
      } else if (state === 'SERVICE_ACTIVE' || state === 'TRANSITIONING') {
        // While active, lock viewport scroll to targetY against inertia/momentum fling,
        // unless an exit transition is in flight
        if (isLeavingRef.current === null && pinnedScrollYRef.current !== null) {
          if (Math.abs(window.scrollY - pinnedScrollYRef.current) > 2) {
            window.scrollTo({ top: pinnedScrollYRef.current, behavior: 'instant' });
          }
        }
      }
    };

    let startY = 0;
    let startX = 0;
    let touchTracking = false;
    let isPillsTouch = false;

    const onTouchStart = (e: TouchEvent) => {
      const state = mobileStateRef.current;
      if (state !== 'SERVICE_ACTIVE' && state !== 'TRANSITIONING') {
        touchTracking = false;
        return;
      }

      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
      touchTracking = true;
      isPillsTouch = !!mobilePillsRef.current?.contains(e.target as Node);
      ignoreGestureRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!touchTracking) return;
      const state = mobileStateRef.current;
      if (state !== 'SERVICE_ACTIVE' && state !== 'TRANSITIONING') return;

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = startY - currentY;
      const diffX = startX - currentX;

      // Allow smooth horizontal swiping on the pill buttons
      if (Math.abs(diffX) > Math.abs(diffY) && isPillsTouch) {
        return;
      }

      // If user is at Service 10 and scrolling DOWN (swiping UP): DO NOT preventDefault!
      if (diffY > 0 && activeIndexRef.current >= services.length - 1) {
        return;
      }

      // If user is at Service 01 and scrolling UP (swiping DOWN): DO NOT preventDefault!
      if (diffY < 0 && activeIndexRef.current <= 0) {
        return;
      }

      // For all internal transitions (01->02...09, or 10->09...02), intercept to keep pinned
      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!touchTracking) return;
      touchTracking = false;

      if (ignoreGestureRef.current) {
        ignoreGestureRef.current = false;
        return;
      }

      const state = mobileStateRef.current;
      if (state !== 'SERVICE_ACTIVE') return;
      if (transitionLockRef.current) return;

      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const diffY = startY - endY;
      const diffX = startX - endX;

      if (Math.abs(diffX) > Math.abs(diffY)) return;

      const SWIPE_THRESHOLD = 30;

      // Swipe UP: advance service OR release down to Consultations
      if (diffY > SWIPE_THRESHOLD) {
        if (activeIndexRef.current < services.length - 1) {
          transitionLockRef.current = true;
          mobileStateRef.current = 'TRANSITIONING';
          setMobileState('TRANSITIONING');
          const next = activeIndexRef.current + 1;
          activeIndexRef.current = next;
          setActiveIndex(next);
          setTimeout(() => {
            transitionLockRef.current = false;
            if (mobileStateRef.current === 'TRANSITIONING') {
              mobileStateRef.current = 'SERVICE_ACTIVE';
              setMobileState('SERVICE_ACTIVE');
            }
          }, 380);
        } else {
          // Reached Service 10 -> immediately release scroll lock and smoothly glide to Consultations
          mobileStateRef.current = 'AFTER_SERVICES';
          setMobileState('AFTER_SERVICES');
          isLeavingRef.current = 'down';
          pinnedScrollYRef.current = null;
          const consultEl = document.getElementById('consultations');
          if (consultEl) {
            consultEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
          }
        }
      }
      // Swipe DOWN: reverse service OR release up to About Selvi
      else if (diffY < -SWIPE_THRESHOLD) {
        if (activeIndexRef.current > 0) {
          transitionLockRef.current = true;
          mobileStateRef.current = 'TRANSITIONING';
          setMobileState('TRANSITIONING');
          const prev = activeIndexRef.current - 1;
          activeIndexRef.current = prev;
          setActiveIndex(prev);
          setTimeout(() => {
            transitionLockRef.current = false;
            if (mobileStateRef.current === 'TRANSITIONING') {
              mobileStateRef.current = 'SERVICE_ACTIVE';
              setMobileState('SERVICE_ACTIVE');
            }
          }, 380);
        } else {
          // Reached Service 01 -> immediately release scroll lock and smoothly glide to About Selvi
          mobileStateRef.current = 'BEFORE_SERVICES';
          setMobileState('BEFORE_SERVICES');
          isLeavingRef.current = 'up';
          pinnedScrollYRef.current = null;
          const aboutEl = document.getElementById('about-selvi');
          if (aboutEl) {
            aboutEl.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.scrollBy({ top: -window.innerHeight * 0.8, behavior: 'smooth' });
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      const state = mobileStateRef.current;
      if (state !== 'SERVICE_ACTIVE' && state !== 'TRANSITIONING') return;

      if (transitionLockRef.current) return;
      if (Math.abs(e.deltaY) < 15) return;

      if (e.deltaY > 0) {
        if (activeIndexRef.current < services.length - 1) {
          if (e.cancelable) e.preventDefault();
          transitionLockRef.current = true;
          mobileStateRef.current = 'TRANSITIONING';
          setMobileState('TRANSITIONING');
          const next = activeIndexRef.current + 1;
          activeIndexRef.current = next;
          setActiveIndex(next);
          setTimeout(() => {
            transitionLockRef.current = false;
            if (mobileStateRef.current === 'TRANSITIONING') {
              mobileStateRef.current = 'SERVICE_ACTIVE';
              setMobileState('SERVICE_ACTIVE');
            }
          }, 380);
        } else {
          // Beyond Service 10: DO NOT preventDefault()! Release to Consultations
          mobileStateRef.current = 'AFTER_SERVICES';
          setMobileState('AFTER_SERVICES');
          isLeavingRef.current = 'down';
          pinnedScrollYRef.current = null;
          const consultEl = document.getElementById('consultations');
          if (consultEl) {
            consultEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } else {
        if (activeIndexRef.current > 0) {
          if (e.cancelable) e.preventDefault();
          transitionLockRef.current = true;
          mobileStateRef.current = 'TRANSITIONING';
          setMobileState('TRANSITIONING');
          const prev = activeIndexRef.current - 1;
          activeIndexRef.current = prev;
          setActiveIndex(prev);
          setTimeout(() => {
            transitionLockRef.current = false;
            if (mobileStateRef.current === 'TRANSITIONING') {
              mobileStateRef.current = 'SERVICE_ACTIVE';
              setMobileState('SERVICE_ACTIVE');
            }
          }, 380);
        } else {
          // Before Service 01: DO NOT preventDefault()! Release to About Selvi
          mobileStateRef.current = 'BEFORE_SERVICES';
          setMobileState('BEFORE_SERVICES');
          isLeavingRef.current = 'up';
          pinnedScrollYRef.current = null;
          const aboutEl = document.getElementById('about-selvi');
          if (aboutEl) {
            aboutEl.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    const onResize = () => {
      if (mobileStateRef.current === 'SERVICE_ACTIVE' && el) {
        pinnedScrollYRef.current = getTargetScrollY();
      }
    };

    window.addEventListener('scroll', handleBoundaryScroll, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: false });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleBoundaryScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', onResize);
    };
  }, [isMobile, services.length]);

  // Keep mobile active pill centered when index changes
  const isFirstMountRef = useRef(true);
  useEffect(() => {
    if (isFirstMountRef.current) {
      isFirstMountRef.current = false;
      return;
    }
    if (mobilePillsRef.current) {
      const activePill = mobilePillsRef.current.children[activeIndex] as HTMLElement;
      if (activePill) {
        const container = mobilePillsRef.current;
        const pillLeft = activePill.offsetLeft;
        const pillWidth = activePill.offsetWidth;
        const containerWidth = container.offsetWidth;
        const targetScrollLeft = pillLeft - containerWidth / 2 + pillWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth',
        });
      }
    }
  }, [activeIndex]);

  // Handle direct click on any list item or pill to jump to that service
  const handleSelectIndex = useCallback(
    (index: number) => {
      setActiveIndex(index);
      activeIndexRef.current = index;
      if (isMobile) {
        if (mobileStateRef.current !== 'SERVICE_ACTIVE' && mobileStateRef.current !== 'TRANSITIONING') {
          mobileStateRef.current = 'SERVICE_ACTIVE';
          setMobileState('SERVICE_ACTIVE');
          if (mobileExplorerRef.current) {
            const rect = mobileExplorerRef.current.getBoundingClientRect();
            const targetY = Math.round(rect.top + window.scrollY - 84);
            pinnedScrollYRef.current = targetY;
            window.scrollTo({ top: targetY, behavior: 'instant' });
          }
        }
      } else if (runwayRef.current) {
        const rect = runwayRef.current.getBoundingClientRect();
        const runwayTop = window.scrollY + rect.top;
        const runwayHeight = rect.height;
        const viewportHeight = window.innerHeight;
        const scrollableDistance = runwayHeight - viewportHeight;
        if (scrollableDistance > 0) {
          const targetY = runwayTop + (index / (services.length - 1)) * scrollableDistance;
          window.scrollTo({ top: targetY, behavior: 'smooth' });
        }
      }
    },
    [services.length, isMobile]
  );

  const headingContainerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.14,
        delayChildren: 0.05,
      },
    },
  };

  const headingLineVariants: Variants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  // Staggered motion variants for smooth service-to-service content transitions inside the detail card
  const cardContentContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.02,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 0.18,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  const cardContentItemVariants: Variants = {
    hidden: { opacity: 0, y: 8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <section
      id="services"
      className="bg-transparent relative overflow-visible py-4 sm:py-8 md:py-20 scroll-mt-16 md:scroll-mt-24"
      aria-label="Targeted Clinical Nutrition & Supplement Protocols"
    >
      {/* ============================================================== */}
      {/* 1. SECTION INTRODUCTION (Line-by-line reveal animation)        */}
      {/* Desktop: Generous editorial spacing | Mobile: Compact & fitted */}
      {/* ============================================================== */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-3 sm:mb-4 md:mb-12 lg:mb-14 pt-2 sm:pt-4 md:pt-0">
        <motion.h2
          variants={headingContainerVariants}
          initial={shouldReduceMotion ? {} : 'hidden'}
          whileInView={shouldReduceMotion ? {} : 'visible'}
          viewport={{ once: true, margin: '-15% 0px -20% 0px' }}
          className="font-sans text-[22px] sm:text-[26px] md:text-[46px] lg:text-[52px] text-[#111827] uppercase font-normal leading-tight mb-2 md:mb-4 text-center"
        >
          <motion.span variants={headingLineVariants} className="block">
            TARGETED CLINICAL NUTRITION
          </motion.span>
          <motion.span variants={headingLineVariants} className="block text-accent font-medium">
            & SUPPLEMENT PROTOCOLS
          </motion.span>
        </motion.h2>

        <div className="max-w-2xl mx-auto text-center">
          <ScrollReveal
            splitBy="lines"
            mode="scrub"
            effect="rise"
            baseOffset={14}
            baseOpacity={0.15}
            as="p"
            textClassName="text-[#1A1A1A] text-[13.5px] sm:text-[15px] md:text-[19px] lg:text-[20px] leading-relaxed font-normal text-center font-montserrat line-clamp-2 md:line-clamp-none"
            containerClassName="text-center"
          >
            Every protocol is grounded in peer-reviewed clinical research. We address the biological root
            causes of chronic symptoms using precision nutrition, bioavailable nutrient cofactors, and
            pharmaceutical safety screening.
          </ScrollReveal>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. PINNED RUNWAY CONTAINER                                     */}
      {/* Desktop/iPad: 360vh runway | Mobile: Auto height with swipe    */}
      {/* ============================================================== */}
      <div
        ref={runwayRef}
        className="relative w-full"
        style={{
          height: isMobile || shouldReduceMotion ? 'auto' : '360vh',
        }}
      >
        {/* ============================================================ */}
        {/* STICKY EXPLORER PANEL                                        */}
        {/* ============================================================ */}
        <div className="sticky top-[84px] md:top-[96px] w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-20">
          
          {/* ========================================================== */}
          {/* DESKTOP & IPAD TWO-COLUMN LAYOUT (md+)                     */}
          {/* LEFT: 10 Service Headings with subtle horizontal dividers  */}
          {/* RIGHT: Large Dynamic Detail Card with botanical imagery    */}
          {/* ========================================================== */}
          <div className="hidden md:flex items-stretch gap-6 lg:gap-10 h-[calc(100vh-130px)] min-h-[560px] max-h-[660px]">
            
            {/* LEFT COLUMN: Ten Service Headings (~34%) */}
            <div className="w-[35%] lg:w-[33%] xl:w-[31%] flex-shrink-0 flex flex-col justify-between py-1 pr-2">
              <div className="flex flex-col justify-between h-full divide-y divide-[#111827]/25 border-y border-[#111827]/25">
                {services.map((service, index) => {
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={service.id}
                      onClick={() => handleSelectIndex(index)}
                      className="group flex items-center text-left py-2.5 lg:py-3 px-3 transition-colors duration-200 relative cursor-pointer select-none"
                    >
                      {/* Active Indicator Bar (Animated Spring) */}
                      {isActive && (
                        <motion.div
                          layoutId="active-service-bar"
                          className="absolute left-0 top-2 bottom-2 w-1 rounded-full bg-accent"
                          transition={{
                            type: 'spring',
                            stiffness: 300,
                            damping: 30,
                          }}
                        />
                      )}

                      {/* Sequence Number: Smaller and visually secondary */}
                      <span
                        className={`font-mono text-[13px] lg:text-[14px] mr-3.5 transition-colors duration-200 flex-shrink-0 ${
                          isActive
                            ? 'text-accent font-semibold'
                            : 'text-[#555555] font-normal group-hover:text-[#111827]'
                        }`}
                      >
                        {service.number}
                      </span>

                      {/* Service Title — Montserrat Regular (400) / Active Medium (500), slightly enlarged for high readability */}
                      <span
                        className={`font-montserrat text-[17px] md:text-[18px] xl:text-[19px] leading-snug transition-all duration-200 line-clamp-1 ${
                          isActive
                            ? 'text-[#111827] font-medium tracking-tight'
                            : 'text-[#333333] font-normal group-hover:text-[#111827]'
                        }`}
                      >
                        {service.title}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT COLUMN: Large Dynamic Detail Card (~66%) */}
            <div className="flex-1 h-full relative rounded-3xl overflow-hidden border border-border-blue/80 shadow-[0_8px_30px_rgba(16,36,61,0.06)] bg-white flex flex-col">
              
              {/* Restrained Sky Blue Gradient in Top-Left Corner */}
              <div
                className="absolute top-0 left-0 w-80 h-80 pointer-events-none z-10"
                style={{
                  background:
                    'radial-gradient(circle at top left, rgba(66, 169, 229, 0.12) 0%, rgba(232, 245, 252, 0.05) 50%, transparent 75%)',
                }}
              />

              {/* Background Images Layer: Visible at bottom, fading towards transparent at top */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  maskImage:
                    'linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.03) 78%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.03) 78%, transparent 100%)',
                }}
              >
                {services.map((srv, idx) => {
                  const isCur = idx === activeIndex;
                  return (
                    <motion.div
                      key={`bg-${srv.id}`}
                      initial={false}
                      animate={{
                        opacity: isCur ? 1 : 0,
                        scale: isCur ? 1 : 1.015,
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-cover bg-bottom will-change-transform"
                      style={{
                        backgroundImage: `url(${
                          SERVICE_BACKGROUND_IMAGES[srv.id] ||
                          SERVICE_BACKGROUND_IMAGES['cardiovascular-combo']
                        })`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Dynamic Service Content Layer */}
              <div className="relative z-20 h-full p-6 lg:p-8 xl:p-10 flex flex-col justify-between overflow-y-auto">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`content-${activeService.id}`}
                    variants={cardContentContainerVariants}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    animate="visible"
                    exit={shouldReduceMotion ? undefined : 'exit'}
                    className="flex flex-col justify-between h-full"
                  >
                    <div>
                      {/* Service Title */}
                      <motion.h3
                        variants={cardContentItemVariants}
                        className="font-sans text-[26px] lg:text-[32px] xl:text-[36px] text-[#111827] uppercase font-normal leading-tight mb-2 pt-1"
                      >
                        {activeService.title}
                      </motion.h3>

                      {/* Tagline / Subtitle */}
                      <motion.p
                        variants={cardContentItemVariants}
                        className="text-accent-strong text-[13.5px] lg:text-[14.5px] xl:text-[15px] font-medium font-montserrat mb-3.5 leading-snug"
                      >
                        {activeService.tagline}
                      </motion.p>

                      {/* Description */}
                      <motion.p
                        variants={cardContentItemVariants}
                        className="text-[#1A1A1A] text-[13.5px] lg:text-[15px] xl:text-[16px] leading-relaxed font-normal mb-5 max-w-2xl font-montserrat"
                      >
                        {activeService.description}
                      </motion.p>

                      {/* Clinical Outcomes & Synergists Matrix */}
                      <motion.div
                        variants={cardContentItemVariants}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 mb-5"
                      >
                        {/* Expected Clinical Outcomes */}
                        <div className="p-3.5 lg:p-4 rounded-2xl bg-white/90 border border-[#DCE8F1] shadow-2xs backdrop-blur-xs">
                          <span className="text-[11.5px] lg:text-[12px] font-bold uppercase tracking-wider text-accent block mb-2 font-montserrat">
                            Expected Clinical Outcomes
                          </span>
                          <ul className="space-y-1.5">
                            {activeService.expectedOutcomes.slice(0, 2).map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[13px] lg:text-[14px] text-[#1A1A1A] font-montserrat leading-snug"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                                <span className="line-clamp-2">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Therapeutic Synergists */}
                        <div className="p-3.5 lg:p-4 rounded-2xl bg-white/90 border border-[#DCE8F1] shadow-2xs backdrop-blur-xs">
                          <span className="text-[11.5px] lg:text-[12px] font-bold uppercase tracking-wider text-[#111827] block mb-2 font-montserrat">
                            Therapeutic Synergists
                          </span>
                          <ul className="space-y-1.5">
                            {activeService.therapeuticSynergists.slice(0, 2).map((item, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-[13px] lg:text-[14px] text-[#1A1A1A] font-montserrat leading-snug"
                              >
                                <span className="w-1.5 h-1.5 rounded-full bg-accent-strong mt-1.5 flex-shrink-0" />
                                <span className="line-clamp-2">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </motion.div>

                      {/* Ideal Clinical Candidate */}
                      <motion.div
                        variants={cardContentItemVariants}
                        className="text-[13px] lg:text-[14px] text-[#555555] font-montserrat mb-2"
                      >
                        <strong className="text-[#111827] font-semibold uppercase tracking-wider text-[11px] lg:text-[11.5px] block mb-1">
                          Ideal Clinical Candidate:
                        </strong>
                        <p className="line-clamp-2 text-[#1A1A1A]">{activeService.idealFor}</p>
                      </motion.div>
                    </div>

                    {/* Action CTA Buttons: Only Book Consultation is retained */}
                    <div className="flex items-center justify-end pt-4 border-t border-[#DCE8F1]">
                      <motion.button
                        whileHover={shouldReduceMotion ? {} : { y: -2, scale: 1.01 }}
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        onClick={() => onBookService(activeService.id)}
                        className="group inline-flex items-center justify-between gap-3 pl-6 pr-2 py-2 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_16px_rgba(66,169,229,0.3)] hover:shadow-[0_6px_22px_rgba(7,137,210,0.4)] cursor-pointer select-none active:scale-[0.98]"
                      >
                        <span className="font-montserrat text-[13.5px] sm:text-[14.5px] font-semibold tracking-wide">
                          Book Consultation
                        </span>
                        <span className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                          <ArrowUpRight className="w-4 h-4 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </div>

          {/* ========================================================== */}
          {/* MOBILE RESPONSIVE PINNED EXPLORER (< md)                   */}
          {/* Centered Vertically, Entire Card & CTA Visible, No Progress Bar */}
          {/* ========================================================== */}
          <div
            id="mobile-services-explorer"
            data-mobile-explorer
            ref={mobileExplorerRef}
            className="block md:hidden flex flex-col justify-center"
            style={{ minHeight: 'calc(100dvh - 84px)' }}
          >
            {/* Horizontal Service Selector Pills */}
            <div
              ref={mobilePillsRef}
              className="flex items-center gap-2 overflow-x-auto pb-2 mb-2 no-scrollbar scroll-smooth flex-shrink-0"
            >
              {services.map((service, index) => {
                const isActive = index === activeIndex;
                return (
                  <button
                    key={`mobile-pill-${service.id}`}
                    onClick={() => handleSelectIndex(index)}
                    className={`px-4 py-2 rounded-full text-[14.5px] sm:text-[15.5px] font-montserrat whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                      isActive
                        ? 'bg-accent text-white font-medium shadow-xs'
                        : 'bg-white text-[#333333] font-normal border border-border-blue'
                    }`}
                  >
                    <span>{service.number}. {service.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Mobile Dynamic Detail Card (Centrally Fitted, Whole Card Visible, Internal Scroll on Small Screens) */}
            <div className="relative rounded-3xl overflow-hidden border border-border-blue/80 shadow-md bg-white flex flex-col justify-between max-h-[calc(100dvh-150px)] min-h-[380px] h-full">
              
              {/* Restrained Sky Blue Gradient in Top-Left Corner */}
              <div
                className="absolute top-0 left-0 w-64 h-64 pointer-events-none z-10"
                style={{
                  background:
                    'radial-gradient(circle at top left, rgba(66, 169, 229, 0.12) 0%, rgba(232, 245, 252, 0.05) 50%, transparent 75%)',
                }}
              />

              {/* Background Images: Visible at bottom, fading towards transparent at top */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  maskImage:
                    'linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.03) 78%, transparent 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to top, rgba(0,0,0,0.46) 0%, rgba(0,0,0,0.22) 42%, rgba(0,0,0,0.03) 78%, transparent 100%)',
                }}
              >
                {services.map((srv, idx) => {
                  const isCur = idx === activeIndex;
                  return (
                    <motion.div
                      key={`mobile-bg-${srv.id}`}
                      initial={false}
                      animate={{
                        opacity: isCur ? 1 : 0,
                        scale: isCur ? 1 : 1.015,
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 bg-cover bg-bottom will-change-transform"
                      style={{
                        backgroundImage: `url(${
                          SERVICE_BACKGROUND_IMAGES[srv.id] ||
                          SERVICE_BACKGROUND_IMAGES['cardiovascular-combo']
                        })`,
                      }}
                    />
                  );
                })}
              </div>

              {/* Mobile Content */}
              <div className="relative z-20 p-4 sm:p-6 flex flex-col justify-between h-full overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`mobile-content-${activeService.id}`}
                    variants={cardContentContainerVariants}
                    initial={shouldReduceMotion ? undefined : 'hidden'}
                    animate="visible"
                    exit={shouldReduceMotion ? undefined : 'exit'}
                    className="flex flex-col justify-between h-full"
                  >
                    {/* Card Top: Title & Tagline (flex-shrink-0) */}
                    <div className="flex-shrink-0">
                      <motion.h3
                        variants={cardContentItemVariants}
                        className="font-sans text-[22px] sm:text-[24px] text-[#111827] uppercase font-normal leading-tight mb-1 pt-0.5"
                      >
                        {activeService.title}
                      </motion.h3>

                      <motion.p
                        variants={cardContentItemVariants}
                        className="text-accent-strong text-[12.5px] sm:text-[13px] font-medium font-montserrat mb-2 leading-snug"
                      >
                        {activeService.tagline}
                      </motion.p>
                    </div>

                    {/* Card Middle: Description & Outcomes (overflow-y-auto for internal scrolling on smaller screens) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-0.5 space-y-2.5 min-h-0">
                      <motion.p
                        variants={cardContentItemVariants}
                        className="text-[#1A1A1A] text-[13.5px] sm:text-[14px] leading-relaxed font-normal font-montserrat"
                      >
                        {activeService.description}
                      </motion.p>

                      <motion.div
                        variants={cardContentItemVariants}
                        className="p-3 rounded-xl bg-white/90 border border-border-blue/70 shadow-2xs"
                      >
                        <span className="text-[11.5px] font-bold uppercase tracking-wider text-accent block mb-1.5 font-montserrat">
                          Expected Clinical Outcomes
                        </span>
                        <ul className="space-y-1">
                          {activeService.expectedOutcomes.slice(0, 2).map((item, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[12.5px] sm:text-[13px] text-[#1A1A1A] font-montserrat leading-snug">
                              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                              <span className="line-clamp-2">{item}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </div>

                    {/* Card Bottom: Book Consultation Button (flex-shrink-0, permanently visible) */}
                    <div className="pt-2.5 border-t border-[#DCE8F1] flex justify-center flex-shrink-0 mt-2">
                      <motion.button
                        whileTap={shouldReduceMotion ? {} : { scale: 0.98 }}
                        onClick={() => onBookService(activeService.id)}
                        className="w-full group inline-flex items-center justify-between gap-2 pl-5 pr-1.5 py-2 rounded-full bg-accent text-white hover:bg-accent-strong transition-all duration-300 shadow-[0_4px_16px_rgba(66,169,229,0.3)] cursor-pointer select-none active:scale-[0.98] min-h-[46px]"
                      >
                        <span className="font-montserrat text-[13.5px] font-semibold tracking-wide mx-auto">
                          Book Consultation
                        </span>
                        <span className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-white/30 flex items-center justify-center transition-all duration-300 flex-shrink-0">
                          <ArrowUpRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </span>
                      </motion.button>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
