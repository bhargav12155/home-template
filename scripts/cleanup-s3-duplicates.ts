#!/usr/bin/env tsx

import { storage } from "../server/storage";
import { deleteFromS3 } from "../server/s3-service";

/**
 * Cleanup duplicate S3 files, keeping only the ones referenced in the current template
 */

async function cleanupS3Duplicates() {
  try {
    console.log("🧹 Starting S3 duplicate cleanup...");

    // Get the template for user 1 (your main user)
    const template = await storage.getTemplateByUser(1);

    if (!template) {
      console.log("No template found for user 1");
      return;
    }

    console.log("Found template for user 1");

    // Collect all currently used S3 URLs
    const activeUrls = new Set<string>();

    if (template.logoUrl) activeUrls.add(template.logoUrl);
    if (template.heroImageUrl) activeUrls.add(template.heroImageUrl);
    if (template.agentImageUrl) activeUrls.add(template.agentImageUrl);
    if (template.heroVideoUrl) activeUrls.add(template.heroVideoUrl);

    console.log("Active S3 URLs in template:");
    activeUrls.forEach((url) => console.log(`  ✅ ${url}`));

    // Extract S3 keys from URLs
    const extractS3Key = (url: string): string | null => {
      if (
        !url ||
        !url.includes("home-template-images.s3.us-east-2.amazonaws.com")
      ) {
        return null;
      }
      const parts = url.split(".amazonaws.com/");
      return parts.length > 1 ? decodeURIComponent(parts[1]) : null;
    };

    const activeKeys = new Set<string>();
    activeUrls.forEach((url) => {
      const key = extractS3Key(url);
      if (key) activeKeys.add(key);
    });

    console.log("\nActive S3 keys:");
    activeKeys.forEach((key) => console.log(`  ✅ ${key}`));

    // List of all known S3 files that might be duplicates
    const allS3Files = [
      // Logo files (from AWS console screenshot)
      "logos/user-1/1756535363294-IMG_2104.jpg",
      "logos/user-1/1756571868857-IMG_1810.jpg",
      "logos/user-1/1756573379810-IMG_1810.jpg",
      "logos/user-1/1756573691254-IMG_1810.jpg",
      "logos/user-1/logo-horizontal.png",
      "logos/user-1/logo-square.png",
    ];

    console.log("\n🔍 Checking files for deletion...");

    let deletedCount = 0;

    for (const key of allS3Files) {
      if (!activeKeys.has(key)) {
        console.log(`🗑️  Deleting unused file: ${key}`);
        try {
          await deleteFromS3(key);
          deletedCount++;
          console.log(`   ✅ Successfully deleted: ${key}`);
        } catch (error) {
          console.error(`   ❌ Failed to delete ${key}:`, error);
        }
      } else {
        console.log(`   ⚠️  Keeping active file: ${key}`);
      }
    }

    console.log(
      `\n🎉 Cleanup complete! Deleted ${deletedCount} duplicate files.`
    );
  } catch (error) {
    console.error("❌ Error during cleanup:", error);
    process.exit(1);
  }
}

// Run the cleanup
cleanupS3Duplicates()
  .then(() => {
    console.log("✅ S3 cleanup finished successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ S3 cleanup failed:", error);
    process.exit(1);
  });
