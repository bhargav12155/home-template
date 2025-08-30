import { S3Client, PutBucketPolicyCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
});

async function makeBucketPublic() {
  const bucket = "home-template-images";

  const policy = {
    Version: "2012-10-17",
    Statement: [
      {
        Sid: "PublicReadGetObject",
        Effect: "Allow",
        Principal: "*",
        Action: "s3:GetObject",
        Resource: `arn:aws:s3:::${bucket}/*`,
      },
    ],
  };

  try {
    console.log(`Setting public read policy for bucket: ${bucket}`);

    const command = new PutBucketPolicyCommand({
      Bucket: bucket,
      Policy: JSON.stringify(policy),
    });

    await s3Client.send(command);
    console.log(
      `✅ Successfully set bucket policy! All objects are now publicly readable.`
    );
    console.log(
      `You can now access images like: https://${bucket}.s3.us-east-2.amazonaws.com/agents/user-3/1756583078699-55929607.png`
    );
  } catch (error) {
    console.error("❌ Error setting bucket policy:", error);
  }
}

makeBucketPublic();
