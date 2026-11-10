import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

interface BlogsEntryStripProps {
  onNavigateBlogs: () => void;
}

export const BlogsEntryStrip: React.FC<BlogsEntryStripProps> = ({ onNavigateBlogs }) => {
  return (
    <section className="w-full relative overflow-hidden py-0" aria-label="Explore Blogs and Health Insights">
      <motion.button
        type="button"
        onClick={onNavigateBlogs}
        whileTap={{ scale: 0.995 }}
        aria-label="Navigate to Blogs and Health Insights"
        className="w-full group relative overflow-hidden py-10 sm:py-12 md:py-14 px-4 flex items-center justify-center cursor-pointer select-none border-0 text-left bg-accent"
      >
        {/* Layer 1: Background image texture from /blogsbanner.jpg */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 ease-out group-hover:scale-[1.015]"
          style={{
            backgroundImage: 'url(/blogsbanner.jpg)',
          }}
          aria-hidden="true"
        />

        {/* Layer 2: Semi-transparent JJ Nutrition Blue overlay layer */}
        <div
          className="absolute inset-0 bg-[#42A9E5]/65 group-hover:bg-[#0789D2]/75 transition-colors duration-300"
          aria-hidden="true"
        />

        {/* Layer 3: Centred Foreground Content (Crisp 100% white text and icon) */}
        <span className="relative z-10 inline-flex items-center justify-center gap-3 text-white transition-all duration-300">
          <span className="font-montserrat font-normal text-2xl sm:text-3xl md:text-4xl tracking-tight text-white drop-shadow-xs">
            Blogs
          </span>
          <ArrowUpRight
            className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 drop-shadow-xs"
            strokeWidth={2}
          />
        </span>
      </motion.button>
    </section>
  );
};
