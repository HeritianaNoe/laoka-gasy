"use server";

import { requireAdmin } from "@/lib/auth";
import * as fadyService from "@/lib/services/fady";
import { attempt, fail, refresh, text, type FormState } from "./shared";

// Public (page /fady)
export async function addFady(name: string) {
  const value = name.trim();
  if (!value) return;
  await fadyService.createFady(value);
  refresh();
}

// Dashboard (admin ihany)
export async function createFady(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = text(fd, "name");
  if (!name) return fail("Soraty ny fady.");
  return attempt(`Voasoratra ny fady "${name}".`, () => fadyService.createFady(name));
}

export async function updateFady(id: number, _prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const name = text(fd, "name");
  if (!name) return fail("Soraty ny fady.");
  return attempt("Voatahiry.", () => fadyService.updateFady(id, name), { notFound: "Tsy hita ny fady." });
}

export async function deleteFady(id: number): Promise<FormState> {
  await requireAdmin();
  return attempt("Voafafa.", () => fadyService.deleteFady(id));
}
