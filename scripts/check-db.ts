#!/usr/bin/env tsx
/**
 * Simple standalone DB connectivity check.
 * Usage:
 *   DATABASE_URL=postgresql://user:pass@host:5432/db npm run db:check
 * Exit codes:
 *   0 = success
 *   1 = missing DATABASE_URL
 *   2 = connection or query failed
 */
import { db } from "../server/db";
// Use relative import to avoid depending on tsconfig path mapping resolution when running via tsx
import { templates } from "../shared/schema";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error("[db:check] DATABASE_URL not set");
    process.exit(1);
  }
  try {
    if (!db) {
      console.error(
        "[db:check] db object not initialized (driver setup failed)"
      );
      process.exit(2);
    }
    const result: any = await db.execute("SELECT NOW() as now");
    const now = Array.isArray(result) ? result[0]?.now : undefined;
    const [tpl] = await db.select().from(templates).limit(1);
    console.log(
      JSON.stringify(
        {
          ok: true,
          now,
          hasTemplate: !!tpl,
        },
        null,
        2
      )
    );
    process.exit(0);
  } catch (err) {
    console.error(
      JSON.stringify({ ok: false, error: (err as Error).message }, null, 2)
    );
    process.exit(2);
  }
}

main();
