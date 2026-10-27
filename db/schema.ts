import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// Sokajy (categories): Henakisoa, Henomby, Akoho...
export const categories = pgTable("categories", {
  id: serial().primaryKey(),
  name: text().notNull(),
  photo: text().notNull().default(""),
});

// Laoka (dishes)
export const foods = pgTable("foods", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().notNull().default(""),
  // Either a static asset path ("/img/ravitoto.png") or an uploaded photo ("/api/photos/<key>")
  photo: text().notNull().default(""),
  heart: boolean().notNull().default(false),
  rating: integer().notNull().default(0),
  categoryId: integer("category_id").references(() => categories.id, { onDelete: "set null" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fady (food taboos): ingredients the household does not eat
export const fady = pgTable("fady", {
  id: serial().primaryKey(),
  name: text().notNull(),
});

// Users: "admin" can manage everything from /admin, "user" is reserved for later
export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: text({ enum: ["admin", "user"] }).notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type Food = typeof foods.$inferSelect;
export type Fady = typeof fady.$inferSelect;
export type User = typeof users.$inferSelect;
