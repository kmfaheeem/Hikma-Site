"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { fadeInUp, scrollReveal, cardHover, buttonHover } from "@/lib/animations";

export default function Games() {
  const games = [
    {
      title: "Word Game",
      description: "Test your vocabulary skills",
      link: "#",
      icon: "📝",
    },
    {
      title: "Math Challenge",
      description: "Solve math problems quickly",
      link: "#",
      icon: "🔢",
    },
    {
      title: "Memory Game",
      description: "Match pairs and test your memory",
      link: "#",
      icon: "🧠",
    },
    {
      title: "Quiz Game",
      description: "Answer questions and earn points",
      link: "#",
      icon: "❓",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Games
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Have fun with our interactive games and challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {games.map((game, index) => (
              <motion.div
                key={game.title}
                {...scrollReveal}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                {...cardHover}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center border border-gray-200 dark:border-gray-700"
              >
                <motion.div 
                  className="text-6xl mb-4"
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  {game.icon}
                </motion.div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {game.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {game.description}
                </p>
                <motion.button 
                  {...buttonHover}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold shadow-md"
                >
                  Play Now
                </motion.button>
              </motion.div>
            ))}
          </div>

          <motion.div 
            {...scrollReveal}
            className="mt-12 text-center"
          >
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              More games coming soon! Check back later for updates.
            </p>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

