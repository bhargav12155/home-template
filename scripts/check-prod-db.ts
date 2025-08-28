#!/usr/bin/env tsx
/**
 * Production database connectivity verification script.
 * Use this to test the exact DATABASE_URL that will be used in production.
 *
 * Usage:
 *   DATABASE_URL="postgresql://..." npm run prod:db:check
 */

import pg from "pg";
const { Pool } = pg;
import { drizzle } from "drizzle-orm/node-postgres";
import { templates } from "../shared/schema";

const DATABASE_URL =
  process.env.DATABASE_URL ||
  "postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db";

async function main() {
  console.log("🔍 Testing production database connection...");
  console.log(`📍 Target: ${DATABASE_URL.replace(/:[^:]*@/, ":***@")}`);

  // Configure SSL for RDS
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  const db = drizzle(pool, { schema: { templates } });

  try {
    // Test basic connectivity
    const result: any = await pool.query(
      "SELECT NOW() as now, version() as version"
    );
    const now = result.rows[0]?.now;
    const version = result.rows[0]?.version;

    // Test table access
    const [tpl] = await db.select().from(templates).limit(1);

    // Test extension availability
    const extResult: any = await pool.query("SELECT gen_random_uuid() as uuid");
    const uuid = extResult.rows[0]?.uuid;

    console.log("✅ Production database connection successful!");
    console.log(
      JSON.stringify(
        {
          ok: true,
          timestamp: now,
          version: version?.substring(0, 50) + "...",
          hasTemplate: !!tpl,
          pgcryptoWorking: !!uuid,
          uuid: uuid,
        },
        null,
        2
      )
    );

    await pool.end();
    process.exit(0);
  } catch (err) {
    console.error("❌ Production database connection failed:");
    console.error(
      JSON.stringify(
        {
          ok: false,
          error: (err as Error).message,
        },
        null,
        2
      )
    );

    await pool.end();
    process.exit(2);
  }
}

main();
