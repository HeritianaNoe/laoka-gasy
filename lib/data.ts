import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { categories, fady, foods } from "@/db/schema";

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
