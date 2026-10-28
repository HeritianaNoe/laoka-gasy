# Laoka Gasy 🍲

**Laoka** dia web app hitahirizana sy handaminana ny **laoka gasy** tianao: ravitoto, henomby ritra, akoho sy sakamalao… Azonao atao ny mikaroka, manisy kintana, mariho ho tiana, ary avela hisafidy ho anao ny app rehefa tsy fantatrao izay hohanina. Misy lisitry ny **fady** (zavatra tsy hohanina) ihany koa mba hafenina ho azy ny laoka misy azy.

Port amin'ny **Next.js** ny app Android taloha (Java + Room). Ny fiteny rehetra ao amin'ny UI dia **Malagasy**.

## Ny azo atao

### Ho an'ny daholobe (tsy mila miditra)

| Pejy | Làlana | Inona no ao |
| --- | --- | --- |
| Laoka | `/` | Lisitry ny laoka, fikarohana, sivana ara-sokajy, "Ireo tiako ihany", "Afeno ny fady", bokotra **Safidio ho ahy** (laoka kisendrasendra). 9 isaky ny pejy. |
| Antsipirian'ny laoka | `/laoka/[id]` | Sary, fanazavana, sokajy, fady voamarika, naoty (kintana) ary fo (tiana). |
| Sokajy | `/sokajy` | Karazana laoka rehetra miaraka amin'ny isan'ny laoka ao aminy. 8 isaky ny pejy. |
| Hampiditra | `/hampiditra` | Mampiditra laoka vaovao (anarana, fanazavana, sokajy, sary). |
| Fady | `/fady` | Mampiditra ny zavatra fady aminao na amin'ny fianakavianao. |
| Momba | `/momba` | Momba ny app. |

> Ny laoka dia lasa "fady" raha ao amin'ny **anarany** na ny **fanazavany** ny teny fady (tsy mijery lakilen'ny litera lehibe/kely, ary mifanaraka na dia ao anatin'ny teny hafa aza: ohatra "Kisoa" ao amin'ny "Henakisoa").
> Eo amin'ny lisitra, ny isa "N afenina (fady)" dia mampiseho ny laoka afenina noho ny fady, ka mitovy amin'ny total ao amin'ny dashboard ny fitambarana.

### Dashboard (`/admin`)

Fidirana: `/admin/miditra`. Tab: **Sokajy**, **Laoka**, **Fady**, **Mpampiasa**. 10 isaky ny pejy ny lisitra laoka sy sokajy.

| Alalana | `admin` | `user` |
| --- | :---: | :---: |
| Miditra ao amin'ny dashboard | ✅ | ✅ |
| Mijery, mampiditra, manova laoka / sokajy / fady | ✅ | ✅ |
| Mamafa laoka / sokajy / fady | ✅ | ❌ (disabled ny icon delete) |
| Mijery ny tab **Mpampiasa** sy mitantana mpampiasa | ✅ | ❌ |

Voaaro ao amin'ny server ihany koa ireo fepetra ireo (`requireUser()` / `requireAdmin()` ao amin'ny `lib/auth.ts`), tsy ny UI irery.

## Teknolojia

- **Next.js 15** (App Router, Server Components, Server Actions) + **React 19**
- **Tailwind CSS v4**, icônes **lucide-react**
- **PostgreSQL** amin'ny alalan'i **Prisma ORM** (`DATABASE_URL`)
- Fanamarinana: cookie session sonia (HMAC) + teny miafina `scrypt`
- Sary: lasa *data URL* ao anaty base de données (tsy mila serivisy ivelany). Zaraina kely ao amin'ny browser alohan'ny hampiakarana.

## Fepetra ilaina

- **Node.js 20** na vaovao kokoa
- **PostgreSQL** (toerana ety an-toerana, na [Neon](https://neon.tech), Supabase, Railway, Vercel Postgres…)

## Fametrahana sy fampandehanana (local)

1. **Alaivo ny code** ary apetraho ny fiankinan-doha:

   ```bash
   git clone <url-ny-repo>
   cd laoka-gasy
   npm install
   ```

2. **Mamorona ny `.env`** avy amin'ny modely:

   ```bash
   cp .env.example .env
   ```

   Ovay ireo sanda (ao amin'ny `.env` no ilain'ny Prisma CLI hamaky azy):

   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/laoka_gasy"
   SESSION_SECRET="litera-kisendrasendra-lava-farafahakeliny-16"
   ADMIN_EMAIL="ianao@example.com"
   ADMIN_PASSWORD="teny-miafina-voalohany"
   ```

3. **Forony ny base de données** (ohatra `laoka_gasy`) ary **forony ny tabilao**:

   ```bash
   createdb laoka_gasy        # na amin'ny pgAdmin / psql
   npm run db:push
   ```

4. **Ampidiro ny angona voalohany** (sokajy 8, laoka 8, fady "Osy") — tsy ataon'ny `db:push` ity:

   ```bash
   npm run db:seed
   ```

5. **Alefaso ny app:**

   ```bash
   npm run dev
   ```

   - App: <http://localhost:3000>
   - Dashboard: <http://localhost:3000/admin/miditra>

### Fidirana admin voalohany

Tsy mila mamorona admin amin'ny tanana. Rehefa tsy mbola misy admin ao amin'ny DB, ny fidirana voalohany amin'ny `ADMIN_EMAIL` + `ADMIN_PASSWORD` ao amin'ny `.env` dia mamorona ny kaonty admin ho azy. Avy eo, ao amin'ny tab **Mpampiasa** no ahafahana mamorona admin na `user` hafa (8 litera farafahakeliny ny teny miafina).

## Script npm

| Baiko | Asa |
| --- | --- |
| `npm run dev` | Mandefa ny dev server |
| `npm run build` | `db push` + `prisma generate` + `next build` (ho an'ny production) |
| `npm run start` | Mandefa ny build production |
| `npm run db:push` | Manosika ny `prisma/schema.prisma` mankany amin'ny DB |
| `npm run db:seed` | Mampiditra ny angona voalohany (sokajy, laoka, fady) |
| `npm run db:studio` | Mamoha Prisma Studio hijerena ny angona |

Rehefa manova ny `prisma/schema.prisma`:

```bash
npm run db:push
npx prisma generate
```

## Firafitry ny tetikasa

```
app/                    Làlana (Server Components, force-dynamic)
  page.tsx              Lisitry ny laoka (/ ?sokajy=<id>)
  laoka/[id]/           Antsipirian'ny laoka
  sokajy/               Sokajy (pagination 8)
  hampiditra/           Mampiditra laoka
  fady/  momba/
  admin/miditra/        Fidirana dashboard
  admin/(panel)/        Dashboard: sokajy, laoka, fady, mpampiasa
components/             Component client (nav, food-browser, pagination, form, admin/*)
lib/
  prisma.ts             PrismaClient (mitady ny URL PostgreSQL ho azy)
  data.ts               Query famakiana
  actions.ts            Server Actions public (fo, kintana, hampiditra laoka, fady)
  admin-actions.ts      Server Actions dashboard (CRUD + fidirana)
  auth.ts               Session cookie + scrypt + requireUser/requireAdmin
  storage.ts            Sary → data URL
prisma/                 schema.prisma + seed.ts
scripts/                db-env.mjs, db-push.mjs (alefa ao anaty `npm run build`)
public/img/             Sary fampiasaina amin'ny seed
```

## Deploy (Vercel / Netlify / Railway / Node host rehetra)

1. Ampifandraiso ny repo.
2. Apetraho ao amin'ny tontolon'ny host ireo **sanda 4** (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
3. Baiko build: `npm run build` (mamorona/manavao ny tabilao ho azy amin'ny `prisma db push`, dia `prisma generate`, dia `next build`).
4. Raha tianao ny angona voalohany, alefaso indray mandeha amin'ny DB production:

   ```bash
   DATABASE_URL="url-production" npm run db:seed
   ```

## Fiarovana sy fanamarihana

- **Aza alefa any GitHub ny `.env`.** Voasivana ao amin'ny `.gitignore` izy (ary `.env*` rehetra afa-tsy `.env.example`). Ao amin'ny `.env.example` dia sanda modely ihany no apetraka, tsy sekreta tena izy.
- Ovay ny `ADMIN_PASSWORD` aorian'ny fidirana voalohany, ary ampiasao ny `SESSION_SECRET` lava sy tsy azo vinavinaina. Ilaina ao amin'ny production ny `SESSION_SECRET`, raha tsy izany dia hanary hadisoana ny fanamarinana.
- Sary: fetra **3 MB** ao amin'ny dashboard (4 MB ny fetran'ny Server Action).
- Tsy misy package manokana ho an'ny Netlify na API manokana: azo alefa na aiza na aiza.

## Mpamorona

© RASOLOMANANA Heritiana Noe. Zo rehetra voatokana.
