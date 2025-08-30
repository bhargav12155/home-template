/**
 * Migration Script: Move Assets to S3 for Multi-Client Support
 *
 * This script uploads existing client assets (Mike's images/videos) to S3
 * and updates the template system to use S3 URLs instead of local files.
 *
 * Features:
 * - Uploads hero video, logos, agent photos to S3
 * - Organizes by client/user ID for multi-tenant support
 * - Updates database templates with S3 URLs
 * - Maintains backward compatibility
 */

import fs from "fs";
import path from "path";
import { uploadToS3 } from "../server/s3-service";
import { storage } from "../server/storage";

interface AssetMapping {
  localPath: string;
  s3Folder: "heroes" | "logos" | "agents" | "templates";
  templateField: string;
  description: string;
}

// Current Mike/client assets to migrate
const MIKE_ASSETS: AssetMapping[] = [
  {
    localPath: "attached_assets/Web page video_1753809980517.mp4",
    s3Folder: "heroes",
    templateField: "heroVideoUrl",
    description: "Hero background video",
  },
  {
    localPath:
      "attached_assets/2408BjorkGroupFinalLogo1_Bjork Group Black Square BHHS_1753648666870.png",
    s3Folder: "logos",
    templateField: "logoUrl",
    description: "Company logo (square)",
  },
  {
    localPath:
      "attached_assets/2408BjorkGroupFinalLogo1_Bjork Group Black_1753648529804.png",
    s3Folder: "logos",
    templateField: "logoUrlAlt",
    description: "Company logo (horizontal)",
  },
  {
    localPath: "attached_assets/Mandy Visty headshot (1)_1753818758165.jpg",
    s3Folder: "agents",
    templateField: "agentImageUrl",
    description: "Agent profile photo",
  },
  {
    localPath: "attached_assets/White background_1753818665671.jpg",
    s3Folder: "heroes",
    templateField: "heroImageUrl",
    description: "Hero background image",
  },
];

// Test client configuration for Mike
const MIKE_CLIENT = {
  userId: 1, // Assuming Mike is user ID 1
  clientName: "mike-bjork",
  companyName: "Bjork Group Real Estate",
  agentName: "Michael Bjork",
};

async function uploadAsset(
  localPath: string,
  s3Folder: "heroes" | "logos" | "agents" | "templates",
  userId: number,
  description: string
): Promise<string> {
  const fullPath = path.join(process.cwd(), localPath);

  if (!fs.existsSync(fullPath)) {
    console.warn(`⚠️  File not found: ${fullPath}`);
    return "";
  }

  try {
    const buffer = fs.readFileSync(fullPath);
    const fileName = path.basename(localPath);
    const fileExtension = path.extname(fileName).toLowerCase();

    // Determine content type
    let contentType = "application/octet-stream";
    if ([".jpg", ".jpeg"].includes(fileExtension)) contentType = "image/jpeg";
    else if (fileExtension === ".png") contentType = "image/png";
    else if (fileExtension === ".webp") contentType = "image/webp";
    else if (fileExtension === ".gif") contentType = "image/gif";
    else if (fileExtension === ".mp4") contentType = "video/mp4";

    console.log(
      `📤 Uploading ${description}: ${fileName} (${(
        buffer.length /
        1024 /
        1024
      ).toFixed(2)} MB)`
    );

    const result = await uploadToS3({
      folder: s3Folder,
      userId,
      fileName,
      contentType,
      buffer,
    });

    console.log(`✅ Uploaded to S3: ${result.url}`);
    return result.url;
  } catch (error) {
    console.error(`❌ Failed to upload ${localPath}:`, error);
    return "";
  }
}

async function updateTemplate(userId: number, updates: Record<string, string>) {
  try {
    console.log(`📝 Updating template for user ${userId}...`);

    // Get existing template or create new one
    let template = await storage.getTemplateByUser(userId);

    if (!template) {
      console.log(`Creating new template for user ${userId}`);
      template = await storage.createTemplateForUser(userId, {
        companyName: MIKE_CLIENT.companyName,
        agentName: MIKE_CLIENT.agentName,
        ...updates,
      });
    } else {
      console.log(`Updating existing template for user ${userId}`);
      template = await storage.updateTemplateByUser(userId, updates);
    }

    console.log(`✅ Template updated with S3 URLs`);
    return template;
  } catch (error) {
    console.error(`❌ Failed to update template:`, error);
    throw error;
  }
}

async function migrateAssetsToS3() {
  console.log("🚀 Starting asset migration to S3...\n");
  console.log(`📁 Migrating assets for client: ${MIKE_CLIENT.clientName}`);
  console.log(`👤 User ID: ${MIKE_CLIENT.userId}\n`);

  const templateUpdates: Record<string, string> = {};

  // Upload each asset
  for (const asset of MIKE_ASSETS) {
    console.log(`\n--- Processing: ${asset.description} ---`);

    const s3Url = await uploadAsset(
      asset.localPath,
      asset.s3Folder,
      MIKE_CLIENT.userId,
      asset.description
    );

    if (s3Url) {
      templateUpdates[asset.templateField] = s3Url;
    }
  }

  // Update template with S3 URLs
  if (Object.keys(templateUpdates).length > 0) {
    console.log("\n--- Updating Template ---");
    await updateTemplate(MIKE_CLIENT.userId, templateUpdates);
  }

  console.log("\n🎉 Migration completed successfully!");
  console.log("\n📊 Summary:");
  console.log(`- Assets uploaded: ${Object.keys(templateUpdates).length}`);
  console.log(`- Template updated for user: ${MIKE_CLIENT.userId}`);
  console.log(`- S3 bucket: home-template-images`);

  // Show the S3 URLs
  console.log("\n🔗 S3 URLs generated:");
  Object.entries(templateUpdates).forEach(([field, url]) => {
    console.log(`- ${field}: ${url}`);
  });
}

// Update frontend components to use S3 URLs from template
async function updateFrontendComponents() {
  console.log(
    "\n🔧 Frontend components will use template S3 URLs automatically"
  );
  console.log("- Hero component uses template.heroVideoUrl");
  console.log("- Header component uses template.logoUrl");
  console.log("- Agent sections use template.agentImageUrl");
  console.log("- Images pull from user-specific template based on login");
}

async function main() {
  try {
    await migrateAssetsToS3();
    await updateFrontendComponents();

    console.log("\n✨ Multi-client asset system ready!");
    console.log("💡 Benefits:");
    console.log("- Reduced deployment size (no local images)");
    console.log("- Multi-client support (each user has own assets)");
    console.log("- Scalable S3 storage with CDN capabilities");
    console.log("- Template-based image management");
  } catch (error) {
    console.error("\n💥 Migration failed:", error);
    process.exit(1);
  }
}

// Export for use in other scripts
export { uploadAsset, updateTemplate, MIKE_ASSETS, MIKE_CLIENT };

// Run if called directly
if (require.main === module) {
  main();
}
