import Image from "next/image";
import Link from "next/link";
import { getCategories, getFoods } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const [categories, foods] = await Promise.all([getCategories(), getFoods()]);
  const count = (id: number) => foods.filter((f) => f.categoryId === id).length;

  return (
    <div className="space-y-8 pt-10">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Sokajy</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Karazana laoka</h1>
        <p className="mt-3 text-lg text-muted">Safidio ny sokajy iray hahitana ireo laoka ao aminy.</p>
      </header>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <li key={c.id} className="rise" style={{ animationDelay: `${i * 40}ms` }}>
            <Link
              href={`/?sokajy=${c.id}`}
              className="group relative block aspect-square overflow-hidden rounded-3xl bg-paper shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {c.photo && (
                <Image
                  src={c.photo}
                  alt={c.name}
                  fill
                  sizes="(min-width: 1024px) 280px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-rice">
                <h2 className="font-display text-2xl font-semibold">{c.name}</h2>
                <p className="text-sm text-rice/75">{count(c.id)} laoka</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
