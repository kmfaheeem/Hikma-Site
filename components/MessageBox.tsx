"use client";

import { useEffect } from "react";
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Timestamp | null;
}

interface MessageBoxProps {
  notifications: Notification[];
  onClose: () => void;
}

export const MessageBox = ({ notifications, onClose }: MessageBoxProps) => {
  useEffect(() => {
    // Mark all notifications as read when opened
    const markAsRead = async () => {
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notif of unreadNotifications) {
        const notifRef = doc(db, "notifications", notif.id);
        await updateDoc(notifRef, { read: true });
      }
    };

    if (notifications.length > 0) {
      markAsRead();
    }
  }, [notifications]);

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto max-h-[60vh]">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
              No notifications
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 rounded-lg ${
                    !notification.read ? "bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-600" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {formatDate(notification.createdAt)}
                      </p>
                    </div>
                    {notification.type && (
                      <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                        notification.type === "success" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
                        notification.type === "warning" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400" :
                        notification.type === "announcement" ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400" :
                        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                      }`}>
                        {notification.type}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

