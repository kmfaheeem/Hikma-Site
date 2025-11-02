"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import { usePathname } from "next/navigation";
import { LoginButton } from "./LoginButton";
import { NotificationIcon } from "./NotificationIcon";
import { useState } from "react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  // Define navigation items based on user role
  const getNavItems = () => {
    const baseItems = [
      { path: "/", label: "Home" },
      { path: "/about", label: "About" },
      { path: "/blog", label: "Blog" },
    ];

    if (!user) return baseItems;

    if (user.role === "admin") {
      return [
        ...baseItems,
        { path: "/gallery", label: "Gallery" },
        { path: "/events", label: "Events" },
        { path: "/games", label: "Games" },
        { path: "/chat", label: "Chat" },
        { path: "/admin", label: "Admin" },
        { path: "/settings", label: "Settings" },
      ];
    } else if (user.role === "student-full") {
      return [
        ...baseItems,
        { path: "/gallery", label: "Gallery" },
        { path: "/events", label: "Events" },
        { path: "/games", label: "Games" },
        { path: "/chat", label: "Chat" },
      ];
    } else if (user.role === "student-limited") {
      return [
        ...baseItems,
        { path: "/chat", label: "Chat" },
      ];
    }

    return baseItems;
  };

  const navItems = getNavItems();

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              Union
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right side items */}
          <div className="flex items-center space-x-4">
            {user && <NotificationIcon />}
            <LoginButton />
            {user && (
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
              >
                Sign Out
              </button>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {mobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

