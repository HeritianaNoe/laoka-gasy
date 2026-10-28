// Mamorona/manavao ny table (Category, Food, Fady, User) ao amin'ny PostgreSQL avy amin'ny prisma/schema.prisma.
// Mandeha ao anaty build an'i Vercel. Mampiasa ny URL "direct" (tsy pooler) satria
// ny `prisma db push` tsy mandeha amin'ny pgbouncer.
import { spawnSync } from "node:child_process";
import { resolveDatabaseUrls } from "./db-env.mjs";

const { direct } = resolveDatabaseUrls();

if (!direct) {
  const msg =
    "\n[db-push] TSY HITA ny URL PostgreSQL.\n" +
    "  Vercel > Project > Storage > Connect Database (ho an'ity project ity),\n" +
    "  na Settings > Environment Variables > ampio DATABASE_URL (postgresql://...),\n" +
    "  dia Redeploy.\n";
  if (process.env.VERCEL) {
    console.error(msg);
    process.exit(1);
  }
  console.warn(msg + "  (Nolaviana ny db push eto an-toerana.)");
  process.exit(0);
}

console.log("[db-push] Mamorona/manavao ny table ao amin'ny database...");
const r = spawnSync("npx", ["prisma", "db", "push", "--skip-generate"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: direct },
  shell: process.platform === "win32",
});
if ((r.status ?? 1) !== 0) process.exit(r.status ?? 1);

// Mampiditra ny angona voalohany (sokajy, laoka, fady). Tsy mamerina raha efa misy angona,
// ka azo atao isaky ny deploy. Tsy manapaka ny build raha tsy nety.
console.log("[db-push] Mampiditra ny angona voalohany (seed)...");
const seed = spawnSync("npx", ["tsx", "prisma/seed.ts"], {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: direct },
  shell: process.platform === "win32",
});
if (seed.status !== 0) console.warn("[db-push] Tsy nety ny seed (tsy manapaka ny build).");
process.exit(0);
