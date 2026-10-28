"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { fady, foods } from "@/db/schema";
import { uploadPhoto } from "@/lib/storage";

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

export async function addFood(_prev: FormState, formData: FormData): Promise<FormState> {
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const categoryId = Number(formData.get("categoryId")) || null;
  const photo = formData.get("photo");

  if (!name || !description) return { ok: false, message: "Fenoy tsara daholo azafady!" };
  if (!(photo instanceof File) || photo.size === 0) return { ok: false, message: "Asio sary azafady!" };
  if (!photo.type.startsWith("image/")) return { ok: false, message: "Sary ihany no azo ampidirina." };

  let photoUrl: string;
  try {
    photoUrl = await uploadPhoto(photo, photo.type || "image/jpeg");
  } catch (e) {
    console.error("[addFood] upload", e);
    return { ok: false, message: "Tsy nety ny fampiraisana sary. Andramo indray." };
  }

  await db.insert(foods).values({ name, description, categoryId, photo: photoUrl });
  revalidatePath("/", "layout");
  return { ok: true, message: "Voatahiry ny laoka nampidirinao!" };
}

export async function addFady(name: string) {
  const value = name.trim();
  if (!value) return;
  await db.insert(fady).values({ name: value });
  revalidatePath("/", "layout");
}

export async function deleteFood(id: number) {
  const [removed] = await db.delete(foods).where(eq(foods.id, id)).returning();
  // deletePhoto dia no-op (data URL ao anaty DB), fa atao ihany mba hitovy amin'ny admin
  // (raha te-hanafatra azy dia import { deletePhoto } from "@/lib/storage")
  revalidatePath("/", "layout");
  return removed;
}
