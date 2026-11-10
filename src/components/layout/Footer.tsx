import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Phone, Mail, Clock, Heart, Stethoscope } from 'lucide-react';
import { IMAGES } from '../../assets/images';
import { CLINICAL_SERVICES } from '../../data/clinicalData';

interface FooterProps {
  onRouteChange: (route: string, sectionId?: string) => void;
  onOpenBooking?: (serviceId?: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onRouteChange }) => {
  const shouldReduceMotion = useReducedMotion();

  const handleNavClick = (e: React.MouseEvent, route: string, sectionId?: string) => {
    e.preventDefault();
    onRouteChange(route, sectionId);
  };

  return (
    <footer className="bg-[#3569BA] text-white pt-14 md:pt-20 pb-12 relative overflow-hidden">
      <motion.div
        initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
        whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-30px' }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
      >
        {/* Top Branding (Consultation button removed) */}
        <div className="pb-10 border-b border-white/10">
          <div className="flex items-center gap-2.5 mb-3">
            <img
              src={IMAGES.brandLogoWhite}
              alt="JJ Nutrition Logo"
              className="h-8 w-auto object-contain"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span className="font-montserrat text-2xl sm:text-3xl tracking-wider font-medium text-white">
              JJ NUTRITION
            </span>
          </div>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed font-normal">
            Practitioner-led clinical nutrition by Selvi, RDN. Evidence-based nutraceuticals, biochemical individuality, and confidential worldwide telehealth consultations.
          </p>
        </div>

        {/* 4 Column Clinical Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 py-12 border-b border-white/10">
          {/* Column 1: Clinical Protocols (1-5) */}
          <div>
            <h4 className="font-sans text-base sm:text-lg text-white font-semibold tracking-wide mb-4 flex items-center gap-2">
              <Stethoscope className="w-4 h-4 text-[#D9EFFB]" />
              Targeted Protocols
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {CLINICAL_SERVICES.slice(0, 5).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={(e) => handleNavClick(e, '/', 'services')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: Clinical Protocols (6-10) */}
          <div>
            <h4 className="font-sans text-base sm:text-lg text-white font-semibold tracking-wide mb-4 flex items-center gap-2">
              <Heart className="w-4 h-4 text-[#D9EFFB]" />
              Specialized Care
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-white/80">
              {CLINICAL_SERVICES.slice(5, 10).map((service) => (
                <li key={service.id}>
                  <button
                    onClick={(e) => handleNavClick(e, '/', 'services')}
                    className="hover:text-white transition-colors text-left cursor-pointer"
                  >
                    {service.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Consultations & Hours */}
          <div>
            <h4 className="font-sans text-base sm:text-lg text-white font-semibold tracking-wide mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D9EFFB]" />
              Telehealth Hours
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li>
                <span className="block font-medium text-white">Mon – Fri:</span>
                <span>8:30 AM – 6:00 PM (AEST)</span>
              </li>
              <li>
                <span className="block font-medium text-white">Saturday:</span>
                <span>9:00 AM – 1:00 PM (AEST)</span>
              </li>
              <li className="pt-1">
                <span className="inline-block px-2.5 py-1 rounded-full bg-white/15 text-white text-xs font-semibold">
                  Serving Australia, US, UK & Worldwide
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Practitioner */}
          <div>
            <h4 className="font-sans text-base sm:text-lg text-white font-semibold tracking-wide mb-4">
              Direct Contact
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm text-white/80">
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9EFFB] flex-shrink-0" />
                <a href="tel:0416177347" className="hover:text-white transition-colors">
                  0416 177 347 (AU)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#D9EFFB] flex-shrink-0" />
                <a href="tel:+61416177347" className="hover:text-white transition-colors">
                  +61 416 177 347 (Intl)
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#D9EFFB] flex-shrink-0" />
                <a href="mailto:info@jjnutrition.com.au" className="hover:text-white transition-colors">
                  info@jjnutrition.com.au
                </a>
              </li>
              <li className="pt-2 text-xs text-white/60">
                Direct practitioner consultations conducted via secure encrypted Zoom or telephone.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Copyright and Navigation */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/75 gap-4 font-montserrat">
          <p>© 2026 JJ Nutrition. Directed by Practitioner Selvi, RDN. All rights reserved.</p>
          <div className="flex items-center space-x-6 flex-wrap gap-y-2">
            <button
              onClick={(e) => handleNavClick(e, '/', 'about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About Selvi
            </button>
            <button
              onClick={(e) => handleNavClick(e, '/', 'services')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Services
            </button>
            <button
              onClick={(e) => handleNavClick(e, '/', 'consultations')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Consultations
            </button>
            <button
              onClick={(e) => handleNavClick(e, '/blogs')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Health Insights
            </button>
            <button
              onClick={(e) => handleNavClick(e, '/', 'contact')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </button>
          </div>
        </div>
      </motion.div>
    </footer>
  );
};
