import React from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * GlobalFallingScientificElements:
 * 3 Independent Depth Planes with demonstrably continuous falling animation:
 * - PLANE A (Far): small (36-44px), low opacity (0.14-0.18), 3.5px blur, slow fall (16-20s), subtle parallax (0.04)
 * - PLANE B (Middle): medium (50-56px), moderate opacity (0.24-0.30), 1.5px blur, mid fall (11-14s), moderate parallax (0.08)
 * - PLANE C (Focus/Foreground): crisp (62-72px), sharp 0px blur, opacity (0.32-0.44), fast fall (7-9s), responsive parallax (0.14)
 *
 * Each element starts at a staggered initial vertical position (initY) inside the viewport so that
 * when the page loads, elements are immediately visible across the screen and visibly falling.
 */

interface ParticleConfig {
  id: string;
  type: 'dna' | 'molecule';
  plane: 'far' | 'mid' | 'focus';
  leftPct: number; // horizontal placement %
  initY: number; // initial vertical position in vh (-15 to 85)
  size: number;
  opacity: number;
  blur: number;
  scale: number;
  duration: number; // falling cycle duration in seconds (7s to 20s)
  driftX: number; // horizontal drift px
  rotation: number; // initial tilt degrees
  rotateDelta: number; // rotation delta while falling
  parallaxFactor: number;
}

const PARTICLES_CONFIG: ParticleConfig[] = [
  // =========================================================================
  // PLANE A — FAR BACKGROUND (small, 3.5px blur, 16-20s slow fall, 0.04 parallax)
  // =========================================================================
  {
    id: 'far-1',
    type: 'dna',
    plane: 'far',
    leftPct: 6,
    initY: 10,
    size: 40,
    opacity: 0.16,
    blur: 3.5,
    scale: 0.7,
    duration: 18,
    driftX: 20,
    rotation: 25,
    rotateDelta: 40,
    parallaxFactor: 0.04,
  },
  {
    id: 'far-2',
    type: 'molecule',
    plane: 'far',
    leftPct: 24,
    initY: 65,
    size: 30,
    opacity: 0.14,
    blur: 3.0,
    scale: 0.65,
    duration: 19,
    driftX: -16,
    rotation: -10,
    rotateDelta: 50,
    parallaxFactor: 0.035,
  },
  {
    id: 'far-3',
    type: 'dna',
    plane: 'far',
    leftPct: 70,
    initY: 35,
    size: 44,
    opacity: 0.17,
    blur: 3.5,
    scale: 0.75,
    duration: 17,
    driftX: 22,
    rotation: -30,
    rotateDelta: -45,
    parallaxFactor: 0.045,
  },
  {
    id: 'far-4',
    type: 'molecule',
    plane: 'far',
    leftPct: 92,
    initY: 80,
    size: 32,
    opacity: 0.15,
    blur: 3.0,
    scale: 0.65,
    duration: 20,
    driftX: -18,
    rotation: 15,
    rotateDelta: 40,
    parallaxFactor: 0.04,
  },

  // =========================================================================
  // PLANE B — MIDDLE DISTANCE (medium, 1.5px blur, 11-14s mid fall, 0.08 parallax)
  // =========================================================================
  {
    id: 'mid-1',
    type: 'dna',
    plane: 'mid',
    leftPct: 16,
    initY: 45,
    size: 52,
    opacity: 0.26,
    blur: 1.5,
    scale: 0.88,
    duration: 13,
    driftX: -26,
    rotation: -25,
    rotateDelta: 55,
    parallaxFactor: 0.08,
  },
  {
    id: 'mid-2',
    type: 'molecule',
    plane: 'mid',
    leftPct: 44,
    initY: 15,
    size: 38,
    opacity: 0.24,
    blur: 1.2,
    scale: 0.82,
    duration: 14,
    driftX: 24,
    rotation: 40,
    rotateDelta: -45,
    parallaxFactor: 0.075,
  },
  {
    id: 'mid-3',
    type: 'dna',
    plane: 'mid',
    leftPct: 60,
    initY: 75,
    size: 54,
    opacity: 0.28,
    blur: 1.5,
    scale: 0.9,
    duration: 12,
    driftX: 28,
    rotation: 35,
    rotateDelta: 60,
    parallaxFactor: 0.085,
  },
  {
    id: 'mid-4',
    type: 'dna',
    plane: 'mid',
    leftPct: 84,
    initY: 30,
    size: 50,
    opacity: 0.25,
    blur: 1.5,
    scale: 0.86,
    duration: 13.5,
    driftX: -22,
    rotation: -40,
    rotateDelta: -50,
    parallaxFactor: 0.08,
  },

  // =========================================================================
  // PLANE C — FOCUS / FOREGROUND (crisp, 0px blur, 7-9s fast fall, 0.14 parallax)
  // =========================================================================
  {
    id: 'focus-1',
    type: 'dna',
    plane: 'focus',
    leftPct: 4,
    initY: 55,
    size: 66,
    opacity: 0.38,
    blur: 0,
    scale: 1.05,
    duration: 8.5,
    driftX: 32,
    rotation: 20,
    rotateDelta: 65,
    parallaxFactor: 0.14,
  },
  {
    id: 'focus-2',
    type: 'dna',
    plane: 'focus',
    leftPct: 36,
    initY: 85,
    size: 62,
    opacity: 0.35,
    blur: 0,
    scale: 1.0,
    duration: 8.0,
    driftX: -30,
    rotation: -35,
    rotateDelta: -60,
    parallaxFactor: 0.13,
  },
  {
    id: 'focus-3',
    type: 'molecule',
    plane: 'focus',
    leftPct: 76,
    initY: 5,
    size: 44,
    opacity: 0.32,
    blur: 0,
    scale: 1.02,
    duration: 9.0,
    driftX: 26,
    rotation: 30,
    rotateDelta: 70,
    parallaxFactor: 0.12,
  },
  {
    id: 'focus-4',
    type: 'dna',
    plane: 'focus',
    leftPct: 93,
    initY: 50,
    size: 70,
    opacity: 0.42,
    blur: 0,
    scale: 1.1,
    duration: 7.5,
    driftX: -34,
    rotation: 45,
    rotateDelta: 75,
    parallaxFactor: 0.15,
  },
];

// Minimal abstract scientific node structure
const MolecularNodeSvg: React.FC<{ size: number; opacity: number; color?: string }> = ({
  size,
  opacity,
  color = '#42A9E5',
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ opacity }}
    >
      <line x1="12" y1="20" x2="28" y2="12" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="28" y1="12" x2="32" y2="28" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="12" y1="20" x2="20" y2="32" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
      <line x1="20" y1="32" x2="32" y2="28" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />

      <circle cx="12" cy="20" r="3.5" fill={color} />
      <circle cx="28" cy="12" r="3" fill="#0789D2" />
      <circle cx="32" cy="28" r="3.5" fill={color} />
      <circle cx="20" cy="32" r="2.5" fill="#10243D" />

      <circle cx="20" cy="22" r="5" stroke={color} strokeWidth="0.8" strokeDasharray="2 2" strokeOpacity="0.7" />
    </svg>
  );
};

export const GlobalFallingScientificElements: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const { scrollY } = useScroll();

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden select-none"
      style={{ zIndex: 1, width: '100vw', height: '100vh' }}
      aria-hidden="true"
    >
      {PARTICLES_CONFIG.map((p) => {
        // Individual scroll parallax response based on depth factor
        const parallaxY = useTransform(
          scrollY,
          [0, 4000],
          [0, -4000 * p.parallaxFactor]
        );

        // Assign Z-index based on depth plane: Far = 1, Mid = 2, Focus = 3
        const planeZIndex = p.plane === 'far' ? 1 : p.plane === 'mid' ? 2 : 3;

        // Falling animation starts at p.initY and moves down by 130vh continuously
        const startY = p.initY;
        const endY = p.initY + 130;

        return (
          <motion.div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.leftPct}%`,
              top: '0px',
              zIndex: planeZIndex,
              y: shouldReduceMotion ? `${startY}vh` : parallaxY,
            }}
          >
            <motion.div
              animate={
                shouldReduceMotion
                  ? {}
                  : {
                      y: [`${startY}vh`, `${endY}vh`],
                      x: [-p.driftX, p.driftX, -p.driftX],
                      rotate: [p.rotation, p.rotation + p.rotateDelta],
                    }
              }
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: 'linear',
              }}
              style={{
                filter: p.blur > 0 ? `blur(${p.blur}px)` : 'none',
                transform: `scale(${p.scale})`,
                willChange: 'transform',
              }}
            >
              {p.type === 'dna' ? (
                <img
                  src="/DNAicon.png"
                  alt=""
                  aria-hidden="true"
                  style={{
                    width: p.size,
                    height: p.size,
                    opacity: p.opacity,
                  }}
                  className="object-contain filter drop-shadow-sm select-none"
                />
              ) : (
                <MolecularNodeSvg size={p.size} opacity={p.opacity} />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
