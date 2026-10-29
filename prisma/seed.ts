import { PrismaClient } from "@prisma/client";
import { randomBytes, scrypt } from "node:crypto";
import { promisify } from "node:util";

const prisma = new PrismaClient();

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString("hex");
  const derived = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${salt}:${derived.toString("hex")}`;
}

const categories = [
  { id: 1, name: "Henakisoa", photo: "/img/laisoa.png" },
  { id: 2, name: "Henomby", photo: "/img/henomby.png" },
  { id: 3, name: "Vorona", photo: "/img/vorona.png" },
  { id: 4, name: "Akoho", photo: "/img/akoho.png" },
  { id: 5, name: "Hazandrano", photo: "/img/hazandrano.png" },
  { id: 6, name: "Ondry", photo: "/img/henomby.png" },
  { id: 7, name: "Sosisy", photo: "/img/tsaramaso.png" },
  { id: 8, name: "Hafa", photo: "/img/ravitoto.png" },
];

const foods = [
  { name: "Henakisoa ravitoto", description: "Ravina mangahazo totoina nandrahoina tamin'ny henakisoa matavy. Laoka malaza indrindra eto Madagasikara, tsara arahina vary fotsy.", photo: "/img/ravitoto.png", heart: true, rating: 5, categoryId: 1 },
  { name: "Henakisoa laisoa", description: "Henakisoa nendasina kely dia nampifangaroina tamin'ny laisoa voatetika. Tsotra, haingana ary matsiro.", photo: "/img/laisoa.png", heart: true, rating: 4, categoryId: 1 },
  { name: "Henomby ritra", description: "Henomby norarahina tsikelikely mandra-paharitry ny ron-katsiny, misy voatabia sy tongolo.", photo: "/img/henomby.png", heart: false, rating: 4, categoryId: 2 },
  { name: "Vorona ritra", description: "Ganagana na vorontsiloza nendasina tamin'ny sakamalao sy tongolo gasy mandra-pahamenany.", photo: "/img/vorona.png", heart: true, rating: 4, categoryId: 3 },
  { name: "Akoho sy sakamalao", description: "Akoho gasy nandrahoina tamin'ny sakamalao, tongolo gasy ary voatabia. Matsiro sy mamerovero.", photo: "/img/akoho.png", heart: false, rating: 3, categoryId: 4 },
  { name: "Hazandrano endasina", description: "Tilapia nendasina manontolo, arahina saosy voatabia sy ravin-kazo maitso.", photo: "/img/hazandrano.png", heart: false, rating: 3, categoryId: 5 },
  { name: "Tsaramaso sy henakisoa", description: "Tsaramaso fotsy nandrahoina tamin'ny henakisoa nifohina sy saosy voatabia.", photo: "/img/tsaramaso.png", heart: true, rating: 5, categoryId: 1 },
  { name: "Henomby sy ravitoto", description: "Henomby kitoza na henomby matavy nampiarahina tamin'ny ravitoto.", photo: "/img/ravitoto.png", heart: false, rating: 2, categoryId: 2 },
];

async function main() {
  // Sokajy: tsy mamerina raha efa misy
  if ((await prisma.category.count()) === 0) {
    await prisma.category.createMany({ data: categories });
    // Ataon'ny Postgres ny serial: ampifanaraho amin'ny id farany
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"categories"', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "categories"))`;
    console.log("Sokajy 8 noforonina.");
  } else {
    console.log("Efa misy sokajy — tsy noforonina indray.");
  }

  // Fady "Osy"
  if (!(await prisma.fady.findFirst({ where: { name: "Osy" } }))) {
    await prisma.fady.create({ data: { name: "Osy" } });
    console.log("Fady 'Osy' noforonina.");
  }

  // Mpampiasa admin default (miditra amin'ny email)
  const name = "Heritiana";
  const email = "rasolomananaheritiana@gmail.com";  
  const password = "zakaranda";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("User 'admin' efa misy — tsy noforonina indray.");
  } else {
    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, passwordHash, role: "admin" },
    });
    console.log("User par défaut noforonina:", user.name, "(id:", user.id + ")");
    console.log("  email: " + email);
    console.log("  password: " + password);
  }

  // Laoka: tsy mamerina raha efa misy
  if ((await prisma.food.count()) === 0) {
    await prisma.food.createMany({ data: foods });
    console.log("Laoka 8 noforonina.");
  } else {
    console.log("Efa misy laoka — tsy noforonina indray.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
