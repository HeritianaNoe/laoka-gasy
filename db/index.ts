import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Database client — standard Postgres via DATABASE_URL.
 * Works on Vercel, Netlify, local, Neon, Supabase, Railway, etc.
 */
function createDb() {
  const url = process.env.DATABASE_URL?.trim();
  if (!url) {
    throw new Error(
      "DATABASE_URL tsy voafaritra. Apetraho ao amin'ny .env.local (na env vars an'ny host).",
    );
  }
  const pool = new Pool({ connectionString: url });
  return drizzle(pool);
}

export const db = createDb();
