import React from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';

interface AboutDNAAnimationProps {
  targetRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

// Full continuous Strand 1: Top-Right (470, 30) -> Center Helix -> Bottom-Right (470, 635)
const FULL_STRAND_1_PATH =
  'M 470 30 C 430 75, 365 130, 295 180 C 265 202, 252 215, 250 230 ' +
  'C 275 245, 285 260, 285 275 C 285 295, 265 310, 250 320 ' +
  'C 235 330, 215 345, 215 365 C 215 385, 235 400, 250 410 ' +
  'C 262 418, 270 428, 268 435 C 265 442, 258 448, 250 450 ' +
  'C 252 465, 265 480, 295 510 C 355 560, 425 600, 470 635';

// Complementary Strand 2: Diverges at (250, 230), forms anti-phase helix, converges at (250, 450)
const STRAND_2_PATH =
  'M 250 230 C 225 245, 215 260, 215 275 C 215 295, 235 310, 250 320 ' +
  'C 265 330, 285 345, 285 365 C 285 385, 265 400, 250 410 ' +
  'C 238 418, 230 428, 232 435 C 235 442, 242 448, 250 450';

// Scientific Base-Pair Rungs across the double-helix
const RUNGS = [
  { id: 1, y: 255, x1: 280, x2: 220, threshold: 0.32 },
  { id: 2, y: 280, x1: 285, x2: 215, threshold: 0.37 },
  { id: 3, y: 305, x1: 265, x2: 235, threshold: 0.42 },
  { id: 4, y: 345, x1: 225, x2: 275, threshold: 0.47 },
  { id: 5, y: 365, x1: 215, x2: 285, threshold: 0.52 },
  { id: 6, y: 390, x1: 235, x2: 265, threshold: 0.57 },
  { id: 7, y: 430, x1: 265, x2: 235, threshold: 0.62 },
];

export const AboutDNAAnimation: React.FC<AboutDNAAnimationProps> = ({ targetRef, className = '' }) => {
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start 85%', 'end 15%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  });

  // Strand 1 draws from start to finish
  const strand1Length = useTransform(smoothProgress, [0.05, 0.90], [0, 1]);
  // Strand 2 emerges in the helix zone and rejoins
  const strand2Length = useTransform(smoothProgress, [0.28, 0.68], [0, 1]);
  const strand2Opacity = useTransform(smoothProgress, [0.26, 0.32, 0.68, 0.72], [0, 1, 1, 0.9]);

  return (
    <div
      aria-hidden="true"
      className={`absolute inset-y-0 right-0 pointer-events-none select-none overflow-hidden ${className}`}
    >
      <svg
        viewBox="0 0 520 660"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-h-[660px] object-contain object-right"
      >
        <defs>
          {/* Subtle glow filter */}
          <filter id="dnaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Primary Strand Gradient */}
          <linearGradient id="dnaGrad1" x1="470" y1="30" x2="470" y2="635" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#42A9E5" stopOpacity="0.4" />
            <stop offset="25%" stopColor="#0789D2" stopOpacity="0.85" />
            <stop offset="50%" stopColor="#42A9E5" stopOpacity="0.95" />
            <stop offset="75%" stopColor="#0789D2" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#42A9E5" stopOpacity="0.4" />
          </linearGradient>

          {/* Complementary Strand Gradient */}
          <linearGradient id="dnaGrad2" x1="250" y1="230" x2="250" y2="450" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#42A9E5" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#0789D2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#42A9E5" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* Ambient Halo Behind Helix Zone */}
        <ellipse
          cx="250"
          cy="340"
          rx="70"
          ry="120"
          fill="#42A9E5"
          fillOpacity="0.035"
          filter="url(#dnaGlow)"
        />

        {/* Rungs (Base-Pair Hydrogen Bonds) */}
        {RUNGS.map((rung) => {
          return (
            <RungComponent
              key={rung.id}
              rung={rung}
              smoothProgress={smoothProgress}
              shouldReduceMotion={shouldReduceMotion}
            />
          );
        })}

        {/* Complementary Helix Strand (Strand 2) */}
        <motion.path
          d={STRAND_2_PATH}
          stroke="url(#dnaGrad2)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            shouldReduceMotion
              ? { pathLength: 1, opacity: 0.85 }
              : {
                  pathLength: strand2Length,
                  opacity: strand2Opacity,
                }
          }
        />

        {/* Continuous Backbone Strand (Strand 1) */}
        <motion.path
          d={FULL_STRAND_1_PATH}
          stroke="url(#dnaGrad1)"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={
            shouldReduceMotion
              ? { pathLength: 1, opacity: 0.9 }
              : {
                  pathLength: strand1Length,
                  opacity: 0.9,
                }
          }
        />

        {/* Start Point Subtle Node */}
        <circle cx="470" cy="30" r="3" fill="#42A9E5" fillOpacity="0.6" />
        {/* End Point Subtle Node */}
        <circle cx="470" cy="635" r="3" fill="#42A9E5" fillOpacity="0.6" />
      </svg>
    </div>
  );
};

interface RungProps {
  rung: { id: number; y: number; x1: number; x2: number; threshold: number };
  smoothProgress: any;
  shouldReduceMotion: boolean | null;
}

const RungComponent: React.FC<RungProps> = ({ rung, smoothProgress, shouldReduceMotion }) => {
  const opacity = useTransform(smoothProgress, [rung.threshold - 0.04, rung.threshold], [0, 0.85]);
  const scale = useTransform(smoothProgress, [rung.threshold - 0.04, rung.threshold], [0.3, 1]);

  return (
    <motion.g
      style={
        shouldReduceMotion
          ? { opacity: 0.8, scale: 1 }
          : {
              opacity,
              scale,
              transformOrigin: `${(rung.x1 + rung.x2) / 2}px ${rung.y}px`,
            }
      }
    >
      {/* Hydrogen Bond Connecting Line */}
      <line
        x1={rung.x1}
        y1={rung.y}
        x2={rung.x2}
        y2={rung.y}
        stroke="#42A9E5"
        strokeWidth="1.2"
        strokeDasharray="3 2"
        strokeOpacity="0.75"
      />
      {/* Left Base Pair Node */}
      <circle
        cx={rung.x1}
        cy={rung.y}
        r="2.5"
        fill="#42A9E5"
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />
      {/* Right Base Pair Node */}
      <circle
        cx={rung.x2}
        cy={rung.y}
        r="2.5"
        fill="#0789D2"
        stroke="#FFFFFF"
        strokeWidth="0.8"
      />
    </motion.g>
  );
};

