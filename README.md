# Laoka

Laoka is a web app for keeping track of Malagasy dishes (*laoka*). It is the Next.js version of the original Android app (Java, Room, Fragments). You can browse dishes by category, mark favourites, rate them with stars, add new dishes with a photo, and keep a list of *fady* (food taboos). Dishes that contain a fady are flagged and hidden automatically.

## Screens

| Route | Screen | Android equivalent |
| --- | --- | --- |
| `/` | Dish list with search, category filters, favourites, star ratings, fady filter and a "Safidio ho ahy" random pick | `HomeFragment` + `HomeAdapter` + `RatingFragment` |
| `/laoka/[id]` | Dish details: rate, favourite, delete | `SubHomeFragment` |
| `/sokajy` | Category grid | `CategoryFragment` |
| `/hampiditra` | Add a dish with a photo | `UpdateFragment` |
| `/fady` | Add, edit and delete fady | `FadyFragment` + `UpdateFadyFragment` |
| `/momba` | About and share | `AboutFragment` |

## Tech

- **Next.js 16** (App Router, Server Components, Server Actions) with **Tailwind CSS v4**
- **Netlify Database** (managed Postgres) via **Drizzle ORM**, replacing Room/SQLite
- **Netlify Blobs** for uploaded dish photos, replacing local file storage
- **Netlify Image CDN** (through `next/image`) for resized, optimized images

## Running locally

```bash
npm install
netlify dev
```

`netlify dev` gives the app local versions of Netlify Database, Blobs and the Image CDN.

## Database

The schema is in `db/schema.ts`. Migrations are in `netlify/database/migrations/` and are applied automatically when the site deploys. The seed migration loads the same categories, dishes and the "Osy" fady as the original app. After changing the schema, run:

```bash
npx drizzle-kit generate --name <describe_change>
```
