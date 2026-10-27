import { asc, count, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, fady, foods, users } from "@/db/schema";

// Read-side queries, equivalent to the Room DAOs of the Android app

export function getCategories() {
  return db.select().from(categories).orderBy(asc(categories.id));
}

export function getFoods(categoryId?: number) {
  return db
    .select()
    .from(foods)
    .where(categoryId ? eq(foods.categoryId, categoryId) : undefined)
    .orderBy(desc(foods.heart), desc(foods.rating), asc(foods.name));
}

export async function getFood(id: number) {
  const [food] = await db.select().from(foods).where(eq(foods.id, id));
  return food;
}

export function getFadyList() {
  return db.select().from(fady).orderBy(asc(fady.name));
}

// A dish is "fady" when its name or description mentions a taboo ingredient
export function matchFady(food: { name: string; description: string }, fadyNames: string[]) {
  const text = `${food.name} ${food.description}`.toLowerCase();
  return fadyNames.filter((n) => n.trim() && text.includes(n.trim().toLowerCase()));
}

// Sokajy miaraka amin'ny isan'ny laoka ao aminy (ampiasain'ny dashboard admin)
export function getCategoriesWithCount() {
  return db
    .select({ id: categories.id, name: categories.name, photo: categories.photo, foodCount: count(foods.id) })
    .from(categories)
    .leftJoin(foods, eq(foods.categoryId, categories.id))
    .groupBy(categories.id)
    .orderBy(asc(categories.id));
}

// Laoka rehetra miaraka amin'ny anaran'ny sokajy (dashboard admin)
export function getFoodsForAdmin() {
  return db
    .select({
      id: foods.id,
      name: foods.name,
      description: foods.description,
      photo: foods.photo,
      heart: foods.heart,
      rating: foods.rating,
      categoryId: foods.categoryId,
      categoryName: categories.name,
    })
    .from(foods)
    .leftJoin(categories, eq(categories.id, foods.categoryId))
    .orderBy(asc(foods.name));
}

// Tsy mandefa ny passwordHash mankany amin'ny client mihitsy
export function getUsersForAdmin() {
  return db
    .select({ id: users.id, name: users.name, email: users.email, role: users.role, createdAt: users.createdAt })
    .from(users)
    .orderBy(asc(users.id));
}
