/** Garde les entiers > 0, sans doublons (écarte NaN, 0, négatifs, null…). */
export function normalizeIds(ids?: readonly number[] | null): number[] {
  return [...new Set((ids ?? []).filter((n) => Number.isInteger(n) && n > 0))];
}

/** "1,3" → [1, 3]. Chaîne vide / absente / invalide → []. */
export function parseIdList(csv?: string | null): number[] {
  return normalizeIds((csv ?? "").split(",").filter(Boolean).map(Number));
}
