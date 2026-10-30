"use server";

import { requireAdmin, requireUser } from "@/lib/auth";
import * as categoryService from "@/lib/services/categories";
import { attempt, fail, readPhoto, refresh, text, type FormState } from "./shared";

async function readCategoryForm(fd: FormData) {
  const name = text(fd, "name");
  if (!name) return { error: "Soraty ny anaran'ny sokajy." };
  const upload = await readPhoto(fd);
  return "error" in upload ? upload : { data: { name, photo: upload.photo } };
}

export async function createCategory(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser();
  const form = await readCategoryForm(fd);
  if ("error" in form) return fail(form.error);
  return attempt(`Voasoratra ny sokajy "${form.data.name}".`, () => categoryService.createCategory(form.data));
}

export async function updateCategory(id: number, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireUser();
  const form = await readCategoryForm(fd);
  if ("error" in form) return fail(form.error);
  return attempt("Voatahiry.", () => categoryService.updateCategory(id, form.data), { notFound: "Tsy hita ny sokajy." });
}

export async function deleteCategory(id: number) {
  await requireAdmin();
  await categoryService.deleteCategory(id);
  refresh();
}
