import type { Prisma } from "@prisma/client";
import { normalizeIds } from "@/lib/ids";
import { prisma } from "@/lib/prisma";

const ORDER: Prisma.FoodOrderByWithRelationInput[] = [{ heart: "desc" }, { rating: "desc" }, { name: "asc" }];

export const clampRating = (n: unknown) => Math.max(0, Math.min(5, Math.round(Number(n) || 0)));

/**
 * Exclusion par fady : un plat est écarté dès qu'UNE de ses lignes `foodswithfady`
 * pointe vers UN des fady choisis (→ NOT EXISTS côté SQL). Aucun fady → aucun filtre.
 */
function withoutFady(fadyIds?: readonly number[] | null): Prisma.FoodWhereInput {
  const ids = normalizeIds(fadyIds);
  return ids.length > 0 ? { foodswithfady: { none: { id_fady: { in: ids } } } } : {};
}

// ---------- Lecture ----------

export function listFoods({ categoryId, fadyIds }: { categoryId?: number; fadyIds?: readonly number[] | null } = {}) {
  // `categoryId: undefined` = pas de filtre (comportement Prisma)
  return prisma.food.findMany({ where: { categoryId, ...withoutFady(fadyIds) }, orderBy: ORDER });
}

/** Plat + sa catégorie + les fady qu'il contient. */
export async function getFood(id: number) {
  const row = await prisma.food.findUnique({
    where: { id },
    include: { category: true, foodswithfady: { include: { fady: true } } },
  });
  if (!row) return null;
  const { foodswithfady, ...food } = row;
  return { ...food, fady: foodswithfady.map((l) => l.fady) };
}

export async function listFoodsForAdmin() {
  const rows = await prisma.food.findMany({
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      photo: true,
      heart: true,
      rating: true,
      categoryId: true,
      category: { select: { name: true } },
      foodswithfady: { select: { id_fady: true } },
    },
  });
  return rows.map(({ category, foodswithfady, ...f }) => ({
    ...f,
    categoryName: category?.name ?? null,
    fadyIds: foodswithfady.map((l) => l.id_fady),
  }));
}

// ---------- Écriture ----------

export type FoodData = {
  name: string;
  description?: string;
  /** undefined = inchangé (update) / défaut (create) */
  photo?: string;
  heart?: boolean;
  rating?: number;
  categoryId?: number | null;
};

const links = (fadyIds: readonly number[]) =>
  normalizeIds(fadyIds).map((id_fady) => ({ fady: { connect: { id: id_fady } } }));

/**
 * Nested write (foodswithfady) → Prisma "checked input":
 * tsy azo ampiasaina ny categoryId scalar, fa category: { connect }.
 */
function withCategory(data: FoodData, { disconnectIfNull = false } = {}) {
  const { categoryId, ...fields } = data;
  if (categoryId != null) return { ...fields, category: { connect: { id: categoryId } } };
  if (disconnectIfNull) return { ...fields, category: { disconnect: true } };
  return fields;
}

/** Manasaraka ny akora amin'ny teny "sy" (tsy atao akora ny mpampisaraka). */
export function splitFoodIngredients(name: string): string[] {
  return [...new Set(name.split(/\s+sy\s+/i).map((part) => part.trim()).filter(Boolean))];
}

/** Mamorona/mitady fady avy amin'ny anaran'ny laoka, araka ny filaharany. */
async function resolveIngredientFady(tx: Prisma.TransactionClient, name: string): Promise<number[]> {
  const ingredients = splitFoodIngredients(name);
  const ids: number[] = [];
  for (const ingredient of ingredients) {
    const existing = await tx.fady.findFirst({
      where: { name: { equals: ingredient, mode: "insensitive" } },
      select: { id: true },
    });
    const fady = existing ?? (await tx.fady.create({ data: { name: ingredient }, select: { id: true } }));
    ids.push(fady.id);
  }
  return ids;
}

/** Mamorona laoka sy foodswithfady atomika; raha tsy omena IDs dia avy amin'ny anaran'ny laoka. */
export async function createFood(data: FoodData, fadyIds?: readonly number[]) {
  return prisma.$transaction(async (tx) => {
    const resolvedIds = fadyIds === undefined ? await resolveIngredientFady(tx, data.name) : normalizeIds(fadyIds);
    return tx.food.create({
      data: { ...withCategory(data), foodswithfady: { create: links(resolvedIds) } },
    });
  });
}

/** Raha omena fadyIds dia ampiasaina; raha tsy izany dia averina alaina avy amin'ny anaran'ny laoka. */
export async function updateFood(id: number, data: FoodData, fadyIds?: readonly number[]) {
  return prisma.$transaction(async (tx) => {
    const resolvedIds = fadyIds === undefined ? await resolveIngredientFady(tx, data.name) : normalizeIds(fadyIds);
    return tx.food.update({
      where: { id },
      data: {
        ...withCategory(data, { disconnectIfNull: true }),
        foodswithfady: { deleteMany: {}, create: links(resolvedIds) },
      },
    });
  });
}

export const setHeart = (id: number, heart: boolean) => prisma.food.update({ where: { id }, data: { heart } });

export const setRating = (id: number, rating: number) =>
  prisma.food.update({ where: { id }, data: { rating: clampRating(rating) } });

/** deleteMany : pas d'erreur si le plat n'existe déjà plus. Les liens partent en cascade. */
export const deleteFood = (id: number) => prisma.food.deleteMany({ where: { id } });
