"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { UserRole } from "@/lib/auth";
import { LoadingAnimation } from "./LoadingAnimation";
import toast from "react-hot-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  requireAuth?: boolean;
}

export const ProtectedRoute = ({
  children,
  requiredRole,
  requireAuth = true,
}: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (requireAuth && !user) {
      toast.error("Please sign in to access this page");
      router.push("/");
      return;
    }

    if (requiredRole && user) {
      const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      if (!roles.includes(user.role!)) {
        toast.error("You don't have permission to access this page");
        router.push("/");
      }
    }
  }, [user, loading, requiredRole, requireAuth, router]);

  if (loading) {
    return <LoadingAnimation />;
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requiredRole && user) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    if (!roles.includes(user.role!)) {
      return null;
    }
  }

  return <>{children}</>;
};

