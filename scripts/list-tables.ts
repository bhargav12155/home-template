#!/usr/bin/env tsx
/**
 * List all tables in the PostgreSQL database
 */
import pg from "pg";
const { Pool } = pg;

const DATABASE_URL =
  "postgresql://bjorkrealestate:Mcbkfg161@db-bjorkrealestate.ct6g8giomnqf.us-east-2.rds.amazonaws.com:5432/app_db";

async function listTables() {
  const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    console.log("🔍 Connecting to PostgreSQL database...");

    // List all tables
    const tablesResult = await pool.query(`
      SELECT 
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    console.log("\n📋 **TABLES IN YOUR DATABASE:**");
    console.log("=".repeat(50));

    if (tablesResult.rows.length === 0) {
      console.log("❌ No tables found in the database");
    } else {
      tablesResult.rows.forEach((row, index) => {
        console.log(`${index + 1}. ${row.table_name} (${row.table_type})`);
      });
    }

    // Get table details for each table
    console.log("\n📊 **TABLE DETAILS:**");
    console.log("=".repeat(50));

    for (const table of tablesResult.rows) {
      console.log(`\n🔸 **${table.table_name.toUpperCase()}**`);

      const columnsResult = await pool.query(
        `
        SELECT 
          column_name,
          data_type,
          is_nullable,
          column_default
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = $1
        ORDER BY ordinal_position;
      `,
        [table.table_name]
      );

      columnsResult.rows.forEach((col) => {
        const nullable = col.is_nullable === "YES" ? "NULL" : "NOT NULL";
        const defaultVal = col.column_default
          ? ` DEFAULT ${col.column_default}`
          : "";
        console.log(
          `  - ${col.column_name}: ${col.data_type} ${nullable}${defaultVal}`
        );
      });
    }

    // Check some sample data counts
    console.log("\n📈 **TABLE ROW COUNTS:**");
    console.log("=".repeat(50));

    for (const table of tablesResult.rows) {
      try {
        const countResult = await pool.query(
          `SELECT COUNT(*) as count FROM "${table.table_name}"`
        );
        const count = countResult.rows[0].count;
        console.log(`${table.table_name}: ${count} rows`);
      } catch (err) {
        console.log(`${table.table_name}: Error counting rows`);
      }
    }

    await pool.end();
    console.log("\n✅ Database inspection complete!");
  } catch (err) {
    console.error("❌ Error:", (err as Error).message);
    await pool.end();
    process.exit(1);
  }
}

listTables();
