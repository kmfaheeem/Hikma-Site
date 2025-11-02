"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface BlogPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName?: string;
  createdAt: Timestamp | null;
  imageUrl?: string;
}

export default function BlogPost() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postDoc = await getDoc(doc(db, "blogPosts", params.id as string));
        if (postDoc.exists()) {
          const data = postDoc.data();
          
          // Fetch author name
          let authorName = "Anonymous";
          if (data.authorId) {
            const userDoc = await getDoc(doc(db, "users", data.authorId));
            if (userDoc.exists()) {
              authorName = userDoc.data().displayName || userDoc.data().email || "Anonymous";
            }
          }

          setPost({
            id: postDoc.id,
            ...data,
            authorName,
          } as BlogPost);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPost();
    }
  }, [params.id]);

  const formatDate = (timestamp: Timestamp | null) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Post not found
            </h1>
            <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
              Back to Blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-blue-600 dark:text-blue-400 hover:underline mb-6 inline-block"
          >
            ← Back to Blog
          </Link>

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
          >
            {post.imageUrl && (
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={800}
                height={384}
                className="w-full h-64 md:h-96 object-cover"
              />
            )}
            <div className="p-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {post.title}
              </h1>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-6">
                <span>By {post.authorName}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(post.createdAt)}</span>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300">
                <div className="whitespace-pre-wrap">{post.content}</div>
              </div>
            </div>
          </motion.article>
        </div>
      </main>
      <Footer />
    </div>
  );
}

