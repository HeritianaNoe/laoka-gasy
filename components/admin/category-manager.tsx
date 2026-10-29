"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { CheckCircle2, Loader2, Pencil, Plus, Trash2, TriangleAlert, X } from "lucide-react";
import { createCategory, deleteCategory, updateCategory, type FormState } from "@/lib/admin-actions";
import { Pagination } from "@/components/pagination";

type Row = { id: number; name: string; photo: string; foodCount: number };

const PAGE_SIZE = 10;

const field =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-base outline-none focus:border-clay focus:ring-4 focus:ring-clay/15";

function Thumb({ src, name }: { src: string; name: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} className="size-14 shrink-0 rounded-xl object-cover" />
  ) : (
    <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-paper text-xs text-muted">Sary</div>
  );
}

function CategoryForm({
  action,
  initial,
  submitLabel,
  onDone,
  resetOnSuccess,
}: {
  action: (prev: FormState, fd: FormData) => Promise<FormState>;
  initial?: Row;
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
        <span className="text-sm font-medium">Anaran'ny sokajy</span>
        <input name="name" required defaultValue={initial?.name} className={field} />
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
      <label className="space-y-1.5 sm:col-span-2">
        <span className="text-sm font-medium">na lalan'ny sary efa misy</span>
        <input name="photoPath" placeholder="/img/ravitoto.jpg" defaultValue={initial?.photo} className={field} />
      </label>
      <div className="flex flex-wrap items-center gap-3 sm:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-ravitoto px-5 font-medium text-rice transition hover:bg-ravitoto-light disabled:opacity-60"
        >
          {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} {submitLabel}
        </button>
        {onDone && (
          <button type="button" onClick={onDone} className="h-11 rounded-full px-4 font-medium text-muted hover:text-ink">
            Aoka ihany
          </button>
        )}
        {tooBig && <p className="text-sm font-medium text-clay">Lehibe loatra ny sary (3 MB ny fetra).</p>}
        {state && (
          <p role="status" className={`flex items-center gap-1.5 text-sm font-medium ${state.ok ? "text-ravitoto" : "text-clay"}`}>
            {state.ok ? <CheckCircle2 className="size-4" /> : <TriangleAlert className="size-4" />} {state.message}
          </p>
        )}
      </div>
    </form>
  );
}

function CategoryRow({ row, canDelete }: { row: Row; canDelete: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="bg-paper/60 px-5 py-5">
        <CategoryForm
          action={updateCategory.bind(null, row.id)}
          initial={row}
          submitLabel="Tahirizo"
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  return (
    <li className={`flex items-center gap-4 px-5 py-3.5 ${pending ? "opacity-50" : ""}`}>
      <Thumb src={row.photo} name={row.name} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-xl font-semibold">{row.name}</p>
        <p className="text-sm text-muted">
          {row.foodCount} laoka · #{row.id}
        </p>
      </div>
      <button
        type="button"
        aria-label={`Ovay ${row.name}`}
        title="Ovay"
        onClick={() => setEditing(true)}
        className="grid size-9 place-items-center rounded-full text-ink/60 transition hover:bg-paper hover:text-ink"
      >
        <Pencil className="size-4" />
      </button>
      <button
        type="button"
        aria-label={`Fafao ${row.name}`}
        title={canDelete ? "Fafao" : "Admin ihany no afaka mamafa"}
        disabled={pending || !canDelete}
        onClick={() => {
          if (!canDelete) return;
          const note = row.foodCount ? `\n${row.foodCount} laoka no tsy hanana sokajy intsony.` : "";
          if (confirm(`Tena hofafana marina ve ny sokajy "${row.name}"?${note}`)) startTransition(() => deleteCategory(row.id));
        }}
        className="grid size-9 place-items-center rounded-full text-ink/60 transition hover:bg-paper hover:text-clay disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-ink/60"
      >
        <Trash2 className="size-4" />
      </button>
    </li>
  );
}

export function CategoryManager({ categories, canDelete }: { categories: Row[]; canDelete: boolean }) {
  const [adding, setAdding] = useState(false);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(categories.length / PAGE_SIZE));
  const current = Math.min(page, pageCount); // raha voafafa ny sokajy farany amin'ny pejy farany
  const shown = categories.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Sokajy ({categories.length})</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-clay px-5 font-medium text-rice transition hover:bg-clay-dark"
        >
          {adding ? <X className="size-4" /> : <Plus className="size-4" />} {adding ? "Akatona" : "Sokajy vaovao"}
        </button>
      </div>

      {adding && (
        <div className="rounded-3xl border border-ink/10 bg-white/60 p-5">
          <CategoryForm action={createCategory} submitLabel="Ampio" resetOnSuccess />
        </div>
      )}

      {categories.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ink/20 px-6 py-12 text-center text-muted">
          Tsy mbola misy sokajy.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white/60">
          {shown.map((c) => (
            <CategoryRow key={c.id} row={c} canDelete={canDelete} />
          ))}
        </ul>
      )}

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
