import { Photo } from "@/components/photo";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Ban } from "lucide-react";
import { HeartButton, StarRating } from "@/components/rating";
import { getCategories, getFadyList, getFood, matchFady } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FoodPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const food = Number(id) ? await getFood(Number(id)) : undefined;
  if (!food) notFound();

  const [categories, fadyList] = await Promise.all([getCategories(), getFadyList()]);
  const category = categories.find((c) => c.id === food.categoryId);
  const fadyMatches = matchFady(food, fadyList.map((f) => f.name));

  return (
    <article className="pt-6">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted hover:text-ink">
        <ArrowLeft className="size-4" /> Hiverina amin'ny lisitra
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-paper shadow-xl shadow-ink/10">
          {food.photo && (
            <Photo src={food.photo} alt={food.name} fill priority sizes="(min-width: 1024px) 640px, 100vw" className="object-cover" />
          )}
          <HeartButton id={food.id} heart={food.heart} className="absolute top-4 right-4 size-12" />
        </div>

        <div className="rise space-y-5">
          {category && (
            <Link
              href={`/?sokajy=${category.id}`}
              className="text-sm font-semibold tracking-[0.25em] text-ravitoto-light uppercase hover:text-ravitoto"
            >
              {category.name}
            </Link>
          )}
          <h1 className="font-display text-4xl leading-tight font-semibold sm:text-5xl">{food.name}</h1>
          {fadyMatches.length > 0 && (
            <p className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-1.5 text-sm text-rice">
              <Ban className="size-4" /> Misy fady: {fadyMatches.join(", ")}
            </p>
          )}
          <p className="text-lg leading-relaxed whitespace-pre-line text-ink/80">{food.description}</p>
          <div className="flex items-center gap-3 rounded-2xl border border-ink/10 bg-white/60 p-4">
            <span className="text-sm font-medium text-muted">Naoty:</span>
            <StarRating id={food.id} rating={food.rating} size="lg" />
          </div>
        </div>
      </div>
    </article>
  );
}
