import { Router } from "express";
import multer from "multer";
import {
  uploadToS3,
  getPresignedUploadUrl,
  deleteFromS3,
  UploadOptions,
} from "./s3-service";
import { S3_CONFIG } from "./s3-config";
import { authenticateUser, AuthenticatedRequest } from "./auth-middleware";

const router = Router();

// Configure multer for memory storage (we'll upload directly to S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: S3_CONFIG.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (S3_CONFIG.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Invalid file type. Allowed types: ${S3_CONFIG.allowedTypes.join(
            ", "
          )}`
        )
      );
    }
  },
});

/**
 * POST /api/upload/image
 * Upload image directly to S3
 */
router.post(
  "/image",
  authenticateUser,
  upload.single("image"),
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { folder = "templates" } = req.body;

      // Validate folder
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`,
        });
      }

      const uploadOptions: UploadOptions = {
        folder: folder as keyof typeof S3_CONFIG.folders,
        userId: req.user.id,
        fileName: req.file.originalname,
        contentType: req.file.mimetype,
        buffer: req.file.buffer,
      };

      const result = await uploadToS3(uploadOptions);

      res.json({
        message: "File uploaded successfully",
        file: {
          key: result.key,
          url: result.url,
          bucket: result.bucket,
          folder,
          originalName: req.file.originalname,
          size: req.file.size,
          mimeType: req.file.mimetype,
        },
      });
    } catch (error) {
      console.error("Upload error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Upload failed",
      });
    }
  }
);

/**
 * POST /api/upload/presigned-url
 * Get presigned URL for direct client uploads
 */
router.post(
  "/presigned-url",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { fileName, contentType, folder = "templates" } = req.body;

      if (!fileName || !contentType) {
        return res.status(400).json({
          message: "fileName and contentType are required",
        });
      }

      // Validate folder
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`,
        });
      }

      const result = await getPresignedUploadUrl(
        folder as keyof typeof S3_CONFIG.folders,
        req.user.id,
        fileName,
        contentType
      );

      res.json({
        message: "Presigned URL generated successfully",
        upload: result,
      });
    } catch (error) {
      console.error("Presigned URL error:", error);
      res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate presigned URL",
      });
    }
  }
);

/**
 * DELETE /api/upload/:key
 * Delete file from S3
 */
router.delete(
  "/:key(*)",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { key } = req.params;

      if (!key) {
        return res.status(400).json({ message: "File key is required" });
      }

      // Security: Only allow users to delete their own files
      const userPrefix = `user-${req.user.id}/`;
      if (!key.includes(userPrefix)) {
        return res.status(403).json({
          message: "You can only delete your own files",
        });
      }

      await deleteFromS3(key);

      res.json({
        message: "File deleted successfully",
        key,
      });
    } catch (error) {
      console.error("Delete error:", error);
      res.status(500).json({
        message: error instanceof Error ? error.message : "Delete failed",
      });
    }
  }
);

/**
 * GET /api/upload/user-files/:folder
 * List user's files in a specific folder
 */
router.get(
  "/user-files/:folder",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { folder } = req.params;

      // Validate folder
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`,
        });
      }

      const { listUserFiles } = await import("./s3-service");
      const files = await listUserFiles(
        folder as keyof typeof S3_CONFIG.folders,
        req.user.id
      );

      res.json({
        folder,
        files: files.map((key) => ({
          key,
          url: `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`,
        })),
      });
    } catch (error) {
      console.error("List files error:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to list files",
      });
    }
  }
);

/**
 * POST /api/upload/cleanup/:folder
 * Cleanup old files in a specific folder for the authenticated user
 */
router.post(
  "/cleanup/:folder",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { folder } = req.params;

      // Validate folder
      if (!Object.keys(S3_CONFIG.folders).includes(folder)) {
        return res.status(400).json({
          message: `Invalid folder. Allowed folders: ${Object.keys(
            S3_CONFIG.folders
          ).join(", ")}`,
        });
      }

      const { cleanupUserFolder } = await import("./s3-service");
      await cleanupUserFolder(
        folder as keyof typeof S3_CONFIG.folders,
        req.user.id
      );

      res.json({
        message: `Successfully cleaned up ${folder} folder for user ${req.user.id}`,
        folder,
        userId: req.user.id,
      });
    } catch (error) {
      console.error("Cleanup error:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to cleanup folder",
      });
    }
  }
);

/**
 * POST /api/upload/cleanup-all
 * Cleanup old files in all folders for the authenticated user
 */
router.post(
  "/cleanup-all",
  authenticateUser,
  async (req: AuthenticatedRequest, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: "User not authenticated" });
      }

      const { cleanupUserFolder } = await import("./s3-service");
      const folders = Object.keys(S3_CONFIG.folders) as Array<
        keyof typeof S3_CONFIG.folders
      >;
      const results = [];

      for (const folder of folders) {
        try {
          await cleanupUserFolder(folder, req.user.id);
          results.push({ folder, status: "success" });
        } catch (error) {
          console.error(`Cleanup failed for ${folder}:`, error);
          results.push({
            folder,
            status: "error",
            error: error instanceof Error ? error.message : "Unknown error",
          });
        }
      }

      res.json({
        message: `Cleanup completed for user ${req.user.id}`,
        userId: req.user.id,
        results,
      });
    } catch (error) {
      console.error("Cleanup all error:", error);
      res.status(500).json({
        message:
          error instanceof Error ? error.message : "Failed to cleanup folders",
      });
    }
  }
);

export { router as uploadRoutes };
