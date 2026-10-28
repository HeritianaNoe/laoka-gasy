"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { uploadPhoto } from "@/lib/storage";

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

  await prisma.food.create({ data: { name, description, categoryId, photo: photoUrl } });
  revalidatePath("/", "layout");
  return { ok: true, message: "Voatahiry ny laoka nampidirinao!" };
}

export async function addFady(name: string) {
  const value = name.trim();
  if (!value) return;
  await prisma.fady.create({ data: { name: value } });
  revalidatePath("/", "layout");
}
