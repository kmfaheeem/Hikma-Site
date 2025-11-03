"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { CreatePostButton } from "@/components/CreatePostButton";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  createdAt: Timestamp | null;
  imageUrl?: string;
}

export default function Blog() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsRef = collection(db, "blogPosts");
        const q = query(postsRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const postsData: BlogPost[] = [];
        for (const doc of snapshot.docs) {
          const data = doc.data();
          
          // Fetch author name
          let authorName = "Anonymous";
          if (data.authorId) {
            const userRef = await import("firebase/firestore").then(m => 
              m.getDoc(m.doc(db, "users", data.authorId))
            );
            if (userRef.exists()) {
              authorName = userRef.data().displayName || userRef.data().email || "Anonymous";
            }
          }

          postsData.push({
            id: doc.id,
            ...data,
            authorName,
          } as BlogPost);
        }

        setPosts(postsData);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString();
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
                Blog
              </h1>
              {(user?.role === "student-full" || 
                user?.role === "admin") && (
                <CreatePostButton />
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No blog posts yet. Be the first to share!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ y: -8, boxShadow: "0 12px 24px rgba(0, 0, 0, 0.15)" }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
                  >
                    {post.imageUrl && (
                      <Image
                        src={post.imageUrl}
                        alt={post.title}
                        width={400}
                        height={192}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <div className="p-6">
                      <Link href={`/blog/${post.id}`}>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {post.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                        {post.content.substring(0, 150)}...
                      </p>
                      <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                        <span>By {post.authorName}</span>
                        <span>{formatDate(post.createdAt)}</span>
                      </div>
                      <Link
                        href={`/blog/${post.id}`}
                        className="mt-4 inline-block text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        Read more →
                      </Link>
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

