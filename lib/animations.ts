/**
 * Reusable animation variants for Framer Motion
 */

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.4, ease: "easeOut" },
};

export const scaleInHover = {
  initial: { scale: 1 },
  whileHover: { scale: 1.05 },
  transition: { duration: 0.2 },
};

export const slideInLeft = {
  initial: { opacity: 0, x: -50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const slideInRight = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

export const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.3, ease: "easeInOut" },
};

export const scrollReveal = {
  initial: { opacity: 0, y: 50 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const hoverLift = {
  initial: { y: 0 },
  whileHover: { y: -5 },
  transition: { duration: 0.2, ease: "easeOut" },
};

export const buttonHover = {
  initial: { scale: 1 },
  whileHover: { scale: 1.05 },
  whileTap: { scale: 0.95 },
  transition: { duration: 0.2 },
};

export const cardHover = {
  initial: { y: 0, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" },
  whileHover: { 
    y: -8, 
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)",
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

export const rotateIn = {
  initial: { opacity: 0, rotate: -10 },
  animate: { opacity: 1, rotate: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

