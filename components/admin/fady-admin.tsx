"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Ban, Check, Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Fady } from "@prisma/client";
import { createFady, deleteFady, updateFady } from "@/lib/admin-actions";
import { Pagination } from "@/components/pagination";
import { field, IconBtn, primaryBtn, Status } from "./ui";

const PAGE_SIZE = 10;

function FadyRow({ item }: { item: Fady }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const [state, formAction, saving] = useActionState(updateFady.bind(null, item.id), null);

  useEffect(() => {
    if (state?.ok) setEditing(false);
  }, [state]);

  if (editing) {
    return (
      <li className="bg-paper/60 px-5 py-3.5">
        <form action={formAction} className="flex flex-wrap items-center gap-2">
          <input
            name="name"
            required
            autoFocus
            defaultValue={item.name}
            aria-label="Anaran'ny fady"
            onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
            className={`${field} min-w-0 flex-1`}
          />
          <button
            type="submit"
            disabled={saving}
            aria-label="Tahirizo"
            title="Tahirizo"
            className="grid size-9 place-items-center rounded-full text-ravitoto transition hover:bg-paper disabled:opacity-40"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
          </button>
          <IconBtn label="Aoka ihany" onClick={() => setEditing(false)}>
            <X className="size-4" />
          </IconBtn>
          <Status state={state} />
        </form>
      </li>
    );
  }

  return (
    <li className={`flex items-center gap-3 px-5 py-3.5 ${pending ? "opacity-50" : ""}`}>
      <Ban className="size-5 shrink-0 text-clay" />
      <span className="flex-1 text-lg font-medium">{item.name}</span>
      <IconBtn label={`Ovay ${item.name}`} onClick={() => setEditing(true)}>
        <Pencil className="size-4" />
      </IconBtn>
      <IconBtn
        label={`Fafao ${item.name}`}
        danger
        disabled={pending}
        onClick={() => {
          if (!confirm(`Tena hofafana marina ve ny fady "${item.name}"?`)) return;
          startTransition(async () => {
            const r = await deleteFady(item.id);
            if (!r?.ok) alert(r?.message);
          });
        }}
      >
        <Trash2 className="size-4" />
      </IconBtn>
    </li>
  );
}

export function FadyAdmin({ list }: { list: Fady[] }) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, formAction, pending] = useActionState(createFady, null);
  const [page, setPage] = useState(1);
  const pageCount = Math.max(1, Math.ceil(list.length / PAGE_SIZE));
  const current = Math.min(page, pageCount); // raha voafafa ny fady farany amin'ny pejy farany
  const shown = list.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);

  return (
    <section className="space-y-4">
      <h2 className="font-display text-2xl font-semibold">Fady ({list.length})</h2>

      <div className="rounded-3xl border border-ink/10 bg-white/60 p-5">
        <form ref={ref} action={formAction} className="flex flex-wrap items-center gap-3">
          <input
            name="name"
            required
            placeholder="ohatra: Osy, Kisoa, Trondro…"
            aria-label="Anaran'ny fady"
            className={`${field} min-w-0 flex-1`}
          />
          <button type="submit" disabled={pending} className={primaryBtn}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />} Ampio
          </button>
          <Status state={state} />
        </form>
      </div>

      {list.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ink/20 px-6 py-12 text-center text-muted">
          Tsy mbola misy fady voasoratra.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white/60">
          {shown.map((f) => (
            <FadyRow key={f.id} item={f} />
          ))}
        </ul>
      )}

      <Pagination page={current} pageCount={pageCount} onChange={setPage} />
    </section>
  );
}
