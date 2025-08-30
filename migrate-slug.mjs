#!/usr/bin/env node

// Migration script to add customSlug column
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
const { Pool } = pg;

// Use the same database URL from the server logs
const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL;

async function migrate() {
  if (!DATABASE_URL) {
    console.error(
      "No DATABASE_URL found. Please set the environment variable."
    );
    process.exit(1);
  }

  const poolConfig = {
    connectionString: DATABASE_URL,
    max: 10,
  };

  // AWS RDS SSL configuration - bypass certificate validation for development
  if (DATABASE_URL.includes("rds.amazonaws.com")) {
    poolConfig.ssl = {
      rejectUnauthorized: false,
      checkServerIdentity: () => undefined,
    };
    console.log("Using AWS RDS with SSL bypass for development");
  }

  const pool = new Pool(poolConfig);

  try {
    console.log("Adding custom_slug column to users table...");

    // Add the column
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS custom_slug TEXT
    `);

    console.log("✅ Added custom_slug column");

    // Add unique index
    await pool.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS users_custom_slug_unique 
      ON users(custom_slug) 
      WHERE custom_slug IS NOT NULL
    `);

    console.log("✅ Added unique index on custom_slug");

    // Check if the column exists
    const result = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'custom_slug'
    `);

    if (result.rows.length > 0) {
      console.log("✅ Migration completed successfully!");
    } else {
      console.log("❌ Column was not created");
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await pool.end();
  }
}

migrate();
