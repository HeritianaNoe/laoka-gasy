// Mitady ny URL PostgreSQL na inona na inona anaran'ny variable napetrak'i Vercel.
// (Neon/Supabase/Vercel Storage dia afaka manome anarana samihafa, ary raha misy "prefix"
//  toa an'ny STORAGE_ dia lasa STORAGE_DATABASE_URL, STORAGE_POSTGRES_URL ... )
const isPg = (v) => typeof v === "string" && /^postgres(ql)?:\/\//i.test(v.trim());

function find(env, exact, suffixes) {
  for (const k of exact) if (isPg(env[k])) return env[k].trim();
  for (const k of Object.keys(env)) {
    if (suffixes.some((s) => k.endsWith(s)) && isPg(env[k])) return env[k].trim();
  }
  return undefined;
}

export function resolveDatabaseUrls(env = process.env) {
  const direct = find(
    env,
    ["DIRECT_URL", "DATABASE_URL_UNPOOLED", "POSTGRES_URL_NON_POOLING"],
    ["_DATABASE_URL_UNPOOLED", "_POSTGRES_URL_NON_POOLING", "_DIRECT_URL"]
  );
  const pooled = find(
    env,
    ["DATABASE_URL", "POSTGRES_PRISMA_URL", "POSTGRES_URL"],
    ["_DATABASE_URL", "_POSTGRES_PRISMA_URL", "_POSTGRES_URL"]
  );
  return { pooled: pooled || direct, direct: direct || pooled };
}
