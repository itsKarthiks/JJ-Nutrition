import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import { CLINICAL_ARTICLES, ClinicalArticle } from '../data/clinicalData';

interface BlogPageProps {
  onBookNow: () => void;
  onNavigateHomeSection?: (sectionId: string) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({ onBookNow }) => {
  const [selectedArticle, setSelectedArticle] = useState<ClinicalArticle | null>(null);
  const shouldReduceMotion = useReducedMotion();

  // Lock body scroll while article modal is open
  useEffect(() => {
    if (selectedArticle) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [selectedArticle]);

  // Handle Escape key to close article modal
  useEffect(() => {
    if (!selectedArticle) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedArticle(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedArticle]);

  return (
    <main className="pt-24 sm:pt-28 md:pt-32 pb-20 sm:pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ============================================================== */}
        {/* 1. PAGE HEADING & SUPPORTING INTRO (Framer Motion entrance)   */}
        {/* ============================================================== */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 gap-6 pt-4 sm:pt-6">
          <div className="max-w-3xl">
            <motion.h1
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-3xl sm:text-5xl md:text-6xl text-[#111827] uppercase font-normal leading-tight"
            >
              EVIDENCE-BASED HEALTH INSIGHTS <br />
              <span className="text-accent font-medium">& BIOCHEMICAL PROTOCOLS</span>
            </motion.h1>

            <motion.p
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 12 }}
              animate={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="text-[#1A1A1A] text-base sm:text-lg mt-4 leading-relaxed font-normal font-montserrat"
            >
              Explore deep dives into human biochemical mechanisms, nutrient synergies, and clinical
              protocols written directly by practitioner Selvi.
            </motion.p>
          </div>

          <motion.div
            initial={shouldReduceMotion ? {} : { opacity: 0 }}
            animate={shouldReduceMotion ? {} : { opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex items-center gap-2 flex-shrink-0"
          >
            <span className="text-xs uppercase font-medium text-[#555555] font-montserrat tracking-wider">
              By Clinical Nutritionist Selvi
            </span>
          </motion.div>
        </div>

        {/* ============================================================== */}
        {/* 2. BLOG ARTICLE CARDS (Clean editorial grid, centered reveal)  */}
        {/* ============================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
          {CLINICAL_ARTICLES.map((article, idx) => (
            <motion.article
              key={article.id}
              initial={shouldReduceMotion ? {} : { opacity: 0, y: 24 }}
              whileInView={shouldReduceMotion ? {} : { opacity: 1, y: 0 }}
              whileHover={shouldReduceMotion ? {} : { y: -4 }}
              viewport={{ once: true, margin: '-15% 0px -20% 0px', amount: 0.2 }}
              transition={{
                delay: shouldReduceMotion ? 0 : idx * 0.08,
                duration: 0.5,
                ease: [0.16, 1, 0.3, 1],
              }}
              onClick={() => setSelectedArticle(article)}
              className="p-7 sm:p-9 lg:p-10 rounded-3xl bg-white border border-[#DCE8F1] hover:border-accent/60 transition-all duration-300 flex flex-col justify-between shadow-[0_4px_20px_rgba(16,36,61,0.04)] hover:shadow-[0_12px_36px_rgba(16,36,61,0.08)] group cursor-pointer"
            >
              <div>
                {/* Category Pill in Normal Title/Sentence Case, Regular Weight (No reading time indicator) */}
                <div className="mb-4">
                  <span className="text-xs font-normal px-3 py-1 rounded-full bg-[#E8F5FC] text-accent border border-[#D9EFFB] font-montserrat inline-block">
                    {article.category}
                  </span>
                </div>

                {/* Blog Heading: Montserrat Medium (500) */}
                <h2 className="font-montserrat text-xl sm:text-2xl text-[#111827] font-medium mb-3.5 leading-snug group-hover:text-accent transition-colors">
                  {article.title}
                </h2>

                <p className="text-[#1A1A1A] text-sm sm:text-base leading-relaxed mb-6 font-normal font-montserrat">
                  {article.summary}
                </p>

                {/* Key clinical takeaways */}
                <div className="border-t border-[#DCE8F1] pt-4 mb-6 space-y-2">
                  <span className="text-[11px] uppercase font-bold tracking-wider text-[#555555] block mb-1 font-montserrat">
                    CLINICAL TAKEAWAYS:
                  </span>
                  {article.keyTakeaways.slice(0, 2).map((takeaway, tIdx) => (
                    <div key={tIdx} className="flex items-start gap-2 text-xs text-[#1A1A1A] font-montserrat">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card Footer: Author info & Read Guide CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-[#DCE8F1]">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-accent text-white flex items-center justify-center font-bold text-xs">
                    S
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#111827] font-montserrat">{article.author}</p>
                    <p className="text-[10px] text-[#555555] font-montserrat">{article.date}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedArticle(article);
                  }}
                  className="group/btn py-2 px-4 rounded-full bg-white text-[#111827] border border-[#DCE8F1] group-hover:border-accent group-hover:bg-accent group-hover:text-white transition-all text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer font-montserrat active:scale-[0.98]"
                >
                  <span>Read Guide</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>

      </div>

      {/* ============================================================== */}
      {/* 3. FULL ARTICLE READER POPUP / MODAL                           */}
      {/* ============================================================== */}
      <AnimatePresence>
        {selectedArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-hidden">
            {/* Subtle Backdrop with Smooth Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              onClick={() => setSelectedArticle(null)}
              className="fixed inset-0 bg-[#10243D]/50 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Popup Container */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="article-modal-title"
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-[0_24px_70px_rgba(16,36,61,0.14)] border border-[#DCE8F1] overflow-hidden z-10 flex flex-col max-h-[92dvh] sm:max-h-[88vh]"
            >
              {/* Compact & Clean Popup Header: Category (Title Case), Date, Title in Montserrat Medium */}
              <div className="p-5 sm:p-7 border-b border-[#DCE8F1] flex items-start justify-between gap-4 bg-white flex-shrink-0">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-3 py-0.5 rounded-full bg-[#E8F5FC] text-accent text-xs font-normal border border-[#D9EFFB] font-montserrat">
                      {selectedArticle.category}
                    </span>
                    <span className="text-xs text-[#555555] font-montserrat font-normal">
                      • {selectedArticle.date}
                    </span>
                  </div>
                  <h2
                    id="article-modal-title"
                    className="font-montserrat text-xl sm:text-2xl font-medium text-[#111827] leading-snug"
                  >
                    {selectedArticle.title}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedArticle(null)}
                  className="w-8.5 h-8.5 rounded-full bg-[#F3F9FD] hover:bg-[#E8F5FC] text-[#555555] hover:text-[#111827] transition-colors flex items-center justify-center flex-shrink-0 cursor-pointer border border-[#DCE8F1]"
                  aria-label="Close article modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Popup Scrollable Body: Author card REMOVED. Article paragraphs start naturally. */}
              <div className="p-5 sm:p-7 lg:p-8 overflow-y-auto space-y-6 text-sm sm:text-base text-[#1A1A1A] font-montserrat leading-relaxed flex-1">
                <div className="space-y-4">
                  {selectedArticle.content.map((paragraph, i) => (
                    <p key={i} className="text-[#1A1A1A] text-sm sm:text-base leading-relaxed font-normal">
                      {paragraph}
                    </p>
                  ))}
                </div>

                {/* Key Clinical Takeaways */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#E8F5FC]/50 border border-[#D9EFFB]">
                  <h4 className="font-montserrat text-xs uppercase font-medium tracking-wider text-[#111827] mb-3">
                    Key Clinical Takeaways:
                  </h4>
                  <ul className="space-y-2.5">
                    {selectedArticle.keyTakeaways.map((takeaway, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1A1A1A]">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Consultation Booking CTA Card */}
                <div className="p-5 sm:p-6 rounded-2xl bg-[#F3F9FD] border border-[#DCE8F1] flex items-center justify-between flex-wrap gap-4 mt-6">
                  <div>
                    <p className="text-sm font-medium text-[#111827] font-montserrat">
                      Need personalized clinical guidance?
                    </p>
                    <p className="text-xs text-[#555555] font-montserrat">
                      Book a 1-on-1 consultation directly with Selvi.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedArticle(null);
                      onBookNow();
                    }}
                    className="px-6 py-2.5 rounded-full bg-accent text-white hover:bg-accent-strong text-xs font-montserrat font-medium uppercase tracking-wider transition-all duration-300 shadow-[0_4px_14px_rgba(66,169,229,0.3)] hover:shadow-[0_6px_20px_rgba(7,137,210,0.4)] cursor-pointer active:scale-[0.98]"
                  >
                    Book Consultation
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};
