"use client";

import { useOptimistic, useTransition } from "react";
import { Heart, Star } from "lucide-react";
import { setRating, toggleHeart } from "@/lib/actions";

export function StarRating({ id, rating, size = "sm" }: { id: number; rating: number; size?: "sm" | "lg" }) {
  const [value, setValue] = useOptimistic(rating);
  const [, startTransition] = useTransition();
  const cls = size === "lg" ? "size-7" : "size-4";

  return (
    <div className="flex items-center gap-0.5" role="radiogroup" aria-label="Naoty">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} kintana`}
          onClick={(e) => {
            e.preventDefault();
            // Tapping the current rating again clears it, like the "-" button in the old dialog
            const next = value === n ? n - 1 : n;
            startTransition(async () => {
              setValue(next);
              await setRating(id, next);
            });
          }}
          className="p-0.5 transition hover:scale-125"
        >
          <Star className={`${cls} ${n <= value ? "fill-sakay text-sakay" : "text-ink/25"}`} />
        </button>
      ))}
    </div>
  );
}

export function HeartButton({ id, heart, className = "" }: { id: number; heart: boolean; className?: string }) {
  const [value, setValue] = useOptimistic(heart);
  const [, startTransition] = useTransition();

  return (
    <button
      type="button"
      aria-pressed={value}
      aria-label={value ? "Esory amin'ny tiana" : "Ataovy tiana"}
      onClick={(e) => {
        e.preventDefault();
        startTransition(async () => {
          setValue(!value);
          await toggleHeart(id, !value);
        });
      }}
      className={`grid size-10 place-items-center rounded-full bg-rice/90 shadow-md backdrop-blur transition hover:scale-110 ${className}`}
    >
      <Heart className={`size-5 transition ${value ? "fill-clay text-clay" : "text-ink/60"}`} />
    </button>
  );
}
