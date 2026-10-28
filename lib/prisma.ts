import { PrismaClient } from "@prisma/client";

const isPg = (v?: string) => !!v && /^postgres(ql)?:\/\//i.test(v.trim());

/** Mitady ny URL PostgreSQL na inona na inona anaran'ny variable napetrak'i Vercel. */
function getDatabaseUrl(): string | undefined {
  const env = process.env;
  for (const k of ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"]) {
    if (isPg(env[k])) return env[k]!.trim();
  }
  const suffixes = ["_DATABASE_URL", "_POSTGRES_PRISMA_URL", "_POSTGRES_URL"];
  for (const k of Object.keys(env)) {
    if (suffixes.some((s) => k.endsWith(s)) && isPg(env[k])) return env[k]!.trim();
  }
  return undefined;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ datasourceUrl: getDatabaseUrl() });

// Ampiasaina foana (dev sy production) mba tsy hamorona connection vaovao isaky ny request
globalForPrisma.prisma = prisma;
