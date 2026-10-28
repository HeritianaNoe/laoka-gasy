import { prisma } from "@/lib/prisma";

// Read-side queries, equivalent to the Room DAOs of the Android app

export function getCategories() {
  return prisma.category.findMany({ orderBy: { id: "asc" } });
}

export function getFoods(categoryId?: number) {
  return prisma.food.findMany({
    where: categoryId ? { categoryId } : undefined,
    orderBy: [{ heart: "desc" }, { rating: "desc" }, { name: "asc" }],
  });
}

export function getFood(id: number) {
  return prisma.food.findUnique({ where: { id } });
}

export function getFadyList() {
  return prisma.fady.findMany({ orderBy: { name: "asc" } });
}

// A dish is "fady" when its name or description mentions a taboo ingredient
export function matchFady(food: { name: string; description: string }, fadyNames: string[]) {
  const text = `${food.name} ${food.description}`.toLowerCase();
  return fadyNames.filter((n) => n.trim() && text.includes(n.trim().toLowerCase()));
}

// Sokajy miaraka amin'ny isan'ny laoka ao aminy (ampiasain'ny dashboard admin)
export async function getCategoriesWithCount() {
  const rows = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { foods: true } } },
  });
  return rows.map(({ _count, ...c }) => ({ ...c, foodCount: _count.foods }));
}

// Laoka rehetra miaraka amin'ny anaran'ny sokajy (dashboard admin)
export async function getFoodsForAdmin() {
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
    },
  });
  return rows.map(({ category, ...f }) => ({ ...f, categoryName: category?.name ?? null }));
}

// Tsy mandefa ny passwordHash mankany amin'ny client mihitsy
export function getUsersForAdmin() {
  return prisma.user.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
}
