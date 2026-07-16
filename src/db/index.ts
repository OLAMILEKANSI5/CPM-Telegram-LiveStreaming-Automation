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
      // Safe fallback during build time (Netlify, Vercel static builds, etc.)
      if (process.env.NODE_ENV === "production" && !process.env.DATABASE_URL) {
        console.warn("⚠️ DATABASE_URL is missing. Using mock DB for build.");
        // Return a dummy drizzle instance so build doesn't crash
        return drizzle({} as any);
      }
      throw new Error("DATABASE_URL is missing");
    }
    pool = new Pool({
      connectionString: databaseUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });
    globalForDb.__pool = pool;
  }
  return drizzle(pool);
}
