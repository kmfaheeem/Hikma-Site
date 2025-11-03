"use client";

import Link from "next/link";
import { SocialMediaIcons } from "./SocialMediaIcons";

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Union Site
            </h3>
            <p className="text-gray-400 leading-relaxed">
              A community platform for our class union. Connect, share, and grow together.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/events" className="hover:text-blue-400 transition-colors duration-200 hover:translate-x-1 inline-block">
                  Events
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-white">Connect With Us</h4>
            <SocialMediaIcons />
            <p className="text-gray-400 mt-4 text-sm">
              Follow us on social media for updates and news
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 text-center">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} Union Site. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

