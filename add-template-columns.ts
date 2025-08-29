import { drizzle } from "drizzle-orm/node-postgres";
import pkg from "pg";
const { Pool } = pkg;

// Create connection like the main app
const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL;

if (!DATABASE_URL) {
  console.log("No DATABASE_URL found");
  process.exit(1);
}

const isRDS = DATABASE_URL.includes("rds.amazonaws.com");
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: isRDS ? { rejectUnauthorized: false } : undefined,
});

const db = drizzle(pool);

async function addTemplateColumns() {
  try {
    console.log("Adding missing template columns...");

    // Add columns using raw SQL
    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS hero_title TEXT DEFAULT 'Ready to Find Your Dream Home?';
    `);
    console.log("✓ Added hero_title column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS hero_subtitle TEXT DEFAULT 'Let''s start your luxury real estate journey today. Our team is here to make your Nebraska home buying or selling experience exceptional.';
    `);
    console.log("✓ Added hero_subtitle column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS contact_phone TEXT DEFAULT '(402) 522-6131';
    `);
    console.log("✓ Added contact_phone column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS contact_phone_text TEXT DEFAULT 'Call or text anytime';
    `);
    console.log("✓ Added contact_phone_text column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS office_address TEXT DEFAULT '331 Village Pointe Plaza';
    `);
    console.log("✓ Added office_address column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS office_city TEXT DEFAULT 'Omaha';
    `);
    console.log("✓ Added office_city column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS office_state TEXT DEFAULT 'NE';
    `);
    console.log("✓ Added office_state column");

    await db.execute(`
      ALTER TABLE templates ADD COLUMN IF NOT EXISTS office_zip TEXT DEFAULT '68130';
    `);
    console.log("✓ Added office_zip column");

    console.log("All template columns added successfully!");
  } catch (error) {
    console.error("Error adding template columns:", error);
  } finally {
    await pool.end();
  }
}

addTemplateColumns();
