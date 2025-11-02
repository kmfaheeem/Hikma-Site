import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket } from "@/lib/mongodb";
import { Readable } from "stream";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    const bucket = await getGridFSBucket();
    
    // Convert File to Buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const stream = Readable.from(buffer);

    // Create unique filename
    const timestamp = Date.now();
    const filename = `${folder}/${timestamp}_${file.name}`;

    // Upload to GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: file.type,
      metadata: {
        originalName: file.name,
        folder: folder,
        uploadedAt: new Date(),
      },
    });

    stream.pipe(uploadStream);

    await new Promise((resolve, reject) => {
      uploadStream.on("finish", resolve);
      uploadStream.on("error", reject);
    });

    // Return file ID for retrieval
    const fileId = uploadStream.id.toString();
    
    // Return URL that can be used to access the file
    const fileUrl = `/api/files/${fileId}`;

    return NextResponse.json({
      success: true,
      fileId,
      fileUrl,
      filename,
      contentType: file.type,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}

