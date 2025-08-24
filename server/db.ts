import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Temporarily use AWS RDS database URL directly
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://bjorkrealestate:Mcbkfg161@awseb-e-jxhud2jxqy-stack-awsebrdsdatabase-gzzxhy7mtvj8.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/ebdb";

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: DATABASE_URL });
export const db = drizzle({ client: pool, schema });