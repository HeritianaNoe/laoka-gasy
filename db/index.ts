import { drizzle as drizzleNetlify } from "drizzle-orm/netlify-db";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";

// Tsy mampiasa db.query, ka tsy ilaina eto ny "schema" (miova arakaraka ny version an'ny drizzle).
const netlifyDb = () => drizzleNetlify();
type Db = ReturnType<typeof netlifyDb>;

// Eo an-toerana: DATABASE_URL (Postgres mahazatra). Ao amin'ny Netlify: Netlify DB.
export const db: Db = process.env.DATABASE_URL
  ? (drizzlePg({ connection: process.env.DATABASE_URL }) as unknown as Db)
  : netlifyDb();
