import { Variants } from 'framer-motion';
import { EASINGS, DURATIONS } from './transitions';

/**
 * Standardized entrance & micro-interaction variants for JJ Nutrition
 */
export const fadeUpVariants = (distance = 20, duration = DURATIONS.entrance): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration,
      ease: EASINGS.outExpo,
    },
  },
});

export const fadeInVariants = (duration = DURATIONS.entrance): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration,
      ease: EASINGS.smooth,
    },
  },
});

export const staggerContainerVariants = (
  staggerChildren = 0.08,
  delayChildren = 0.05
): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
    },
  },
});

export const staggerItemVariants = (distance = 16): Variants => ({
  hidden: {
    opacity: 0,
    y: distance,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: DURATIONS.entrance,
      ease: EASINGS.outExpo,
    },
  },
});

// Reusable card hover & tap micro-interaction props
export const cardMicroMotion = {
  whileHover: {
    y: -3,
    transition: { duration: DURATIONS.fast, ease: EASINGS.smooth },
  },
  whileTap: {
    scale: 0.99,
    transition: { duration: DURATIONS.micro },
  },
};

// Reusable primary/secondary button micro-interaction props
export const buttonMicroMotion = {
  whileHover: {
    y: -2,
    transition: { duration: DURATIONS.fast, ease: EASINGS.smooth },
  },
  whileTap: {
    scale: 0.98,
    transition: { duration: DURATIONS.micro },
  },
};

