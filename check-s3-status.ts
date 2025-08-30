import { S3Client, ListObjectsV2Command, GetBucketPolicyCommand, GetBucketCorsCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2"
});

async function checkS3Status() {
  const bucket = "home-template-images";
  
  console.log("🔍 Checking S3 bucket status...\n");
  
  try {
    // Check bucket policy
    console.log("1️⃣ Checking bucket policy:");
    try {
      const policyCommand = new GetBucketPolicyCommand({ Bucket: bucket });
      const policyResult = await s3Client.send(policyCommand);
      console.log("✅ Bucket policy exists:");
      console.log(JSON.stringify(JSON.parse(policyResult.Policy || "{}"), null, 2));
    } catch (policyError) {
      console.log("❌ No bucket policy or error:", policyError.message);
    }
    
    console.log("\n2️⃣ Checking CORS configuration:");
    try {
      const corsCommand = new GetBucketCorsCommand({ Bucket: bucket });
      const corsResult = await s3Client.send(corsCommand);
      console.log("✅ CORS configuration exists:");
      console.log(JSON.stringify(corsResult.CORSRules, null, 2));
    } catch (corsError) {
      console.log("❌ No CORS configuration or error:", corsError.message);
    }
    
    console.log("\n3️⃣ Listing objects in bucket:");
    const listCommand = new ListObjectsV2Command({ 
      Bucket: bucket,
      MaxKeys: 50 
    });
    const listResult = await s3Client.send(listCommand);
    
    if (listResult.Contents && listResult.Contents.length > 0) {
      console.log(`✅ Found ${listResult.Contents.length} objects:`);
      listResult.Contents.forEach(obj => {
        console.log(`  📁 ${obj.Key} (${Math.round((obj.Size || 0) / 1024)}KB)`);
      });
    } else {
      console.log("❌ No objects found in bucket");
    }
    
    console.log("\n4️⃣ Testing specific file:");
    const targetFile = "agents/user-1/Mandy Visty headshot (1)_1753818758165.jpg";
    const fileExists = listResult.Contents?.some(obj => obj.Key === targetFile);
    console.log(`File "${targetFile}": ${fileExists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    
    console.log("\n5️⃣ AWS Environment Check:");
    console.log(`AWS_REGION: ${process.env.AWS_REGION || 'NOT SET'}`);
    console.log(`AWS_ACCESS_KEY_ID: ${process.env.AWS_ACCESS_KEY_ID ? 'SET' : 'NOT SET'}`);
    console.log(`AWS_SECRET_ACCESS_KEY: ${process.env.AWS_SECRET_ACCESS_KEY ? 'SET' : 'NOT SET'}`);
    
  } catch (error) {
    console.error("❌ Error checking S3:", error);
  }
}

checkS3Status();
