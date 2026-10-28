CREATE TABLE IF NOT EXISTS "categories" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"photo" text DEFAULT '' NOT NULL
);

CREATE TABLE IF NOT EXISTS "fady" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL
);

CREATE TABLE IF NOT EXISTS "foods" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"photo" text DEFAULT '' NOT NULL,
	"heart" boolean DEFAULT false NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"category_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL
);

ALTER TABLE "foods" DROP CONSTRAINT IF EXISTS "foods_category_id_categories_id_fkey";
ALTER TABLE "foods" ADD CONSTRAINT "foods_category_id_categories_id_fkey"
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE SET NULL;

CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL UNIQUE,
	"password_hash" text NOT NULL,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
