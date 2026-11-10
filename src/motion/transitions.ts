import { Transition } from 'framer-motion';

/**
 * Curated easing curves & spring presets for JJ Nutrition
 * Aligned with clinical elegance, calm authority, and zero bounce.
 */
export const EASINGS = {
  // Signature exponential ease-out: starts with decisive momentum, lands with whisper-soft deceleration
  outExpo: [0.16, 1, 0.3, 1] as const,
  // Smooth natural cubic bezier for subtle interface feedback
  smooth: [0.22, 1, 0.36, 1] as const,
  // Gentle ease in-out for symmetric transitions (such as accordion expansions)
  easeInOut: [0.4, 0, 0.2, 1] as const,
};

export const SPRINGS = {
  // Ultra-responsive, zero-overshoot spring for micro-interactions (buttons, pills, tabs)
  micro: {
    type: 'spring',
    stiffness: 420,
    damping: 30,
    mass: 0.8,
  } as Transition,

  // Gentle, calm spring for modal drawers, cards, and floating elements
  gentle: {
    type: 'spring',
    stiffness: 140,
    damping: 22,
    mass: 1,
  } as Transition,

  // Smooth natural damping for scroll-triggered visual indicators
  smooth: {
    type: 'spring',
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  } as Transition,
};

export const DURATIONS = {
  micro: 0.15,
  fast: 0.25,
  standard: 0.4,
  entrance: 0.65,
  deliberate: 0.85,
};

