import { NextRequest, NextResponse } from "next/server";
import { getGridFSBucket, getDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid file ID" },
        { status: 400 }
      );
    }

    const bucket = await getGridFSBucket();
    const fileId = new ObjectId(id);

    // Check if file exists
    const files = await bucket.find({ _id: fileId }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: "File not found" },
        { status: 404 }
      );
    }

    const file = files[0];
    
    // Set appropriate headers
    const headers = new Headers();
    headers.set("Content-Type", file.contentType || "application/octet-stream");
    headers.set("Content-Length", file.length.toString());
    headers.set("Content-Disposition", `inline; filename="${file.filename}"`);

    // Stream the file
    const downloadStream = bucket.openDownloadStream(fileId);
    
    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new NextResponse(buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("File retrieval error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid file ID" },
        { status: 400 }
      );
    }

    const bucket = await getGridFSBucket();
    const fileId = new ObjectId(id);

    // Delete file from GridFS
    await bucket.delete(fileId);

    return NextResponse.json({
      success: true,
      message: "File deleted successfully",
    });
  } catch (error) {
    console.error("File deletion error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}

