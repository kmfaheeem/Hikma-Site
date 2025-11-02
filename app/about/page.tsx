"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion } from "framer-motion";
import { fadeInUp, scrollReveal, cardHover } from "@/lib/animations";

export default function About() {
  const sections = [
    {
      title: "Our Class",
      content: "Welcome to our class union! We are a vibrant community of students who come together to share experiences, ideas, and create lasting memories. This platform serves as our digital home where we can connect, collaborate, and support each other in our academic and personal journeys.",
    },
    {
      title: "Our Mission",
      content: "Our mission is to foster a sense of community, encourage collaboration, and provide a platform where every student can contribute, learn, and grow. We believe in the power of unity and collective progress.",
    },
    {
      title: "Our Students",
      content: "Our class is made up of diverse and talented individuals, each bringing unique perspectives and skills to our community. Together, we form a strong network of support and friendship that extends beyond the classroom.",
    },
    {
      title: "Get Involved",
      content: "Whether you're looking to share your thoughts on the blog, join discussions in the chat, attend events, or simply connect with your classmates, there's a place for everyone here. Sign in to access all features and become an active member of our community!",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              About Us
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Learn more about our class union and the amazing community we've built together
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto space-y-6">
            {sections.map((section, index) => (
              <motion.section
                key={section.title}
                {...scrollReveal}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                {...cardHover}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg backdrop-blur-sm border border-gray-200 dark:border-gray-700"
              >
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {section.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                  {section.content}
                </p>
              </motion.section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

