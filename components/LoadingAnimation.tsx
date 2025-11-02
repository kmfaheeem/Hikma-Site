"use client";

import { motion } from "framer-motion";

interface LoadingAnimationProps {
  size?: number;
}

export const LoadingAnimation = ({ size = 80 }: LoadingAnimationProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        className="relative flex flex-col items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Union Logo Text with Animation */}
        <motion.div
          className="relative mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <motion.h1
            className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              backgroundSize: "200% auto",
            }}
          >
            Union
          </motion.h1>
        </motion.div>

        {/* Animated Loading Spinner */}
        <motion.div
          className="relative"
          style={{ width: size, height: size }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <motion.div
            className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full"
            animate={{
              borderColor: ["#2563eb", "#9333ea", "#2563eb"],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          ></motion.div>
          <motion.div
            className="absolute inset-2 border-4 border-blue-400 border-t-transparent rounded-full"
            animate={{
              rotate: -360,
              borderColor: ["#60a5fa", "#a78bfa", "#60a5fa"],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "linear",
            }}
          ></motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="mt-6 text-gray-600 dark:text-gray-400 text-sm font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Loading...
        </motion.p>
      </motion.div>
    </div>
  );
};

