"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession, hashPassword, requireAdmin, requireUser, safeEqual, verifyPassword } from "@/lib/auth";
import { deletePhoto, uploadPhoto } from "@/lib/storage";

export type FormState = { ok: boolean; message: string } | null;

const BAD_LOGIN: FormState = { ok: false, message: "Diso ny mailaka na ny teny miafina." };
const MAX_PHOTO = 3 * 1024 * 1024;

// ---------- Fidirana ----------

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return BAD_LOGIN;

  // Admin voalohany: noforonina avy amin'ny ADMIN_EMAIL / ADMIN_PASSWORD raha mbola tsy misy admin
  const existingAdmin = await prisma.user.findFirst({ where: { role: "admin" }, select: { id: true } });
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!existingAdmin && envEmail && envPassword && safeEqual(email, envEmail) && safeEqual(password, envPassword)) {
    await prisma.user.create({ data: { name: "Admin", email, passwordHash: await hashPassword(password), role: "admin" } });
  }

alert("password " + password + " email: " + email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) return BAD_LOGIN;
  
  

  await createSession(user.id);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/miditra");
}

// ---------- CRUD Sokajy ----------

type PhotoInput = { error: string } | { photo: string };

async function readPhoto(formData: FormData, current = ""): Promise<PhotoInput> {
  let photo = String(formData.get("photoPath") ?? "").trim() || current;
  const file = formData.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Sary ihany no azo ampidirina." };
    if (file.size > MAX_PHOTO) return { error: "Lehibe loatra ny sary (3 MB ny fetra)." };
    try {
      photo = await uploadPhoto(file, file.type || "image/jpeg");
    } catch (e) {
      console.error("[readPhoto]", e);
      return { error: "Tsy nety ny fampiraisana sary. Andramo indray." };
    }
  }
  return { photo };
}

type CategoryInput = { error: string } | { name: string; photo: string };

async function readCategoryForm(formData: FormData, current = ""): Promise<CategoryInput> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Soraty ny anaran'ny sokajy." };
  const photo = await readPhoto(formData, current);
  return "error" in photo ? photo : { name, photo: photo.photo };
}

async function dropPhoto(photo: string | undefined) {
  await deletePhoto(photo);
}

const refresh = () => {
  revalidatePath("/", "layout");
};

export async function createCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const data = await readCategoryForm(formData);
  if ("error" in data) return { ok: false, message: data.error };
  try {
    await prisma.category.create({ data });
  } catch (e) {
    console.error("[createCategory]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  refresh();
  return { ok: true, message: `Voasoratra ny sokajy "${data.name}".` };
}

export async function updateCategory(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const current = await prisma.category.findUnique({ where: { id } });
  if (!current) return { ok: false, message: "Tsy hita ny sokajy." };
  const data = await readCategoryForm(formData, current.photo);
  if ("error" in data) return { ok: false, message: data.error };
  try {
    await prisma.category.update({ where: { id }, data });
  } catch (e) {
    console.error("[updateCategory]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  if (data.photo !== current.photo) await dropPhoto(current.photo);
  refresh();
  return { ok: true, message: "Voatahiry." };
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  const removed = await prisma.category.delete({ where: { id } }).catch(() => null);
  await dropPhoto(removed?.photo);
  refresh();
}

// ---------- CRUD Fady ----------

export async function createFady(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Soraty ny fady." };
  try {
    await prisma.fady.create({ data: { name } });
  } catch (e) {
    console.error("[createFady]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  refresh();
  return { ok: true, message: `Voasoratra ny fady "${name}".` };
}

export async function updateFady(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { ok: false, message: "Soraty ny fady." };
  try {
    await prisma.fady.update({ where: { id }, data: { name } });
  } catch (e) {
    console.error("[updateFady]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  refresh();
  return { ok: true, message: "Voatahiry." };
}

export async function deleteFady(id: number): Promise<FormState> {
  await requireAdmin();
  try {
    await prisma.fady.delete({ where: { id } });
  } catch (e) {
    console.error("[deleteFady]", e);
    return { ok: false, message: "Tsy nety ny famafana." };
  }
  refresh();
  return { ok: true, message: "Voafafa." };
}

// ---------- CRUD Laoka ----------

type FoodInput = { error: string } | { name: string; description: string; categoryId: number | null; rating: number; heart: boolean; photo: string };

async function readFoodForm(formData: FormData, current = ""): Promise<FoodInput> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Soraty ny anaran'ny laoka." };
  const photo = await readPhoto(formData, current);
  if ("error" in photo) return photo;
  return {
    name,
    description: String(formData.get("description") ?? "").trim(),
    categoryId: Number(formData.get("categoryId")) || null,
    rating: Math.max(0, Math.min(5, Math.round(Number(formData.get("rating")) || 0))),
    heart: formData.get("heart") === "on",
    photo: photo.photo,
  };
}

export async function createFood(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const data = await readFoodForm(formData);
  if ("error" in data) return { ok: false, message: data.error };
  try {
    await prisma.food.create({ data });
  } catch (e) {
    console.error("[createFood]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  refresh();
  return { ok: true, message: `Voasoratra ny laoka "${data.name}".` };
}

export async function updateFood(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  await requireUser();
  const current = await prisma.food.findUnique({ where: { id } });
  if (!current) return { ok: false, message: "Tsy hita ny laoka." };
  const data = await readFoodForm(formData, current.photo);
  if ("error" in data) return { ok: false, message: data.error };
  try {
    await prisma.food.update({ where: { id }, data });
  } catch (e) {
    console.error("[updateFood]", e);
    return { ok: false, message: "Tsy nety ny firaketana. Jereo ny DATABASE_URL." };
  }
  if (data.photo !== current.photo) await dropPhoto(current.photo);
  refresh();
  return { ok: true, message: "Voatahiry." };
}

export async function removeFood(id: number) {
  await requireAdmin();
  const removed = await prisma.food.delete({ where: { id } }).catch(() => null);
  await dropPhoto(removed?.photo);
  refresh();
}

// ---------- CRUD Mpampiasa ----------

const adminCount = () => prisma.user.count({ where: { role: "admin" } });

export async function createUser(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : "user";
  if (!name || !email.includes("@")) return { ok: false, message: "Fenoy ny anarana sy ny mailaka marina." };
  if (password.length < 8) return { ok: false, message: "8 litera farafahakeliny ny teny miafina." };
  const dup = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (dup) return { ok: false, message: "Efa misy mampiasa io mailaka io." };
  await prisma.user.create({ data: { name, email, role, passwordHash: await hashPassword(password) } });
  refresh();
  return { ok: true, message: `Voasoratra i ${name}.` };
}

export async function updateUser(id: number, _prev: FormState, formData: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return { ok: false, message: "Tsy hita ny mpampiasa." };

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = formData.get("role") === "admin" ? "admin" : "user";
  if (!name || !email.includes("@")) return { ok: false, message: "Fenoy ny anarana sy ny mailaka marina." };
  if (password && password.length < 8) return { ok: false, message: "8 litera farafahakeliny ny teny miafina." };
  const dup = await prisma.user.findFirst({ where: { email, NOT: { id } }, select: { id: true } });
  if (dup) return { ok: false, message: "Efa misy mampiasa io mailaka io." };
  if (target.role === "admin" && role !== "admin") {
    if (me.id === id) return { ok: false, message: "Tsy azonao esorina ny alalana admin-nao manokana." };
    if ((await adminCount()) <= 1) return { ok: false, message: "Tsy maintsy misy admin iray farafahakeliny." };
  }

  await prisma.user.update({
    where: { id },
    data: { name, email, role, ...(password ? { passwordHash: await hashPassword(password) } : {}) },
  });
  refresh();
  return { ok: true, message: "Voatahiry." };
}

export async function deleteUser(id: number): Promise<FormState> {
  const me = await requireAdmin();
  if (me.id === id) return { ok: false, message: "Tsy azonao fafana ny kaonty anananao." };
  const target = await prisma.user.findUnique({ where: { id } });
  if (target?.role === "admin" && (await adminCount()) <= 1)
    return { ok: false, message: "Tsy maintsy misy admin iray farafahakeliny." };
  await prisma.user.deleteMany({ where: { id } });
  refresh();
  return { ok: true, message: "Voafafa." };
}
