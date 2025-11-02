"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";

export default function Admin() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    blogPosts: 0,
    events: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [usersSnapshot, postsSnapshot, eventsSnapshot, gallerySnapshot] = await Promise.all([
          getDocs(collection(db, "users")),
          getDocs(collection(db, "blogPosts")),
          getDocs(collection(db, "events")),
          getDocs(collection(db, "gallery")),
        ]);

        setStats({
          users: usersSnapshot.size,
          blogPosts: postsSnapshot.size,
          events: eventsSnapshot.size,
          galleryImages: gallerySnapshot.size,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Welcome, {user?.displayName || user?.email}. Manage your site from here.
            </p>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Total Users
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{stats.users}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Blog Posts
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{stats.blogPosts}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Events
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{stats.events}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700"
                >
                  <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Gallery Images
                  </h3>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">{stats.galleryImages}</p>
                </motion.div>
              </div>
            )}

            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-3">
                  <a
                    href="/blog"
                    className="block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    Manage Blog Posts
                  </a>
                  <a
                    href="/events"
                    className="block px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-center"
                  >
                    Manage Events
                  </a>
                  <a
                    href="/gallery"
                    className="block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-center"
                  >
                    Manage Gallery
                  </a>
                  <a
                    href="/settings"
                    className="block px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-center"
                  >
                    Site Settings
                  </a>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                  User Management
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Manage user roles and permissions. Access user management features through Firebase Console or implement a user management interface here.
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Currently supports: 3 admin accounts, 30 full-access students, 30 limited-access students
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

