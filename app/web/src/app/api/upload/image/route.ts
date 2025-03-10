import { NextRequest, NextResponse } from "next/server";
import { uploadToS3 } from "web/utils/server/s3";

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * POST endpoint to handle image uploads to S3
 */
export async function POST(request: NextRequest) {
  try {
    // Check if the request is multipart/form-data
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Content type must be multipart/form-data" },
        { status: 400 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File size exceeds the maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` },
        { status: 400 }
      );
    }

    // Check file type
    const fileType = file.type;
    if (!fileType.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Convert File to Buffer
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    
    // Get optional folder parameter
    const folder = formData.get("folder") as string || "images";
    
    // Upload to S3
    const result = await uploadToS3(fileBuffer, fileType, folder);

    // Return success response with file URL
    return NextResponse.json({
      success: true,
      message: "File uploaded successfully",
      data: {
        id: result.id,
        url: result.url,
        fileType,
        fileName: file.name,
        fileSize: file.size,
      }
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { 
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}