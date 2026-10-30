// Utilitaires communs aux Server Actions (ce fichier n'est PAS un "use server").
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { toDataUrl } from "@/lib/storage";

export type FormState = { ok: boolean; message: string } | null;

export const ok = (message: string): FormState => ({ ok: true, message });
export const fail = (message: string): FormState => ({ ok: false, message });

/** Champ texte d'un formulaire, trimé ("" si absent). */
export const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

export const refresh = () => revalidatePath("/", "layout");

// ---------- Erreurs Prisma → message utilisateur ----------

type Messages = { duplicate?: string; notFound?: string };

export function describeError(e: unknown, msg: Messages = {}): string {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2002" && msg.duplicate) return msg.duplicate; // contrainte unique
    if (e.code === "P2025" && msg.notFound) return msg.notFound; // enregistrement introuvable
  }
  console.error("[action]", e);
  return "Tsy nety ny firaketana. Jereo ny DATABASE_URL.";
}

/**
 * Exécute une écriture, rafraîchit les pages et renvoie le FormState.
 * ⚠ Ne jamais y appeler redirect() : il lève une exception qui serait avalée ici.
 */
export async function attempt(success: string, work: () => Promise<unknown>, msg?: Messages): Promise<FormState> {
  try {
    await work();
  } catch (e) {
    return fail(describeError(e, msg));
  }
  refresh();
  return ok(success);
}

// ---------- Photo (champ fichier + chemin existant) ----------

const MAX_PHOTO = 3 * 1024 * 1024;

/**
 * `photo` undefined = rien de nouveau (→ valeur inchangée à la mise à jour).
 * `allowPath: false` pour les formulaires publics : on n'accepte qu'un vrai fichier.
 */
export async function readPhoto(fd: FormData, { allowPath = true } = {}): Promise<{ error: string } | { photo?: string }> {
  const file = fd.get("photo");
  if (file instanceof File && file.size > 0) {
    if (!file.type.startsWith("image/")) return { error: "Sary ihany no azo ampidirina." };
    if (file.size > MAX_PHOTO) return { error: "Lehibe loatra ny sary (3 MB ny fetra)." };
    try {
      return { photo: await toDataUrl(file) };
    } catch (e) {
      console.error("[readPhoto]", e);
      return { error: "Tsy nety ny fampiraisana sary. Andramo indray." };
    }
  }
  return { photo: allowPath ? text(fd, "photoPath") || undefined : undefined };
}

// ---------- Validation utilisateur (inscription + admin) ----------

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateUser(
  { name, email, password }: { name: string; email: string; password: string },
  { passwordOptional = false } = {},
): string | null {
  if (name.length < 2 || name.length > 60) return "Soraty ny anarana (2 hatramin'ny 60 litera).";
  if (!EMAIL.test(email) || email.length > 120) return "Mailaka tsy marina.";
  if ((password || !passwordOptional) && password.length < 8) return "8 litera farafahakeliny ny teny miafina.";
  return null;
}
