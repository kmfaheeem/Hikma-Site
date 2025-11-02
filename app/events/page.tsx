"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { CreateEventButton } from "@/components/CreateEventButton";

interface Event {
  id: string;
  title: string;
  description: string;
  date: Date | Timestamp;
  location: string;
  imageUrl?: string;
}

export default function Events() {
  const { user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const eventsData: Event[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          eventsData.push({
            id: doc.id,
            ...data,
            // Handle both Firestore Timestamp and Date objects
            date: data.date instanceof Date ? data.date : (data.date?.toDate ? data.date.toDate() : new Date()),
          } as Event);
        });

        setEvents(eventsData);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (date: Date | Timestamp | null) => {
    if (!date) return "";
    const dateObj = date instanceof Date ? date : (date as Timestamp).toDate();
    return dateObj.toLocaleDateString() + " " + dateObj.toLocaleTimeString();
  };

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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Events
              </h1>
              {user?.role === "admin" && <CreateEventButton />}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No events scheduled yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {event.imageUrl && (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
                        {event.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                      <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(event.date)}
                        </div>
                        {event.location && (
                          <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {event.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

