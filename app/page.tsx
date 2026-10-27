import Image from "next/image";
import { FoodBrowser } from "@/components/food-browser";
import { getCategories, getFadyList, getFoods, matchFady } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: { searchParams: Promise<{ sokajy?: string }> }) {
  const { sokajy } = await searchParams;
  const categoryId = Number(sokajy) || undefined;
  const [foods, categories, fadyList] = await Promise.all([getFoods(categoryId), getCategories(), getFadyList()]);
  const fadyNames = fadyList.map((f) => f.name);
  const active = categories.find((c) => c.id === categoryId);

  return (
    <div className="space-y-10 pt-6">
      <section className="relative overflow-hidden rounded-[2rem] bg-ravitoto text-rice">
        <Image
          src="/img/hero.png"
          alt="Latabatra feno laoka gasy"
          fill
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ravitoto via-ravitoto/80 to-transparent" />
        <div className="relative max-w-xl px-6 py-14 sm:px-10 sm:py-20">
          <p className="rise text-sm font-semibold tracking-[0.25em] text-sakay uppercase">
            {active ? `Sokajy · ${active.name}` : "Lisitry ny laoka"}
          </p>
          <h1 className="rise mt-3 font-display text-4xl leading-[1.05] font-semibold sm:text-6xl" style={{ animationDelay: "80ms" }}>
            Inona no laoka <em className="text-sakay">anio</em>?
          </h1>
          <p className="rise mt-4 text-lg text-rice/85" style={{ animationDelay: "160ms" }}>
            Tahirio ireo laoka tianao, omeo kintana, ary avelao ny Laoka hisafidy ho anao — tsy misy fady.
          </p>
        </div>
      </section>

      <FoodBrowser
        foods={foods.map((f) => ({ ...f, fadyMatches: matchFady(f, fadyNames) }))}
        categories={categories}
        activeCategory={categoryId}
      />
    </div>
  );
}
