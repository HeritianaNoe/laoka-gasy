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
process.exit(r.status ?? 1);
