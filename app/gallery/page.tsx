"use client";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useEffect, useState } from "react";
// Added deleteDoc and doc
import {
  collection,
  getDocs,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { motion } from "framer-motion";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { UploadImageButton } from "@/components/UploadImageButton";
// Added imports for delete logic
import { deleteFile } from "@/lib/storage";
import toast from "react-hot-toast";

interface GalleryImage {
  id: string;
  url: string;
  caption: string;
  uploadedBy: string;
  createdAt: Timestamp | null;
  fileId?: string;
}

export default function Gallery() {
  const { user } = useAuth();
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Added: Delete handler function
  const handleDelete = async (imageId: string, fileId: string | undefined) => {
    if (!window.confirm("Are you sure you want to delete this image?")) {
      return;
    }

    try {
      // 1. Delete Firestore document
      await deleteDoc(doc(db, "gallery", imageId));

      // 2. Delete file from MongoDB if fileId exists
      if (fileId) {
        await deleteFile(fileId);
      }

      toast.success("Image deleted successfully");
      // 3. Update state to remove image from UI
      setImages((prevImages) => prevImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Failed to delete image");
    }
  };

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
                  // MODIFIED: Wrapped in relative div
                  <div key={image.id} className="relative">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="overflow-hidden rounded-xl shadow-lg border border-gray-200 dark:border-gray-700"
                    >
                      <Image
                        src={image.url}
                        alt={image.caption || "Gallery image"}
                        width={300}
                        height={256}
                        // MODIFIED: Added cursor-pointer and onClick here
                        className="w-full h-64 object-cover hover:scale-110 transition-transform duration-300 cursor-pointer"
                        onClick={() => setSelectedImage(image.url)}
                      />
                      {image.caption && (
                        <div className="p-2 bg-white dark:bg-gray-800">
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                            {image.caption}
                          </p>
                        </div>
                      )}
                    </motion.div>

                    {/* ADDED: Delete button for admin */}
                    {user?.role === "admin" && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevents modal from opening
                          handleDelete(image.id, image.fileId);
                        }}
                        className="absolute top-2 right-2 z-10 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-md"
                        aria-label="Delete image"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    )}
                  </div>
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
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
}