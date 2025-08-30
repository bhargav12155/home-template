#!/usr/bin/env node

/**
 * Quick S3 Upload Script for Mike's Assets
 *
 * Uploads current hero video, logo, and agent photo to S3
 * and shows the URLs for manual template update.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { uploadToS3 } from "../server/s3-service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const MIKE_USER_ID = 1;

const assets = [
  {
    file: "attached_assets/Web page video_1753809980517.mp4",
    folder: "heroes",
    field: "heroVideoUrl",
  },
  {
    file: "attached_assets/2408BjorkGroupFinalLogo1_Bjork Group Black Square BHHS_1753648666870.png",
    folder: "logos",
    field: "logoUrl",
  },
  {
    file: "attached_assets/Mandy Visty headshot (1)_1753818758165.jpg",
    folder: "agents",
    field: "agentImageUrl",
  },
  {
    file: "attached_assets/White background_1753818665671.jpg",
    folder: "heroes",
    field: "heroImageUrl",
  },
];

async function uploadAssets() {
  console.log("🚀 Uploading Mike's assets to S3...\n");

  const results = [];

  for (const asset of assets) {
    const filePath = path.join(__dirname, "..", asset.file);

    if (!fs.existsSync(filePath)) {
      console.log(`❌ File not found: ${asset.file}`);
      continue;
    }

    try {
      const buffer = fs.readFileSync(filePath);
      const fileName = path.basename(asset.file);
      const ext = path.extname(fileName).toLowerCase();

      let contentType = "application/octet-stream";
      if ([".jpg", ".jpeg"].includes(ext)) contentType = "image/jpeg";
      else if (ext === ".png") contentType = "image/png";
      else if (ext === ".mp4") contentType = "video/mp4";

      console.log(
        `📤 Uploading: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(
          2
        )}MB)`
      );

      const result = await uploadToS3({
        folder: asset.folder,
        userId: MIKE_USER_ID,
        fileName,
        contentType,
        buffer,
      });

      results.push({
        field: asset.field,
        url: result.url,
        file: fileName,
      });

      console.log(`✅ Uploaded: ${result.url}\n`);
    } catch (error) {
      console.log(`❌ Failed to upload ${asset.file}:`, error.message);
    }
  }

  console.log("\n🎉 Upload completed!\n");
  console.log("📋 Template Updates Needed:");
  console.log("Copy these URLs to your template admin:\n");

  results.forEach((result) => {
    console.log(`${result.field}: ${result.url}`);
  });

  console.log("\n💡 Next steps:");
  console.log("1. Go to /admin/template in your app");
  console.log("2. Paste these URLs into the respective fields");
  console.log("3. Save the template");
  console.log("4. Your site will now use S3 images!");
}

uploadAssets().catch(console.error);
