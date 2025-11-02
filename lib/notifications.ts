/**
 * Notification utility functions
 * 
 * Use these functions to create notifications for users
 */

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

export interface CreateNotificationParams {
  userId: string;
  title: string;
  message: string;
  type?: "info" | "warning" | "success" | "announcement";
}

/**
 * Create a notification for a specific user
 */
export const createNotification = async (params: CreateNotificationParams) => {
  try {
    await addDoc(collection(db, "notifications"), {
      userId: params.userId,
      title: params.title,
      message: params.message,
      type: params.type || "info",
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

/**
 * Create notifications for all users
 */
export const createNotificationForAll = async (
  title: string,
  message: string,
  type?: "info" | "warning" | "success" | "announcement"
) => {
  try {
    // Get all users
    const { getDocs, collection: getCollection, writeBatch, doc as getDocRef } = await import("firebase/firestore");
    const usersSnapshot = await getDocs(getCollection(db, "users"));
    
    // Add all notifications using batch
    const batch = writeBatch(db);
    usersSnapshot.docs.forEach((userDoc) => {
      const notifRef = getDocRef(getCollection(db, "notifications"));
      batch.set(notifRef, {
        userId: userDoc.id,
        title,
        message,
        type: type || "info",
        read: false,
        createdAt: serverTimestamp(),
      });
    });

    await batch.commit();
  } catch (error) {
    console.error("Error creating notifications for all users:", error);
    throw error;
  }
};

