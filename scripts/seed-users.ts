/**
 * User Seeding Script - Reference Guide
 * 
 * This file serves as a reference for user account structure.
 * User documents are automatically created when users sign in with Google.
 * 
 * ACCOUNT STRUCTURE (Total: 63 accounts):
 * - 3 Admin accounts (role: "admin")
 * - 30 Full-access student accounts (role: "student-full")
 * - 30 Limited-access student accounts (role: "student-limited")
 * 
 * ROLE ASSIGNMENT PROCESS:
 * 
 * Option 1: Via Firebase Console (Recommended)
 * 1. Go to Firebase Console > Firestore Database
 * 2. Navigate to the 'users' collection
 * 3. Find the user document (created automatically on first sign-in)
 * 4. Click on the document
 * 5. Add or update the 'role' field with one of:
 *    - "admin" (full site access + admin dashboard + settings)
 *    - "student-full" (all pages except admin features)
 *    - "student-limited" (home, about, chat, blog write)
 * 
 * Option 2: Via Firebase CLI (Advanced)
 * Use Firebase Admin SDK or CLI to batch update roles
 * 
 * USER DOCUMENT STRUCTURE:
 * {
 *   email: "user@example.com",
 *   displayName: "User Name",
 *   role: "admin" | "student-full" | "student-limited",
 *   createdAt: Timestamp
 * }
 * 
 * ACCESS CONTROL SUMMARY:
 * - Admin: All features + Admin Dashboard + Settings
 * - Student Full: All public + Chat + Blog (write) + Gallery/Events (view)
 * - Student Limited: Home + About + Chat + Blog (write)
 * - Public: Home + About + Blog (read) + Gallery (view) + Events (view) + Games
 */

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";

// Example user document structure (for reference only)
const exampleUser = {
  email: "user@example.com",
  displayName: "User Name",
  role: "admin" as "admin" | "student-full" | "student-limited",
  createdAt: new Date(),
};

export default exampleUser;

/**
 * IMPORTANT NOTES:
 * 
 * 1. User documents are created automatically on first Google sign-in
 * 2. Default role for new users is "student-limited"
 * 3. Roles must be manually assigned through Firebase Console
 * 4. Role verification is handled in ProtectedRoute component
 * 5. Account limits (3 admin, 30 full, 30 limited) should be enforced manually
 *    or through Firestore security rules
 */

