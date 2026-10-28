"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { Photo } from "@/components/photo";
import { Pagination } from "./pagination";

const PAGE_SIZE = 8;

export type CategoryTile = { id: number; name: string; photo: string; foodCount: number };

export function CategoryGrid({ categories }: { categories: CategoryTile[] }) {
  const [page, setPage] = useState(1);
  const top = useRef<HTMLDivElement>(null);

  const pageCount = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const shown = categories.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  function goTo(n: number) {
    setPage(n);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div ref={top} className="scroll-mt-24 space-y-6">
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map((c, i) => (
          <li key={c.id} className="rise" style={{ animationDelay: `${i * 40}ms` }}>
            <Link
              href={`/?sokajy=${c.id}`}
              className="group relative block aspect-square overflow-hidden rounded-3xl bg-paper shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {c.photo && (
                <Photo
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
                <p className="text-sm text-rice/75">{c.foodCount} laoka</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <Pagination page={current} pageCount={pageCount} onChange={goTo} />
    </div>
  );
}
