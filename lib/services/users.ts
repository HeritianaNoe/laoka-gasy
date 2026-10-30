import { hashPassword, safeEqual, verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

type Role = "admin" | "user";
type UserData = { name: string; email: string; role: Role; password: string };

export const findUserById = (id: number) => prisma.user.findUnique({ where: { id } });

export async function listUsers() {
  const rows = await prisma.user.findMany({
    orderBy: { id: "asc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });
  // En base le rôle est un texte libre ; l'UI ne connaît que "admin" | "user"
  return rows.map((u) => ({ ...u, role: (u.role === "admin" ? "admin" : "user") as Role }));
}

export async function createUser({ password, ...data }: UserData) {
  return prisma.user.create({ data: { ...data, passwordHash: await hashPassword(password) } });
}

/** `password` vide → mot de passe inchangé. */
export async function updateUser(id: number, { password, ...data }: Omit<UserData, "password"> & { password?: string }) {
  return prisma.user.update({
    where: { id },
    data: { ...data, ...(password && { passwordHash: await hashPassword(password) }) },
  });
}

export const deleteUser = (id: number) => prisma.user.deleteMany({ where: { id } });

/** Premier admin : créé depuis ADMIN_EMAIL / ADMIN_PASSWORD tant qu'aucun admin n'existe. */
async function ensureFirstAdmin(email: string, password: string) {
  const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envEmail || !envPassword || !safeEqual(email, envEmail) || !safeEqual(password, envPassword)) return;
  if ((await prisma.user.count({ where: { role: "admin" } })) > 0) return;
  await createUser({ name: "Heritiana", email, role: "admin", password }).catch((e) =>
    console.error("[users] création du premier admin", e),
  );
}

/** Retourne l'utilisateur si email + mot de passe sont corrects, sinon null. */
export async function authenticate(email: string, password: string) {
  await ensureFirstAdmin(email, password);
  const user = await prisma.user.findUnique({ where: { email } });
  return user && (await verifyPassword(password, user.passwordHash)) ? user : null;
}
