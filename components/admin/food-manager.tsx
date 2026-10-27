"use client";

import { useActionState, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { Heart, Loader2, Pencil, Plus, Search, Star, Trash2, X } from "lucide-react";
import { createFood, removeFood, updateFood, type FormState } from "@/lib/admin-actions";
import { field, IconBtn, primaryBtn, Status, Thumb } from "./ui";

type Food = {
  id: number;
  name: string;
  description: string;
  photo: string;
  heart: boolean;
  rating: number;
  categoryId: number | null;
  categoryName: string | null;
};
type Cat = { id: number; name: string };

function FoodForm({
  action,
  categories,
  initial,
  submitLabel,
  onDone,
  resetOnSuccess,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  categories: Cat[];
  initial?: Food;
  submitLabel: string;
  onDone?: () => void;
  resetOnSuccess?: boolean;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(action, null);
  const [tooBig, setTooBig] = useState(false);

  useEffect(() => {
    if (!state?.ok) return;
    if (resetOnSuccess) ref.current?.reset();
    onDone?.();
  }, [state, resetOnSuccess, onDone]);

  return (
    <form ref={ref} action={formAction} className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Anaran'ny laoka</span>
        <input name="name" required defaultValue={initial?.name} className={field} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Sokajy</span>
        <select name="categoryId" defaultValue={initial?.categoryId ?? ""} className={field}>
          <option value="">Tsy misy sokajy</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-medium">Fanazavana</span>
        <textarea name="description" rows={3} defaultValue={initial?.description} className={field} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Sary (upload)</span>
        <input
          name="photo"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const big = (e.target.files?.[0]?.size ?? 0) > 3 * 1024 * 1024;
            setTooBig(big);
            if (big) e.target.value = "";
          }}
          className={`${field} file:mr-3 file:rounded-full file:border-0 file:bg-paper file:px-3 file:py-1 file:text-sm`}
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">na lalan'ny sary efa misy</span>
        <input name="photoPath" placeholder="/img/ravitoto.png" defaultValue={initial?.photo} className={field} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Naoty</span>
        <select name="rating" defaultValue={initial?.rating ?? 0} className={field}>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n} / 5
            </option>
          ))}
        </select>
      </label>
      <label className="flex items-center gap-2 self-end pb-2.5">
        <input type="checkbox" name="heart" defaultChecked={initial?.heart} className="size-5 accent-clay" />
        <span className="text-sm font-medium">Tiana indrindra</span>
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button type="submit" disabled={pending} className={primaryBtn}>
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} {submitLabel}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="h-11 rounded-full px-4 font-medium text-muted hover:text-ink">
            Aoka ihany
          </button>
        )}
        {tooBig && <p className="text-sm font-medium text-clay">Lehibe loatra ny sary (3 MB ny fetra).</p>}
        <Status state={state} />
      </div>
    </form>
  );
}

function FoodRow({ food, categories }: { food: Food; categories: Cat[] }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="bg-paper/60 px-5 py-5">
        <FoodForm
          action={updateFood.bind(null, food.id)}
          categories={categories}
          initial={food}
          submitLabel="Tahirizo"
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`flex items-center gap-4 px-5 py-3.5 ${pending ? "opacity-50" : ""}`}>
      <Thumb src={food.photo} name={food.name} />
      <div className="min-w-0 flex-1">
        <p className="flex items-center gap-2 truncate font-display text-xl font-semibold">
          {food.name}
          {food.heart && <Heart className="size-4 shrink-0 fill-clay text-clay" aria-label="Tiana indrindra" />}
        </p>
        <p className="flex items-center gap-1 text-sm text-muted">
          {food.categoryName ?? "Tsy misy sokajy"} · <Star className="size-3.5 fill-sakay text-sakay" /> {food.rating}/5
        </p>
      </div>
      <IconBtn label={`Ovay ${food.name}`} onClick={() => setEditing(true)}>
        <Pencil className="size-4" />
      </IconBtn>
      <IconBtn
        label={`Fafao ${food.name}`}
        danger
        disabled={pending}
        onClick={() => {
          if (confirm(`Tena hofafana marina ve ny laoka "${food.name}"?`)) startTransition(() => removeFood(food.id));
        }}
      >
        <Trash2 className="size-4" />
      </IconBtn>
    </li>
  );
}

export function FoodManager({ foods, categories }: { foods: Food[]; categories: Cat[] }) {
  const [adding, setAdding] = useState(false);
  const [q, setQ] = useState("");
  const shown = useMemo(() => foods.filter((f) => f.name.toLowerCase().includes(q.trim().toLowerCase())), [foods, q]);

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-2xl font-semibold">Laoka ({foods.length})</h2>
        <div className="flex items-center gap-3">
          <label className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Hikaroka…"
              aria-label="Hikaroka laoka"
              className="h-11 rounded-full border border-ink/15 bg-white/70 pr-4 pl-9 outline-none focus:border-clay focus:ring-4 focus:ring-clay/15"
            />
          </label>
          <button
            type="button"
            onClick={() => setAdding((v) => !v)}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-clay px-5 font-medium text-rice transition hover:bg-clay-dark"
          >
            {adding ? <X className="size-4" /> : <Plus className="size-4" />} {adding ? "Akatona" : "Laoka vaovao"}
          </button>
        </div>
      </div>

      {adding && (
        <div className="rounded-3xl border border-ink/10 bg-white/60 p-5">
          <FoodForm action={createFood} categories={categories} submitLabel="Ampio" resetOnSuccess />
        </div>
      )}

      {shown.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ink/20 px-6 py-12 text-center text-muted">
          {foods.length === 0 ? "Tsy mbola misy laoka." : "Tsy nahita laoka mifanaraka."}
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white/60">
          {shown.map((f) => (
            <FoodRow key={f.id} food={f} categories={categories} />
          ))}
        </ul>
      )}
    </section>
  );
}
