import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { IMAGES } from '../../assets/images';

interface NavbarProps {
  currentRoute: string;
  onRouteChange: (route: string, sectionId?: string) => void;
  onOpenBooking?: () => void;
}

interface NavItem {
  name: string;
  route: string;
  sectionId?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, onRouteChange, onOpenBooking }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<string>('home');
  const isClickScrollingRef = useRef(false);
  const clickTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Desktop & iPad navigation destinations
  const navLinks: NavItem[] = [
    { name: 'Home', route: '/', sectionId: 'home' },
    { name: 'About Selvi', route: '/', sectionId: 'about-selvi' },
    { name: 'Services', route: '/', sectionId: 'services' },
    { name: 'Consultations', route: '/', sectionId: 'consultations' },
    { name: 'Health Insights', route: '/blogs' },
    { name: 'Contact', route: '/', sectionId: 'contact' },
  ];

  // Mobile drawer links: exact requested order & mapping
  const mobileNavLinks = [
    { number: '01', name: 'Home', route: '/', sectionId: 'home' },
    { number: '02', name: 'About', route: '/', sectionId: 'about' },
    { number: '03', name: 'Reviews', route: '/', sectionId: 'reviews' },
    { number: '04', name: 'About Selvi', route: '/', sectionId: 'about-selvi' },
    { number: '05', name: 'Services', route: '/', sectionId: 'services' },
    { number: '06', name: 'Consultations', route: '/', sectionId: 'consultations' },
    { number: '07', name: 'Blogs / Health Insights', route: '/blogs' },
    { number: '08', name: 'Contact', route: '/', sectionId: 'contact' },
  ];

  // Lock background page scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [mobileMenuOpen]);

  // Scrollspy: Track active section on the homepage with high-precision scroll
  useEffect(() => {
    if (currentRoute !== '/') {
      return;
    }

    const sections = [
      { id: 'home', navId: 'home' },
      { id: 'about', navId: 'about' },
      { id: 'reviews', navId: 'reviews' },
      { id: 'about-selvi', navId: 'about-selvi' },
      { id: 'services', navId: 'services' },
      { id: 'consultations', navId: 'consultations' },
      { id: 'contact', navId: 'contact' },
    ];

    const evaluateActiveSection = () => {
      if (isClickScrollingRef.current) return;

      const scrollY = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      // 1. If at or near top of the page (within 140px), always highlight 'home'
      if (scrollY < 140) {
        setActiveSection('home');
        return;
      }

      // 2. If scrolled near the very bottom (footer visible), highlight 'contact'
      if (scrollY + clientHeight >= scrollHeight - 140) {
        setActiveSection('contact');
        return;
      }

      // 3. Scan section bounding rects with offset for floating navbar (80px header offset)
      const focalLine = 80 + clientHeight * 0.38;
      let currentActive = 'home';

      for (const sec of sections) {
        const el = document.getElementById(sec.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= focalLine) {
            currentActive = sec.navId;
          }
        }
      }

      setActiveSection(currentActive);
    };

    evaluateActiveSection();

    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          evaluateActiveSection();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [currentRoute]);

  const getLinkKey = (link: NavItem) => link.sectionId || link.route;

  const handleNavClick = (link: NavItem) => {
    setHoveredKey(null);
    setMobileMenuOpen(false);

    // If target is Health Insights (/blogs):
    if (link.route === '/blogs') {
      if (currentRoute !== '/blogs') {
        onRouteChange('/blogs');
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
      return;
    }

    // If currently on homepage and link has a sectionId:
    if (currentRoute === '/' && link.sectionId) {
      const targetEl = document.getElementById(link.sectionId);
      if (targetEl) {
        isClickScrollingRef.current = true;
        setActiveSection(link.sectionId);

        const navbarOffset = 80;
        let targetY =
          link.sectionId === 'home'
            ? 0
            : targetEl.getBoundingClientRect().top + window.scrollY - navbarOffset;

        // On mobile, navigating to 'services' should pin directly to the mobile services explorer
        if (window.innerWidth < 768 && link.sectionId === 'services') {
          const mobileExplorer = document.getElementById('mobile-services-explorer');
          if (mobileExplorer) {
            targetY = mobileExplorer.getBoundingClientRect().top + window.scrollY - 84;
          }
        }

        window.scrollTo({
          top: targetY,
          behavior: 'smooth',
        });

        if (clickTimeoutRef.current) window.clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = window.setTimeout(() => {
          isClickScrollingRef.current = false;
        }, 1200);
        return;
      }
    }

    // If on /blogs or another route, navigate to '/' and smooth-scroll to section
    onRouteChange('/', link.sectionId);
  };

  const getIsActive = (link: NavItem) => {
    if (currentRoute === '/blogs') {
      return link.route === '/blogs';
    }
    return activeSection === link.sectionId;
  };

  const getIsLensTarget = (link: NavItem) => {
    if (hoveredKey !== null) {
      return hoveredKey === getLinkKey(link);
    }
    return getIsActive(link);
  };

  return (
    <>
      {/* Hidden SVG Filter for authentic optical glass lens distortion */}
      <svg className="absolute w-0 h-0 pointer-events-none opacity-0" aria-hidden="true">
        <defs>
          <filter id="glass-lens-distortion" x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.04 0.04" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Floating Glassmorphism Navbar Container */}
      <header className="fixed top-3 sm:top-4 md:top-4 left-0 right-0 z-50 pointer-events-none px-3.5 sm:px-4 md:px-4 lg:px-6">
        <div
          className={`pointer-events-auto max-w-5xl lg:max-w-6xl mx-auto rounded-full transition-all duration-300 py-2 sm:py-2.5 md:py-2 px-3.5 sm:px-5 md:px-5 lg:px-6 ${
            isScrolled ? 'realistic-glass-navbar-scrolled' : 'realistic-glass-navbar'
          }`}
        >
          {/* Refined Specular Top Edge Highlight */}
          <div
            className="absolute top-0 left-4 right-4 h-[1px] pointer-events-none"
            style={{
              background:
                'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.95) 20%, rgba(255,255,255,0.7) 70%, rgba(255,255,255,0) 100%)',
            }}
          />

          {/* Subtle Diagonal Internal Light Sheen */}
          <div
            className="absolute -top-12 -left-12 w-[140%] h-24 pointer-events-none transform -rotate-6 opacity-45"
            style={{
              background:
                'linear-gradient(180deg, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.03) 60%, transparent 100%)',
            }}
          />

          {/* Faint Blue-White Edge Refraction */}
          <div
            className="absolute inset-[1px] rounded-full pointer-events-none"
            style={{
              boxShadow: 'inset 0 0 6px 0 rgba(217, 239, 251, 0.25)',
            }}
          />

          {/* ================= DESKTOP & IPAD REDESIGNED LAYOUT (md and up) ================= */}
          <div className="hidden md:flex items-center justify-between gap-3 lg:gap-6 relative z-10 min-h-[40px] lg:min-h-[44px]">
            {/* Refined Brand Wordmark in Montserrat */}
            <button
              onClick={() => handleNavClick(navLinks[0])}
              className="flex items-center gap-2.5 lg:gap-3 group text-left focus:outline-none cursor-pointer flex-shrink-0"
              aria-label="JJ Nutrition Home"
            >
              <img
                src={IMAGES.brandLogo}
                alt="JJ Nutrition Logo"
                className="h-[30px] md:h-[32px] lg:h-[34px] w-auto max-w-none object-contain flex-shrink-0 transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-montserrat text-[16px] lg:text-[17.5px] font-normal tracking-[0.02em] text-[#111827] group-hover:text-accent transition-colors whitespace-nowrap">
                JJ Nutrition
              </span>
            </button>

            {/* Simple, Refined Navigation with Refractive Glass Lens Effect (NO secondary frosted panel) */}
            <nav
              onMouseLeave={() => setHoveredKey(null)}
              className="relative flex items-center gap-0.5 sm:gap-1 md:gap-0.5 lg:gap-1.5 bg-transparent"
            >
              {navLinks.map((link) => {
                const isSelected = getIsActive(link);
                const isLensTarget = getIsLensTarget(link);

                return (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    onMouseEnter={() => setHoveredKey(getLinkKey(link))}
                    className="relative px-2.5 sm:px-3 md:px-2.5 lg:px-3.5 py-1.5 rounded-full transition-colors duration-200 cursor-pointer focus:outline-none flex-shrink-0 select-none"
                  >
                    {/* Enlarged Active Refractive Glass Lens */}
                    {isLensTarget && (
                      <motion.div
                        layoutId="refractive-glass-lens"
                        className="absolute -top-[3.5px] -bottom-[3.5px] -left-1.5 -right-1.5 rounded-full glass-lens-optic z-0 pointer-events-none"
                        transition={{
                          type: 'spring',
                          stiffness: 440,
                          damping: 32,
                          mass: 0.75,
                        }}
                      >
                        {/* Upper curved convex reflection crest */}
                        <div className="glass-lens-glare" />

                        {/* Top specular highlight edge line */}
                        <div
                          className="absolute top-0 left-3 right-3 h-[1px] pointer-events-none"
                          style={{
                            background:
                              'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.98) 25%, rgba(255,255,255,0.98) 75%, rgba(255,255,255,0) 100%)',
                          }}
                        />

                        {/* Micro edge chromatic dispersion rim */}
                        <div
                          className="absolute inset-[1px] rounded-full pointer-events-none opacity-70"
                          style={{
                            boxShadow:
                              'inset 1.5px 0 2px rgba(66, 169, 229, 0.45), inset -1.5px 0 2px rgba(160, 110, 235, 0.35)',
                          }}
                        />
                      </motion.div>
                    )}

                    {/* Magnified & Chromatically Shifted Text under the Lens */}
                    <span
                      className={`relative z-10 block font-montserrat text-[12px] md:text-[12.5px] lg:text-[13px] tracking-[0.01em] transition-all duration-200 ${
                        isLensTarget
                          ? 'text-[#111827] font-normal scale-[1.05] lens-text-chromatic'
                          : isSelected
                          ? 'text-[#111827] font-normal'
                          : 'text-[#333333] hover:text-[#111827] font-normal'
                      }`}
                      style={{
                        transformOrigin: 'center center',
                      }}
                    >
                      {link.name}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* ================= MOBILE LAYOUT (Centered Brand Group + Right Hamburger) ================= */}
          <div className="md:hidden relative z-10 flex items-center justify-between h-10 sm:h-11 w-full">
            {/* Centered Brand Group: Logo + "JJ Nutrition" to the right, centered in navbar */}
            <button
              onClick={() => handleNavClick(mobileNavLinks[0])}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2.5 cursor-pointer focus:outline-none select-none group flex-shrink-0"
              aria-label="JJ Nutrition Home"
            >
              <img
                src={IMAGES.brandLogo}
                alt="JJ Nutrition Logo"
                className="h-[28px] sm:h-[30px] w-auto max-w-none object-contain flex-shrink-0 transition-transform group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="font-montserrat text-[15.5px] sm:text-[16px] font-normal tracking-[0.02em] text-[#111827] whitespace-nowrap">
                JJ Nutrition
              </span>
            </button>

            {/* Hamburger menu button on the right */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="ml-auto w-9 h-9 rounded-full flex items-center justify-center text-[#111827] hover:text-accent transition-colors cursor-pointer focus:outline-none flex-shrink-0 relative z-10"
            >
              {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Mobile Glassmorphic Drawer Menu with Staggered Left-to-Right Reveal */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-white/95 backdrop-blur-2xl pt-24 px-6 pb-8 flex flex-col md:hidden overflow-y-auto"
          >
            {/* Staggered Navigation List (01 through 08, left-aligned) */}
            <motion.div
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.055,
                    delayChildren: 0.08,
                  },
                },
                exit: {
                  opacity: 0,
                  transition: {
                    staggerChildren: 0.03,
                    staggerDirection: -1,
                  },
                },
              }}
              className="flex flex-col space-y-1 pt-2"
            >
              {mobileNavLinks.map((link) => {
                const isSelected = getIsActive(link);
                return (
                  <motion.button
                    key={link.name}
                    variants={{
                      hidden: { opacity: 0, x: -25 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: {
                          duration: 0.3,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        },
                      },
                      exit: {
                        opacity: 0,
                        x: -16,
                        transition: {
                          duration: 0.2,
                          ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                        },
                      },
                    }}
                    onClick={() => handleNavClick(link)}
                    className={`w-full text-right py-3 px-2 flex items-center justify-end gap-3.5 border-b border-[#DCE8F1]/70 cursor-pointer group select-none transition-colors ${
                      isSelected
                        ? 'text-accent'
                        : 'text-[#111827] hover:text-accent'
                    }`}
                  >
                    <div className="flex items-baseline justify-end gap-3.5">
                      <span className="font-mono text-xs text-[#555555] group-hover:text-accent transition-colors flex-shrink-0">
                        {link.number}
                      </span>
                      <span
                        className={`font-montserrat text-lg sm:text-xl tracking-tight transition-colors ${
                          isSelected
                            ? 'font-medium text-accent'
                            : 'font-normal text-[#111827] group-hover:text-accent'
                        }`}
                      >
                        {link.name}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all text-accent flex-shrink-0" />
                  </motion.button>
                );
              })}

              {/* Book Consultation button: DIRECTLY UNDERNEATH CONTACT */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, x: -25 },
                  visible: {
                    opacity: 1,
                    x: 0,
                    transition: {
                      duration: 0.3,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    },
                  },
                  exit: {
                    opacity: 0,
                    x: -16,
                    transition: {
                      duration: 0.2,
                      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                    },
                  },
                }}
                className="pt-6 pb-2"
              >
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenBooking) {
                      onOpenBooking();
                    } else {
                      handleNavClick({ name: 'Consultations', route: '/', sectionId: 'consultations' });
                    }
                  }}
                  className="w-full py-3.5 px-6 rounded-full bg-accent text-white hover:bg-accent-strong text-center text-sm font-semibold tracking-wide flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(66,169,229,0.35)] transition-all cursor-pointer font-montserrat active:scale-[0.99]"
                >
                  <span>Book Consultation</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <p className="text-center text-xs text-[#555555] font-montserrat pt-5 pb-2">
                  © 2026 JJ Nutrition. All rights reserved.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
