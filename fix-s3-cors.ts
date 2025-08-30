import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2"
});

async function configureCORS() {
  const bucket = "home-template-images";
  
  const corsConfiguration = {
    CORSRules: [
      {
        AllowedHeaders: ["*"],
        AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
        AllowedOrigins: ["*"],
        ExposeHeaders: ["ETag"],
        MaxAgeSeconds: 3000
      }
    ]
  };
  
  try {
    console.log(`Setting CORS policy for bucket: ${bucket}`);
    
    const command = new PutBucketCorsCommand({
      Bucket: bucket,
      CORSConfiguration: corsConfiguration
    });
    
    await s3Client.send(command);
    console.log(`✅ Successfully set CORS policy for S3 bucket!`);
    
  } catch (error) {
    console.error("❌ Error setting CORS policy:", error);
  }
}

configureCORS();
