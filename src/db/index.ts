// src/db/index.ts (updated)
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const globalForDb = globalThis as typeof globalThis & { __pool?: Pool };

export function getDb() {
  if (!pool) {  // renamed for clarity
    const databaseUrl = process.env.DATABASE_URL;

    if (!databaseUrl) {
      // During Next.js build (Netlify, Vercel static export, etc.) or when DB not configured
      if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
        console.warn("DATABASE_URL missing - using mock DB for build");
        // Return a no-op drizzle instance for build-time safety
        return drizzle({} as any); // or implement lightweight mock if needed
      }
      throw new Error("DATABASE_URL is missing");
    }

    pool = new Pool({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
    });

    globalForDb.__pool = pool;
  }
  return drizzle(pool);
}
