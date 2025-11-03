"use client";

import { motion } from "framer-motion";

// Store the word and letters for the new animation
const word = "HIKMA";
const letters = word.split("");

// Variants for the main container (HIKMA word)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1, // Faster stagger for more fluid letter appearance
      delayChildren: 0.1, // Start HIKMA animation sooner
    },
  },
};

// *** THESE ARE THE BOUNCING VARIANTS YOU REQUESTED ***
const letterVariants = {
  hidden: {
    opacity: 0,
    y: -100, // Start from the top
    scale: 0.5, // Start a bit smaller
  },
  visible: {
    opacity: 1,
    y: 0, // Land at the final position
    scale: 1, // End at full size
    transition: {
      type: "spring",
      damping: 8, // Lower damping = more bounce
      stiffness: 150, // Higher stiffness = faster snap
      mass: 0.5,
    },
  },
};

// Variants for the animating dots
const dotVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: {
    opacity: 1,
    y: -10, // Move up
    transition: {
      repeat: Infinity,
      repeatType: "mirror",
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

/**
 * This is the loading animation component.
 * It shows the "HIKMA" text animating in letter by letter,
 * followed by animating dots and the full form of HIKMA.
 */
export const LoadingAnimation = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* HIKMA Text with Letter-by-Letter Animation */}
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
              className="inline-block px-0.5" // Small padding for better spacing
            >
              {letter}
            </motion.span>
          ))}
        </motion.h1>

        {/* Full form of HIKMA, appears after main text animation */}
        <motion.p
          className="mt-3 text-center text-sm md:text-base font-semibold text-blue-800 dark:text-blue-200"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 1.2, // Appears after HIKMA letters finish
            duration: 0.6,
            ease: "easeOut",
          }}
        >
          {/* Use <span> with block for explicit line breaks */}
          <span className="block">Home Intellectual Knack</span>
          <span className="block">and Magnificent Activities</span>
        </motion.p>

        {/* Animated Dots */}
        <motion.div
          className="flex space-x-1 mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.5 }} // Dots fade in after text
        >
          {[...Array(3)].map((_, i) => (
            <motion.span
              key={i}
              className="block w-2 h-2 bg-blue-500 rounded-full"
              variants={dotVariants}
              initial="hidden"
              animate="visible"
              transition={{
                ...dotVariants.visible.transition,
                delay: 1.5 + i * 0.2,
              }} // Stagger dots
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};