import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "./env";

// Initialize the S3 client
const s3Client = new S3Client({
  region: ENV.AWS_REGION,
  credentials: {
    accessKeyId: ENV.AWS_ACCESS_KEY_ID,
    secretAccessKey: ENV.AWS_SECRET_ACCESS_KEY,
  },
});

/**
 * Uploads a file to S3 and returns the file URL
 * @param file The file buffer
 * @param contentType MIME type of the file
 * @param folderName Optional folder name within the bucket
 * @returns The URL of the uploaded file
 */
export async function uploadToS3(
  file: Buffer,
  contentType: string,
  folderName = "uploads"
): Promise<{ id: string; url: string }> {
  // Generate a unique filename using UUID
  const uuid = uuidv4();
  const extension = getExtensionFromContentType(contentType);
  const key = `${folderName}/${uuid}${extension}`;

  const params = {
    Bucket: ENV.AWS_BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  };

  try {
    await s3Client.send(new PutObjectCommand(params));
    
    // Construct the URL for the uploaded file
    const url = `https://${ENV.AWS_BUCKET_NAME}.s3.${ENV.AWS_REGION}.amazonaws.com/${key}`;
    
    return {
      id: uuid,
      url,
    };
  } catch (error) {
    console.error("Error uploading to S3:", error);
    throw new Error(`Failed to upload file to S3: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Get file extension based on MIME type
 */
function getExtensionFromContentType(contentType: string): string {
  const mimeToExt: Record<string, string> = {
    "image/jpeg": ".jpg",
    "image/jpg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/svg+xml": ".svg",
  };

  return mimeToExt[contentType] || "";
}