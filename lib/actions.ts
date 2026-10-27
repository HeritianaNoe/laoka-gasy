"use server";

import { getStore } from "@netlify/blobs";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { fady, foods } from "@/db/schema";

export type FormState = { ok: boolean; message: string } | null;

export async function toggleHeart(id: number, heart: boolean) {
  await db.update(foods).set({ heart }).where(eq(foods.id, id));
  revalidatePath("/", "layout");
}

export async function setRating(id: number, rating: number) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  await db.update(foods).set({ rating: value }).where(eq(foods.id, id));
  revalidatePath("/", "layout");
}

export async function deleteFood(id: number) {
  const [removed] = await db.delete(foods).where(eq(foods.id, id)).returning();
  if (removed?.photo.startsWith("/api/photos/")) {
    await getStore("laoka-photos").delete(removed.photo.replace("/api/photos/", ""));
  }
  revalidatePath("/", "layout");
}

export async function addFood(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = Number(formData.get("categoryId")) || null;
  const photo = formData.get("photo");

  if (!name || !description) return { ok: false, message: "Fenoy tsara daholo azafady!" };
  if (!(photo instanceof File) || photo.size === 0) return { ok: false, message: "Asio sary azafady!" };
  if (!photo.type.startsWith("image/")) return { ok: false, message: "Sary ihany no azo ampidirina." };

  const key = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  await getStore("laoka-photos").set(key, await photo.arrayBuffer(), {
    metadata: { contentType: photo.type },
  });

  await db.insert(foods).values({ name, description, categoryId, photo: `/api/photos/${key}` });
  revalidatePath("/", "layout");
  return { ok: true, message: "Voatahiry ny laoka nampidirinao!" };
}

export async function addFady(name: string) {
  const value = name.trim();
  if (!value) return;
  await db.insert(fady).values({ name: value });
  revalidatePath("/", "layout");
}

export async function updateFady(id: number, name: string) {
  const value = name.trim();
  if (!value) return;
  await db.update(fady).set({ name: value }).where(eq(fady.id, id));
  revalidatePath("/", "layout");
}

export async function deleteFady(id: number) {
  await db.delete(fady).where(eq(fady.id, id));
  revalidatePath("/", "layout");
}
