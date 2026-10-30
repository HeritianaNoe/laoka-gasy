import type { Food, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type GetFoodsOptions = {
  /** IDs des fady choisis par l'utilisateur, ex. [1, 3]. Vide / absent = aucun filtre. */
  fadyIds?: readonly number[] | null;
  categoryId?: number;
};

/** Garde uniquement des entiers positifs, sans doublons (protège contre NaN, null, 0, -1…). */
export function normalizeIds(ids?: readonly number[] | null): number[] {
  if (!ids?.length) return [];
  return [...new Set(ids.filter((n) => Number.isInteger(n) && n > 0))];
}

/**
 * Retourne les plats, en excluant ceux liés (via `foodswithfady`)
 * à au moins un des fady sélectionnés.
 *
 * - Aucun fady sélectionné → aucun filtre, tous les plats sont retournés.
 * - Un plat est masqué dès qu'UNE de ses lignes `foodswithfady` correspond à UN des IDs.
 * - Tout est fait en une seule requête SQL (NOT EXISTS), sans charger les plats exclus.
 */
export function getFoods({ fadyIds, categoryId }: GetFoodsOptions = {}): Promise<Food[]> {
  const excluded = normalizeIds(fadyIds);

  const where: Prisma.FoodWhereInput = {
    ...(categoryId ? { categoryId } : {}),
    ...(excluded.length > 0
      ? { foodswithfady: { none: { id_fady: { in: excluded } } } }
      : {}),
  };

  return prisma.food.findMany({
    where,
    orderBy: [{ heart: "desc" }, { rating: "desc" }, { name: "asc" }],
  });
}
