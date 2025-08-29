import { Pool as NeonPool, neonConfig } from "@neondatabase/serverless";
import { drizzle as neonDrizzle } from "drizzle-orm/neon-serverless";
import { drizzle as pgDrizzle } from "drizzle-orm/node-postgres";
// 'pg' is CommonJS; use default import then extract Pool for ESM compatibility
import pg from "pg";
const { Pool: PgPool } = pg;
import ws from "ws";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import * as schema from "@shared/schema";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

neonConfig.webSocketConstructor = ws;

// Require explicit DATABASE_URL (no more hard-coded production fallback)
const DATABASE_URL = process.env.DATABASE_URL || process.env.DB_URL || null;

let pool: any = null;
let db: any = null;

if (DATABASE_URL) {
  try {
    if (/neon\./i.test(DATABASE_URL) || /neon.tech/i.test(DATABASE_URL)) {
      // Neon serverless connection
      pool = new NeonPool({ connectionString: DATABASE_URL });
      db = neonDrizzle({ client: pool, schema });
      console.log("DB: connected using Neon serverless driver");
    } else {
      // Standard Postgres (e.g., AWS RDS) via pg
      // Configure SSL for RDS connections
      const isRDS = DATABASE_URL.includes("rds.amazonaws.com");
      const poolConfig: any = {
        connectionString: DATABASE_URL,
        max: 10,
      };

      if (isRDS) {
        // AWS RDS SSL configuration - bypass certificate validation for development
        poolConfig.ssl = {
          rejectUnauthorized: false,
          checkServerIdentity: () => undefined,
        };
        console.log("DB: Using AWS RDS with SSL bypass for development");
      }

      pool = new PgPool(poolConfig);
      db = pgDrizzle(pool, { schema });
      console.log("DB: connected using pg (RDS/Postgres) driver with SSL");
    }
  } catch (err) {
    console.error(
      `DB: initialization failure: ${
        (err as Error).message
      }. Continuing without DB.`
    );
  }
} else {
  if (process.env.NODE_ENV === "production") {
    console.error(
      "DB: FATAL - DATABASE_URL not set in production. The app will run without persistent storage."
    );
  } else {
    console.log(
      "Development mode: DATABASE_URL not set, falling back to in-memory storage (MemStorage)."
    );
  }
}

export { pool, db };
