"use client";

import { Photo } from "@/components/photo";
import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Dices, Search } from "lucide-react";
import type { Category, Food } from "@prisma/client";
import { Pagination } from "./pagination";
import { HeartButton, StarRating } from "./rating";

const PAGE_SIZE = 9;

export type FoodWithFady = Food & { fadyMatches: string[] };

export function FoodBrowser({
  foods,
  categories,
  activeCategory,
}: {
  foods: FoodWithFady[];
  categories: Category[];
  activeCategory?: number;
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [hideFady, setHideFady] = useState(true);
  const [onlyHearts, setOnlyHearts] = useState(false);
  const [page, setPage] = useState(1);
  const [prevCategory, setPrevCategory] = useState(activeCategory);
  const top = useRef<HTMLElement>(null);

  // Miverina amin'ny pejy 1 rehefa miova sokajy
  if (prevCategory !== activeCategory) {
    setPrevCategory(activeCategory);
    setPage(1);
  }

  // Laoka mifanaraka amin'ny fikarohana sy ny "tiako" (alohan'ny fanafenana ny fady)
  const matching = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods.filter(
      (f) =>
        (!q || f.name.toLowerCase().includes(q) || f.description.toLowerCase().includes(q)) &&
        (!onlyHearts || f.heart),
    );
  }, [foods, query, onlyHearts]);

  // Isan'ny fady ao anatin'ireo: io ihany no miova rehefa avela na afenina ny fady
  const fadyCount = useMemo(() => matching.filter((f) => f.fadyMatches.length > 0).length, [matching]);
  const visible = useMemo(
    () => (hideFady ? matching.filter((f) => f.fadyMatches.length === 0) : matching),
    [matching, hideFady],
  );

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const pageFoods = visible.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goTo(n: number) {
    setPage(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const categoryName = (id: number | null) => categories.find((c) => c.id === id)?.name;

  function pickRandom() {
    if (visible.length === 0) return;
    const f = visible[Math.floor(Math.random() * visible.length)];
    router.push(`/laoka/${f.id}`);
  }

  return (
    <section ref={top} className="scroll-mt-24 space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Hikaroka laoka… (ravitoto, akoho…)"
            className="h-12 w-full rounded-full border border-ink/15 bg-white/70 pr-4 pl-12 text-base outline-none placeholder:text-muted/70 focus:border-clay focus:ring-4 focus:ring-clay/15"
          />
        </label>
        <button
          type="button"
          onClick={pickRandom}
          disabled={visible.length === 0}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-clay px-5 font-medium text-rice shadow-lg shadow-clay/25 transition hover:bg-clay-dark disabled:opacity-40"
        >
          <Dices className="size-5" /> Safidio ho ahy
        </button>
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        <Chip href="/" active={!activeCategory}>Rehetra</Chip>
        {categories.map((c) => (
          <Chip key={c.id} href={`/?sokajy=${c.id}`} active={activeCategory === c.id}>
            {c.name}
          </Chip>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
        <Toggle
          checked={onlyHearts}
          onChange={(v) => {
            setOnlyHearts(v);
            setPage(1);
          }}
        >Ireo tiako ihany</Toggle>
        <Toggle
          checked={hideFady}
          onChange={(v) => {
            setHideFady(v);
            setPage(1);
          }}
        >
          Afeno ny fady {fadyCount > 0 && <span className="text-clay">({fadyCount})</span>}
        </Toggle>
        <span className="ml-auto text-right">
          {visible.length} laoka
          {hideFady && fadyCount > 0 && <span className="text-clay"> · {fadyCount} afenina (fady)</span>}
        </span>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-ink/20 bg-white/40 px-6 py-16 text-center">
          <p className="font-display text-2xl">Tsy misy laoka hita</p>
          <p className="mt-2 text-muted">
            Andramo teny hafa, na{" "}
            <Link href="/hampiditra" className="font-medium text-clay underline underline-offset-4">
              ampidiro laoka vaovao
            </Link>
            .
          </p>
        </div>
      ) : (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {pageFoods.map((food, i) => (
            <li key={food.id} className="rise" style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}>
              <Link
                href={`/laoka/${food.id}`}
                className="group block overflow-hidden rounded-3xl border border-ink/10 bg-white/70 shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-ink/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-paper">
                  {food.photo && (
                    <Photo
                      src={food.photo}
                      alt={food.name}
                      fill
                      sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  <HeartButton id={food.id} heart={food.heart} className="absolute top-3 right-3" />
                  {food.fadyMatches.length > 0 && (
                    <span className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-rice">
                      <Ban className="size-3.5" /> Fady: {food.fadyMatches.join(", ")}
                    </span>
                  )}
                </div>
                <div className="space-y-2 p-5">
                  {categoryName(food.categoryId) && (
                    <p className="text-xs font-semibold tracking-[0.18em] text-ravitoto-light uppercase">
                      {categoryName(food.categoryId)}
                    </p>
                  )}
                  <h3 className="font-display text-xl leading-tight font-semibold">{food.name}</h3>
                  <p className="line-clamp-2 text-sm text-muted">{food.description}</p>
                  <StarRating id={food.id} rating={food.rating} />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <Pagination page={current} pageCount={pageCount} onChange={goTo} />
    </section>
  );
}

function Chip({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      scroll={false}
      className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition ${
        active ? "border-ravitoto bg-ravitoto text-rice" : "border-ink/15 bg-white/50 text-ink/75 hover:border-ravitoto/50"
      }`}
    >
      {children}
    </Link>
  );
}

function Toggle({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-2 select-none">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
      <span className="relative h-5 w-9 rounded-full bg-ink/20 transition peer-checked:bg-ravitoto after:absolute after:top-0.5 after:left-0.5 after:size-4 after:rounded-full after:bg-white after:transition peer-checked:after:translate-x-4" />
      {children}
    </label>
  );
}
