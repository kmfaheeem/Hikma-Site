"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
import { collection, getDocs, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UploadImageButton } from "@/components/UploadImageButton";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  createdAt: Timestamp | null;
}

export default function Gallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const galleryRef = collection(db, "gallery");
        const q = query(galleryRef, orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);

        const imagesData: GalleryImage[] = [];
        snapshot.forEach((doc) => {
          imagesData.push({
            id: doc.id,
            ...doc.data(),
          } as GalleryImage);
        });

        setImages(imagesData);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

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
                Gallery
              </h1>
              {user?.role === "admin" && <UploadImageButton />}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              </div>
            ) : images.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  No images in gallery yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    onClick={() => setSelectedImage(image.url)}
                    className="cursor-pointer overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <Image
                      src={image.url}
                      alt={image.caption || "Gallery image"}
                      width={300}
                      height={256}
                      className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300"
                    />
                    {image.caption && (
                      <div className="p-2 bg-white dark:bg-gray-800">
                        <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {image.caption}
                        </p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </main>

      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
          onClick={() => setSelectedImage(null)}
        >
          <div className="max-w-7xl mx-auto px-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selectedImage}
              alt="Full size"
              className="max-h-[90vh] max-w-full object-contain"
            />
          </div>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}

