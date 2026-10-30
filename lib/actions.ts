"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadPhoto } from "@/lib/storage";
import * as foodService from "@/lib/services/foods";

export type FormState = { ok: boolean; message: string } | null;

export async function toggleHeart(id: number, heart: boolean) {
  await prisma.food.update({ where: { id }, data: { heart } });
  revalidatePath("/", "layout");
}

export async function setRating(id: number, rating: number) {
  const value = Math.max(0, Math.min(5, Math.round(rating)));
  await prisma.food.update({ where: { id }, data: { rating: value } });
  revalidatePath("/", "layout");
}

/**
 * Hampiditra laoka: mamorona automatic ny fady avy amin'ny anarana
 * (zaraina amin'ny "sy") ary manampy foodswithfady.
 */
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

  try {
    // fadyIds = undefined → createFood mamorona/mitady fady avy amin'ny anarana
    // ary manampy foodswithfady automatic
    await foodService.createFood({ name, description, categoryId, photo: photoUrl });
  } catch (e) {
    console.error("[addFood] create", e);
    return { ok: false, message: "Tsy nety ny firaketana. Andramo indray." };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "Voatahiry ny laoka nampidirinao!" };
}

export async function addFady(name: string) {
  const value = name.trim();
  if (!value) return;
  await prisma.fady.create({ data: { name: value } });
  revalidatePath("/", "layout");
}
