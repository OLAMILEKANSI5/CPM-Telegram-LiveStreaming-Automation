

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & {
  __pool?: Pool;
};

let pool: Pool | undefined = globalForDb.__pool;

export function getDb() {
  if (!pool) {
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      console.error("❌ DATABASE_URL is not set in environment variables");
      // Return a dummy client so the app doesn't crash completely
      return {
        select: () => ({ from: () => ({ limit: () => Promise.resolve([]) }) }),
        insert: () => ({ values: () => ({ onConflictDoNothing: () => Promise.resolve() }) }),
        update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
      } as any;
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });

    globalForDb.__pool = pool;
  }

  return drizzle(pool);
}
