"use server";

import { redirect } from "next/navigation";
import { createSession, destroySession } from "@/lib/auth";
import * as userService from "@/lib/services/users";
import { describeError, fail, text, validateUser, type FormState } from "./shared";

export async function login(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  const user = email && password ? await userService.authenticate(email, password) : null;
  if (!user) return fail("Diso ny mailaka na ny teny miafina.");

  await createSession(user.id);
  redirect("/admin");
}

// Inscription publique : le rôle est TOUJOURS "user" (jamais choisi par le formulaire)
export async function register(_prev: FormState, fd: FormData): Promise<FormState> {
  const name = text(fd, "name");
  const email = text(fd, "email").toLowerCase();
  const password = String(fd.get("password") ?? "");

  const error =
    validateUser({ name, email, password }) ??
    (password !== String(fd.get("confirm") ?? "") ? "Tsy mitovy ny teny miafina roa." : null);
  if (error) return fail(error);

  let userId: number;
  try {
    userId = (await userService.createUser({ name, email, password, role: "user" })).id;
  } catch (e) {
    return fail(
      describeError(e, { duplicate: "Efa misy mampiasa io mailaka io. Midira fa tsy misoratra anarana." }),
    );
  }

  await createSession(userId);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/miditra");
}
