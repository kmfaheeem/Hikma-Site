"use client";

import { useAuth } from "@/contexts/AuthContext";
import { signInWithGoogle } from "@/lib/auth";
import { useState } from "react";
import toast from "react-hot-toast";

export const LoginButton = () => {
  const { user, loading } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
      toast.success("Signed in successfully!");
    } catch (error) {
      console.error("Sign in error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(errorMessage);
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400">
        Loading...
      </div>
    );
  }

  if (user) {
    return (
      <div className="flex items-center space-x-2">
        <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          {user.displayName || user.email}
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignIn}
      disabled={signingIn}
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {signingIn ? "Signing in..." : "Sign in with Google"}
    </button>
  );
};

