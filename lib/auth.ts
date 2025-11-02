import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "./firebase";

export type UserRole = "admin" | "student-full" | "student-limited";

export interface User extends FirebaseUser {
  role?: UserRole;
  email: string;
}

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async (): Promise<User> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user exists in Firestore, if not create their profile
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      // New user - set default role as student-limited
      await setDoc(userDocRef, {
        email: user.email,
        displayName: user.displayName || "",
        role: "student-limited",
        createdAt: serverTimestamp(),
      });
    }

    // Get user role from Firestore
    const userData = userDoc.exists() ? userDoc.data() : { role: "student-limited" };
    return {
      ...user,
      role: userData.role as UserRole,
      email: user.email || "",
    } as User;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

export const getUserRole = async (userId: string): Promise<UserRole | null> => {
  try {
    const userDocRef = doc(db, "users", userId);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      return userDoc.data().role as UserRole;
    }
    return null;
  } catch (error) {
    console.error("Error getting user role:", error);
    return null;
  }
};

export { onAuthStateChanged };

