import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
  StorageClass,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3Client, S3_CONFIG, generateFileKey, getS3Url } from "./s3-config";

export interface UploadResult {
  key: string;
  url: string;
  bucket: string;
}

export interface UploadOptions {
  folder: keyof typeof S3_CONFIG.folders;
  userId: number;
  fileName: string;
  contentType: string;
  buffer: Buffer;
}

/**
 * Upload file to S3 bucket
 */
export async function uploadToS3(
  options: UploadOptions
): Promise<UploadResult> {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }

  const { folder, userId, fileName, contentType, buffer } = options;

  // Validate file type
  if (!S3_CONFIG.allowedTypes.includes(contentType)) {
    throw new Error(
      `File type ${contentType} is not allowed. Allowed types: ${S3_CONFIG.allowedTypes.join(
        ", "
      )}`
    );
  }

  // Validate file size
  if (buffer.length > S3_CONFIG.maxFileSize) {
    throw new Error(
      `File size ${buffer.length} exceeds maximum allowed size of ${S3_CONFIG.maxFileSize} bytes`
    );
  }

  // Generate unique file key
  const key = generateFileKey(folder, userId, fileName);

  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
      StorageClass: S3_CONFIG.storageClass as StorageClass,
      Metadata: {
        userId: userId.toString(),
        uploadedAt: new Date().toISOString(),
        originalFileName: fileName,
      },
    });

    await s3Client.send(command);

    return {
      key,
      url: getS3Url(key),
      bucket: S3_CONFIG.bucket,
    };
  } catch (error) {
    console.error("S3 upload error:", error);
    throw new Error(
      `Failed to upload file to S3: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Delete file from S3 bucket
 */
export async function deleteFromS3(key: string): Promise<void> {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }

  try {
    const command = new DeleteObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });

    await s3Client.send(command);
  } catch (error) {
    console.error("S3 delete error:", error);
    throw new Error(
      `Failed to delete file from S3: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generate presigned URL for temporary access to private files
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }

  try {
    const command = new GetObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Presigned URL error:", error);
    throw new Error(
      `Failed to generate presigned URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * Generate presigned upload URL for direct client uploads
 */
export async function getPresignedUploadUrl(
  folder: keyof typeof S3_CONFIG.folders,
  userId: number,
  fileName: string,
  contentType: string
): Promise<{ uploadUrl: string; key: string; finalUrl: string }> {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }

  // Validate file type
  if (!S3_CONFIG.allowedTypes.includes(contentType)) {
    throw new Error(`File type ${contentType} is not allowed`);
  }

  const key = generateFileKey(folder, userId, fileName);

  try {
    const command = new PutObjectCommand({
      Bucket: S3_CONFIG.bucket,
      Key: key,
      ContentType: contentType,
      StorageClass: S3_CONFIG.storageClass as StorageClass,
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 }); // 5 minutes

    return {
      uploadUrl,
      key,
      finalUrl: getS3Url(key),
    };
  } catch (error) {
    console.error("Presigned upload URL error:", error);
    throw new Error(
      `Failed to generate presigned upload URL: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}

/**
 * List files for a specific user in a folder
 */
export async function listUserFiles(
  folder: keyof typeof S3_CONFIG.folders,
  userId: number
): Promise<string[]> {
  if (!s3Client) {
    throw new Error(
      "S3 is not configured. Please set AWS credentials in environment variables."
    );
  }

  try {
    const { ListObjectsV2Command } = await import("@aws-sdk/client-s3");
    const prefix = `${S3_CONFIG.folders[folder]}user-${userId}/`;

    const command = new ListObjectsV2Command({
      Bucket: S3_CONFIG.bucket,
      Prefix: prefix,
    });

    const response = await s3Client.send(command);

    return response.Contents?.map((obj) => obj.Key!).filter(Boolean) || [];
  } catch (error) {
    console.error("List files error:", error);
    throw new Error(
      `Failed to list files: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
}
