"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, onSnapshot, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { MessageBox } from "./MessageBox";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Timestamp | null;
}

export const NotificationIcon = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    if (!user) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", user.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs: Notification[] = [];
      snapshot.forEach((doc) => {
        notifs.push({ id: doc.id, ...doc.data() } as Notification);
      });
      
      // Sort by createdAt descending
      notifs.sort((a, b) => {
        const aTime = a.createdAt?.toMillis() || 0;
        const bTime = b.createdAt?.toMillis() || 0;
        return bTime - aTime;
      });

      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
    });

    return () => unsubscribe();
  }, [user]);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleNotifications}
        className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        aria-label="Notifications"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 block h-5 w-5 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <MessageBox
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
};

