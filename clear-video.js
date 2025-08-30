import { db } from "./server/db.ts";
import { templates } from "./shared/schema.ts";
import { eq } from "drizzle-orm";

async function clearVideoUrl() {
  console.log("Clearing hero video URL for user 3...");
  const result = await db
    .update(templates)
    .set({ heroVideoUrl: null })
    .where(eq(templates.userId, 3))
    .returning();

  console.log("Updated template:", result[0]);
  console.log("Hero video URL cleared successfully!");
  process.exit(0);
}

clearVideoUrl().catch(console.error);
