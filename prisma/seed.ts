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
  { id: 1, name: "Henakisoa", photo: "/img/laisoa.jpg" },
  { id: 2, name: "Henomby", photo: "/img/henomby.jpg" },
  { id: 3, name: "Vorona", photo: "/img/vorona.jpg" },
  { id: 4, name: "Akoho", photo: "/img/akoho.jpg" },
  { id: 5, name: "Hazandrano", photo: "/img/hazandrano.jpg" },
  { id: 6, name: "Ondry", photo: "/img/henomby.png" },
  { id: 7, name: "Sosisy", photo: "/img/tsaramaso.jpg" },
  { id: 8, name: "Hafa", photo: "/img/ravitoto.jpg" },
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

const fadies = [
  { name: "Osy" },
  { name: "Henakisoa" },
  { name: "Henomby" },
  { name: "Vorona" },
  { name: "Akoho" },
  { name: "Hazandrano" },
  { name: "Tsaramaso" },
  { name: "Sakamalao" },
  { name: "Ravitoto" },
  { name: "Laisoa" },
];

const foodswithfadies = [
  // 1. Henakisoa ravitoto -> Fady Henakisoa (2) & Ravitoto (9)
  { id_food: 1, id_fady: 2 },
  { id_food: 1, id_fady: 9 },

  // 2. Henakisoa laisoa -> Fady Henakisoa (2) & Laisoa (10)
  { id_food: 2, id_fady: 2 },
  { id_food: 2, id_fady: 10 },

  // 3. Henomby ritra -> Fady Henomby (3)
  { id_food: 3, id_fady: 3 },

  // 4. Vorona ritra -> Fady Vorona (4)
  { id_food: 4, id_fady: 4 },

  // 5. Akoho sy sakamalao -> Fady Akoho (5) & Sakamalao (8)
  { id_food: 5, id_fady: 5 },
  { id_food: 5, id_fady: 8 },

  // 6. Hazandrano endasina -> Fady Hazandrano (6)
  { id_food: 6, id_fady: 6 },

  // 7. Tsaramaso sy henakisoa -> Fady Henakisoa (2) & Tsaramaso (7)
  { id_food: 7, id_fady: 2 },
  { id_food: 7, id_fady: 7 },

  // 8. Henomby sy ravitoto -> Fady Henomby (3) & Ravitoto (9)
  { id_food: 8, id_fady: 3 },
  { id_food: 8, id_fady: 9 },
];

async function main() {
  // Sokajy: tsy mamerina raha efa misy
  if ((await prisma.category.count()) === 0) {
    await prisma.category.createMany({ data: categories });
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"categories"', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "categories"))`;
    console.log("Sokajy 8 noforonina.");
  } else {
    console.log("Efa misy sokajy — tsy noforonina indray.");
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

  if ((await prisma.food.count()) === 0) {
    await prisma.food.createMany({ data: foods });
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"foods"', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "foods"))`;
    console.log("Laoka 8 noforonina.");
  } else {
    console.log("Efa misy laoka — tsy noforonina indray.");
  }

  if ((await prisma.fady.count()) === 0) {
    await prisma.fady.createMany({ data: fadies });
    await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"fady"', 'id'), (SELECT COALESCE(MAX("id"), 1) FROM "fady"))`;
    console.log("Fady 10 noforonina.");
  } else {
    console.log("Efa misy fady — tsy noforonina indray.");
  }
  
  if ((await prisma.foodswithfady.count()) === 0) {
    await prisma.foodswithfady.createMany({ data: foodswithfadies });
    console.log("foodswithfadies 10 noforonina.");
  } else {
    console.log("Efa misy foodswithfadies — tsy noforonina indray.");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
