/**
 * MongoDB Storage Utility
 * Handles file uploads and downloads using MongoDB GridFS
 */

export interface UploadResponse {
  success: boolean;
  fileId: string;
  fileUrl: string;
  filename: string;
  contentType: string;
}

/**
 * Upload a file to MongoDB GridFS
 */
export async function uploadFile(
  file: File,
  folder: "gallery" | "blog" | "events" | "general" = "general"
): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload file");
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading file:", error);
    throw error;
  }
}

/**
 * Get file URL by file ID
 */
export function getFileUrl(fileId: string): string {
  return `/api/files/${fileId}`;
}

/**
 * Delete a file from MongoDB GridFS
 */
export async function deleteFile(fileId: string): Promise<void> {
  try {
    const response = await fetch(`/api/files/${fileId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete file");
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
}

