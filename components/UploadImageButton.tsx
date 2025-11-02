"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { uploadFile } from "@/lib/storage";
import toast from "react-hot-toast";

export const UploadImageButton = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !image) {
      toast.error("Please select an image");
      return;
    }

    try {
      setUploading(true);
      
      // Upload to MongoDB GridFS
      const uploadResult = await uploadFile(image, "gallery");
      const imageUrl = uploadResult.fileUrl;

      // Save metadata to Firestore
      await addDoc(collection(db, "gallery"), {
        url: imageUrl,
        fileId: uploadResult.fileId,
        caption,
        uploadedBy: user.uid,
        createdAt: serverTimestamp(),
      });

      toast.success("Image uploaded successfully!");
      setShowModal(false);
      setImage(null);
      setCaption("");
      window.location.reload();
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
      >
        + Upload Image
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Upload Image
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Image *
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Optional caption"
                  />
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={uploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    {uploading ? "Uploading..." : "Upload"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

