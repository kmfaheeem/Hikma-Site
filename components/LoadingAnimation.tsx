"use client";

import { motion, Variants } from "framer-motion";

// Word and letters
const word = "HIKMA";
const letters = word.split("");

// Container animation (for staggered letter animation)
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Letter bounce animation
const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -100,
    scale: 0.5,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring" as const,
      damping: 8,
      stiffness: 150,
      mass: 0.5,
    },
  },
};

// Dot animation (looping bounce)
const dotVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: -10,
    transition: {
      repeat: Infinity,
      repeatType: "mirror" as const,
      duration: 0.4,
      ease: "easeInOut" as const,
    },
  },
} satisfies Variants; // ✅ ensures correct type without losing transition


export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* HIKMA Animated Text */}
        <motion.h1
          className="text-5xl md:text-7xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex drop-shadow-lg"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label={word}
        >
          {letters.map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              className="inline-block px-0.5"
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Full form text */}
        <motion.p
          className="mt-3 text-center text-sm md:text-base font-semibold text-blue-800 dark:text-blue-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2,
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          <span className="block">Home Intellectual Knack</span>
          <span className="block">and Magnificent Activities</span>
        </motion.p>

        {/* Animated Dots */}
        <motion.div
          className="flex space-x-1 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 bg-blue-500 rounded-full"
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              transition={{
                ...dotVariants.visible!.transition!,
                delay: 1.5 + i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};
