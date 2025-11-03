"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Settings() {
  return (
    <ProtectedRoute requiredRole="admin">
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user } = useAuth();
  const [siteName, setSiteName] = useState("Union Site");
  const [siteDescription, setSiteDescription] = useState("Class Union Community Site");
  const [saving, setSaving] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // In a real app, you would save these to Firestore
    // For now, we'll just show a success message
    setTimeout(() => {
      toast.success("Settings saved successfully!");
      setSaving(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-8">
              Settings
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Configure site settings and preferences
            </p>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <form onSubmit={handleSave} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={siteName}
                    onChange={(e) => setSiteName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Description
                  </label>
                  <textarea
                    value={siteDescription}
                    onChange={(e) => setSiteDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    User Roles
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p><strong>Admin:</strong> Full access to all features including admin dashboard and settings</p>
                    <p><strong>Student Full:</strong> Access to all pages except admin features</p>
                    <p><strong>Student Limited:</strong> Access to public pages</p>
                  </div>
                </div>

                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Account Limits
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                    <p>• 3 Admin accounts</p>
                    <p>• 30 Full-access student accounts</p>
                    <p>• 30 Limited-access student accounts</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6">
                  <button
                    type="button"
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Settings"}
                  </button>
                </div>
              </form>
            </div>

            <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Note:</strong> User role management should be done through Firebase Console. 
                Assign roles by updating the &quot;role&quot; field in the users collection for each user document.
              </p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

