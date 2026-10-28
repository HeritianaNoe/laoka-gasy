import { createHmac, randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users, type User } from "@/db/schema";

const scrypt = promisify(scryptCb) as (pw: string, salt: Buffer, len: number) => Promise<Buffer>;

const COOKIE = "laoka_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 andro

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET tsy mbola voafaritra (farafahakeliny 16 litera).");
  return s;
}

const sign = (value: string) => createHmac("sha256", secret()).update(value).digest("hex");

export function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, keyHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !keyHex) return false;
  const key = await scrypt(password, Buffer.from(saltHex, "hex"), 64);
  return safeEqual(key.toString("hex"), keyHex);
}

export async function createSession(userId: number) {
  const body = `${userId}.${Date.now() + MAX_AGE * 1000}`;
  (await cookies()).set(COOKIE, `${body}.${sign(body)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  (await cookies()).delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  const [id, exp, sig] = token.split(".");
  if (!id || !exp || !sig || !safeEqual(sig, sign(`${id}.${exp}`)) || Number(exp) < Date.now()) return null;
  const [user] = await db.select().from(users).where(eq(users.id, Number(id)));
  return user ?? null;
}

// Mpampiasa rehetra miditra (admin na user): afaka mijery sy mamorona/manova ao amin'ny dashboard.
// Antsoina isaky ny pejy SY isaky ny action: ny UI irery tsy ampy fiarovana.
export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/miditra");
  return user;
}

// Admin ihany: famafana (laoka, sokajy, fady) sy fitantanana mpampiasa.
export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin");
  return user;
}
