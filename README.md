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
- **PostgreSQL** amin'ny alalan'i **Drizzle ORM** + `pg` (`DATABASE_URL`)
- Fanamarinana: cookie session sonia (HMAC) + teny miafina `scrypt`
- Sary: lasa *data URL* ao anaty base de données (tsy mila serivisy ivelany). Zaraina kely ao amin'ny browser alohan'ny hampiakarana.

## Fepetra ilaina

- **Node.js 20** na vaovao kokoa
- **PostgreSQL** (toerana ety an-toerana, na [Neon](https://neon.tech), Supabase, Railway, Vercel Postgres…)

## Fametrahana sy fampandehanana (local)

1. **Alaivo ny code** ary apetraho ny fiankinan-doha:

   ```bash
   cd laoka-gasy
   npm install
   ```

2. **Mamorona ny `.env.local`** avy amin'ny modely:

   ```bash
   cp .env.example .env.local
   ```

   Ovay ireo sanda:

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

   *Safidy hafa:* alefaso ao amin'ny DB ny rakitra SQL ao amin'ny `drizzle/` (`0000_init.sql`).

4. **Ampidiro ny angona voalohany** (sokajy 8, laoka 8, fady "Osy") — tsy ataon'ny `db:push` ity:

   ```bash
   psql "$DATABASE_URL" -f drizzle/0001_seed.sql
   ```

5. **Alefaso ny app:**

   ```bash
   npm run dev
   ```

   - App: <http://localhost:3000>
   - Dashboard: <http://localhost:3000/admin/miditra>

### Fidirana admin voalohany

Tsy mila mamorona admin amin'ny tanana. Rehefa tsy mbola misy admin ao amin'ny DB, ny fidirana voalohany amin'ny `ADMIN_EMAIL` + `ADMIN_PASSWORD` avy ao amin'ny `.env.local` dia mamorona ny kaonty admin ho azy. Avy eo, ao amin'ny tab **Mpampiasa** no ahafahana mamorona admin na `user` hafa (8 litera farafahakeliny ny teny miafina).

## Script npm

| Baiko | Asa |
| --- | --- |
| `npm run dev` | Mandefa ny dev server |
| `npm run build` | Manamboatra ho an'ny production |
| `npm run start` | Mandefa ny build production |
| `npm run db:push` | Manosika ny schema mankany amin'ny DB (prototype) |
| `npm run db:generate` | Mamorona fifindra-monina SQL vaovao avy amin'ny `db/schema.ts` |
| `npm run db:migrate` | Mampihatra ny fifindra-monina |
| `npm run db:studio` | Mamoha Drizzle Studio hijerena ny angona |

Rehefa manova ny `db/schema.ts`:

```bash
npx drizzle-kit generate --name famaritana-ny-fiovana
npx drizzle-kit push        # prototype
# na
npx drizzle-kit migrate
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
  data.ts               Query famakiana
  actions.ts            Server Actions public (fo, kintana, hampiditra laoka, fady)
  admin-actions.ts      Server Actions dashboard (CRUD + fidirana)
  auth.ts               Session cookie + scrypt + requireUser/requireAdmin
  storage.ts            Sary → data URL
db/                     Schema Drizzle + fifandraisana `pg`
drizzle/                SQL: 0000_init.sql, 0001_seed.sql
public/img/             Sary fampiasaina amin'ny seed
```

## Deploy (Vercel / Netlify / Railway / Node host rehetra)

1. Ampifandraiso ny repo.
2. Apetraho ao amin'ny tontolon'ny host ireo **sanda 4** (`DATABASE_URL`, `SESSION_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
3. Baiko build: `npm run build`.
4. Aorian'ny deploy voalohany, alefaso indray mandeha amin'ny DB production ny tabilao (sy ny seed raha tianao):

   ```bash
   DATABASE_URL="url-production" npm run db:push
   psql "url-production" -f drizzle/0001_seed.sql
   ```

## Mpamorona

© RASOLOMANANA Heritiana Noe. Zo rehetra voatokana.
