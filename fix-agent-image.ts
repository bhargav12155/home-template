import { S3Client, PutObjectAclCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-2",
});

async function makeAgentImagePublic() {
  const bucket = "home-template-images";
  const key = "agents/user-3/1756583078699-55929607.png";

  try {
    console.log(`Making image public: ${key}`);

    const command = new PutObjectAclCommand({
      Bucket: bucket,
      Key: key,
      ACL: "public-read",
    });

    await s3Client.send(command);
    console.log(`✅ Successfully made image public!`);
    console.log(
      `Image URL: https://${bucket}.s3.us-east-2.amazonaws.com/${key}`
    );
  } catch (error) {
    console.error("❌ Error making image public:", error);
  }
}

makeAgentImagePublic();
