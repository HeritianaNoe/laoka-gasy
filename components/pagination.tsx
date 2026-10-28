"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

// 1 … 4 5 6 … 12  (page voalohany, farany ary ireo manodidina ny pejy ankehitriny)
function pageItems(page: number, pageCount: number): (number | "gap-start" | "gap-end")[] {
  const keep = new Set([1, pageCount, page - 1, page, page + 1]);
  const pages = [...keep].filter((n) => n >= 1 && n <= pageCount).sort((a, b) => a - b);
  const items: (number | "gap-start" | "gap-end")[] = [];
  pages.forEach((n, i) => {
    if (i > 0 && n - pages[i - 1] > 1) items.push(i === 1 ? "gap-start" : "gap-end");
    items.push(n);
  });
  return items;
}

export function Pagination({
  page,
  pageCount,
  onChange,
}: {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
}) {
  if (pageCount <= 1) return null;

  const btn =
    "grid h-10 min-w-10 place-items-center rounded-full border px-3 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav aria-label="Pejy" className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Pejy teo aloha"
        className={`${btn} border-ink/15 bg-white/50 text-ink/75 hover:border-ravitoto/50`}
      >
        <ChevronLeft className="size-4" />
      </button>

      {pageItems(page, pageCount).map((item) =>
        typeof item === "number" ? (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            aria-label={`Pejy ${item}`}
            className={`${btn} ${
              item === page
                ? "border-ravitoto bg-ravitoto text-rice"
                : "border-ink/15 bg-white/50 text-ink/75 hover:border-ravitoto/50"
            }`}
          >
            {item}
          </button>
        ) : (
          <span key={item} aria-hidden className="px-1 text-muted">
            …
          </span>
        ),
      )}

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pageCount}
        aria-label="Pejy manaraka"
        className={`${btn} border-ink/15 bg-white/50 text-ink/75 hover:border-ravitoto/50`}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
