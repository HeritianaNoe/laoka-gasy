"use server";

import { requireAdmin } from "@/lib/auth";
import * as userService from "@/lib/services/users";
import { attempt, fail, text, validateUser, type FormState } from "./shared";

const DUPLICATE = "Efa misy mampiasa io mailaka io.";

function readUserForm(fd: FormData) {
  return {
    name: text(fd, "name"),
    email: text(fd, "email").toLowerCase(),
    password: String(fd.get("password") ?? ""),
    role: fd.get("role") === "admin" ? ("admin" as const) : ("user" as const),
  };
}

export async function createUser(_prev: FormState, fd: FormData): Promise<FormState> {
  await requireAdmin();
  const data = readUserForm(fd);
  const error = validateUser(data);
  if (error) return fail(error);
  return attempt(`Voasoratra i ${data.name}.`, () => userService.createUser(data), { duplicate: DUPLICATE });
}

export async function updateUser(id: number, _prev: FormState, fd: FormData): Promise<FormState> {
  const me = await requireAdmin();
  const data = readUserForm(fd);
  const error = validateUser(data, { passwordOptional: true });
  if (error) return fail(error);
  // `me` est admin : tant qu'on ne se rétrograde pas soi-même, il reste au moins un admin.
  if (me.id === id && data.role !== "admin") return fail("Tsy azonao esorina ny alalana admin-nao manokana.");
  return attempt("Voatahiry.", () => userService.updateUser(id, data), {
    duplicate: DUPLICATE,
    notFound: "Tsy hita ny mpampiasa.",
  });
}

export async function deleteUser(id: number): Promise<FormState> {
  const me = await requireAdmin();
  if (me.id === id) return fail("Tsy azonao fafana ny kaonty anananao.");
  return attempt("Voafafa.", () => userService.deleteUser(id));
}
