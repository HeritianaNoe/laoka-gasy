"use server";

import { requireAdmin, requireUser } from "@/lib/auth";
import { normalizeIds } from "@/lib/ids";
import * as foodService from "@/lib/services/foods";
import { attempt, fail, readPhoto, refresh, text, type FormState } from "./shared";

// ---------- Public ----------

export async function toggleHeart(id: number, heart: boolean) {
  await foodService.setHeart(id, heart);
  refresh();
}

export async function setRating(id: number, rating: number) {
  await foodService.setRating(id, rating);
  refresh();
}

export async function addFood(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  const description = text(fd, "description");
  if (!name || !description) return fail("Fenoy tsara daholo azafady!");

  const upload = await readPhoto(fd, { allowPath: false });
  if ("error" in upload) return fail(upload.error);
  if (!upload.photo) return fail("Asio sary azafady!");

  return attempt("Voatahiry ny laoka nampidirinao!", () =>
    foodService.createFood({ name, description, photo: upload.photo, categoryId: Number(fd.get("categoryId")) || null }),
  );
}

// ---------- Dashboard ----------

/** Champs du formulaire admin → données + IDs des fady cochés (champ `fady` répété). */
async function readFoodForm(fd: FormData) {
  const name = text(fd, "name");
  if (!name) return { error: "Soraty ny anaran'ny laoka." };
  const upload = await readPhoto(fd);
  if ("error" in upload) return upload;
  return {
    data: {
      name,
      description: text(fd, "description"),
      categoryId: Number(fd.get("categoryId")) || null,
      rating: foodService.clampRating(fd.get("rating")),
      heart: fd.get("heart") === "on",
      photo: upload.photo,
    },
    fadyIds: normalizeIds(fd.getAll("fady").map(Number)),
  };
}

export async function createFood(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser();
  const form = await readFoodForm(fd);
  if ("error" in form) return fail(form.error);
  return attempt(`Voasoratra ny laoka "${form.data.name}".`, () => foodService.createFood(form.data, form.fadyIds));
}

export async function updateFood(id: number, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser();
  const form = await readFoodForm(fd);
  if ("error" in form) return fail(form.error);
  return attempt("Voatahiry.", () => foodService.updateFood(id, form.data, form.fadyIds), {
    notFound: "Tsy hita ny laoka.",
  });
}

export async function removeFood(id: number) {
  await requireAdmin();
  await foodService.deleteFood(id);
  refresh();
}
