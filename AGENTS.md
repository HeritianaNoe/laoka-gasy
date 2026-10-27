# AGENTS.md

## What this is
Laoka is a Next.js 16 (App Router) port of an Android app written in Java (Room + Fragments) for cataloguing Malagasy dishes. The UI text is in **Malagasy** and new copy should stay in Malagasy.

## Architecture
- `app/`: routes. Pages are Server Components that read from the DB (`export const dynamic = "force-dynamic"`).
  - `/` home list (`?sokajy=<id>` filters by category), `/laoka/[id]` details, `/sokajy` categories, `/hampiditra` add dish, `/fady` taboos, `/momba` about.
  - `app/api/photos/[key]/route.ts` serves uploaded photos from Netlify Blobs.
- `components/`: client components (`"use client"`): nav, food browser (search and filters run on the client), rating/heart (`useOptimistic`), add form, fady manager.
- `lib/data.ts`: read queries (these replace the Room DAOs and repositories) plus `matchFady()`.
- `lib/actions.ts`: Server Actions for every mutation. Each one calls `revalidatePath("/", "layout")`.
- `db/schema.ts`: Drizzle schema (`categories`, `foods`, `fady`). `db/index.ts`: client (`drizzle-orm/netlify-db`, no connection string needed).
- `netlify/database/migrations/`: generated migrations plus a custom seed migration. Never edit a migration that has already been applied. Add a new one with `npx drizzle-kit generate --name ...`.

## Conventions and decisions
- `drizzle-orm` and `drizzle-kit` must stay on the `@beta` dist-tag, because that is the only line with the Netlify adapter.
- `foods.photo` holds either a static path (`/img/*.png`, generated seed art in `public/img`) or `/api/photos/<blobKey>` for uploads (Blobs store `laoka-photos`).
- Photos are downscaled in the browser before upload (`resizeImage` in `add-food-form.tsx`). The Server Action body limit is 4 MB (`next.config.ts`).
- Images go through `next/image`, which uses the Netlify Image CDN on Netlify.
- A dish is "fady" when its name or description contains a fady word (case-insensitive substring match).
- Theme tokens (colors, fonts) live in `app/globals.css` under `@theme`.
