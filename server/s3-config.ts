/**
 * AWS S3 Configuration for Image Storage
 * Cost-effective image storage solution
 */

// AWS S3 Setup Instructions:
// 1. Create an S3 bucket (e.g., "your-app-name-media")
// 2. Set bucket policy for public read access to images
// 3. Enable CORS for web uploads
// 4. Use S3 Standard-IA for cost optimization

export const S3_CONFIG = {
  // AWS Configuration
  region: process.env.AWS_REGION || "us-east-2",
  bucket: process.env.S3_BUCKET_NAME || "nebraska-home-hub-media",
  
  // Cost Optimization Settings
  storageClass: "STANDARD_IA", // Cheaper for infrequently accessed files
  
  // Image Upload Settings
  maxFileSize: 10 * 1024 * 1024, // 10MB max per image
  allowedTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  
  // File Organization
  folders: {
    templates: "templates/", // User template images
    properties: "properties/", // Property listing images
    agents: "agents/", // Agent profile images
    logos: "logos/", // Company logos
    heroes: "heroes/", // Hero/banner images
  }
};

// Helper function to generate S3 URL
export function getS3Url(key: string): string {
  return `https://${S3_CONFIG.bucket}.s3.${S3_CONFIG.region}.amazonaws.com/${key}`;
}

// Helper function to generate file key
export function generateFileKey(
  folder: keyof typeof S3_CONFIG.folders,
  templateId: string,
  fileName: string
): string {
  const timestamp = Date.now();
  const extension = fileName.split('.').pop();
  return `${S3_CONFIG.folders[folder]}${templateId}/${timestamp}.${extension}`;
}

/**
 * Cost Comparison for Image Storage:
 * 
 * AWS S3 Standard-IA (Recommended):
 * - $0.0125 per GB/month
 * - $0.01 per 1,000 requests
 * - 30-day minimum storage
 * - Good for: Template images, agent photos (accessed less frequently)
 * 
 * AWS S3 Standard:
 * - $0.023 per GB/month  
 * - $0.0004 per 1,000 requests
 * - Good for: Frequently accessed property images
 * 
 * CloudFront CDN (Optional):
 * - $0.085 per GB data transfer
 * - Faster global delivery
 * - Add when you have users worldwide
 * 
 * Alternative: AWS S3 Intelligent Tiering
 * - Automatically moves files between tiers
 * - $0.0125 per 1,000 objects monitored
 * - Best for: Mixed usage patterns
 */

// Example usage:
// const imageKey = generateFileKey("templates", "user-123", "logo.png");
// const imageUrl = getS3Url(imageKey);
// Store imageUrl in database, not the actual image
