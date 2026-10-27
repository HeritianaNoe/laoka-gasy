"use client";

import { useState, useTransition } from "react";
import { Ban, Check, Pencil, Plus, Trash2, X } from "lucide-react";
import type { Fady } from "@/db/schema";
import { addFady, deleteFady, updateFady } from "@/lib/actions";

export function FadyManager({ list }: { list: Fady[] }) {
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<{ id: number; name: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const run = (fn: () => Promise<void>) => startTransition(fn);

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          run(async () => {
            await addFady(draft);
            setDraft("");
          });
        }}
        className="flex gap-2"
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="ohatra: Osy, Kisoa, Trondro…"
          className="h-12 flex-1 rounded-full border border-ink/15 bg-white/70 px-5 outline-none focus:border-clay focus:ring-4 focus:ring-clay/15"
        />
        <button
          type="submit"
          disabled={pending || !draft.trim()}
          className="inline-flex h-12 items-center gap-2 rounded-full bg-ravitoto px-5 font-medium text-rice transition hover:bg-ravitoto-light disabled:opacity-50"
        >
          <Plus className="size-5" /> Ampio
        </button>
      </form>

      {list.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-ink/20 px-6 py-12 text-center text-muted">
          Tsy mbola misy fady voasoratra.
        </p>
      ) : (
        <ul className="divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white/60">
          {list.map((f) => (
            <li key={f.id} className="flex items-center gap-3 px-5 py-3.5">
              <Ban className="size-5 shrink-0 text-clay" />
              {editing?.id === f.id ? (
                <form
                  className="flex flex-1 items-center gap-2"
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!editing.name.trim()) return;
                    run(async () => {
                      await updateFady(f.id, editing.name);
                      setEditing(null);
                    });
                  }}
                >
                  <input
                    autoFocus
                    value={editing.name}
                    onChange={(e) => setEditing({ id: f.id, name: e.target.value })}
                    onKeyDown={(e) => e.key === "Escape" && setEditing(null)}
                    className="h-10 flex-1 rounded-xl border border-clay/40 bg-white px-3 outline-none focus:ring-4 focus:ring-clay/15"
                  />
                  <IconButton label="Tahirizo" type="submit"><Check className="size-4" /></IconButton>
                  <IconButton label="Aoka ihany" onClick={() => setEditing(null)}><X className="size-4" /></IconButton>
                </form>
              ) : (
                <>
                  <span className="flex-1 text-lg font-medium">{f.name}</span>
                  <IconButton label="Ovay" onClick={() => setEditing({ id: f.id, name: f.name })}>
                    <Pencil className="size-4" />
                  </IconButton>
                  <IconButton
                    label="Fafao"
                    danger
                    onClick={() => {
                      if (confirm(`Fampitandremana! Tena hofafana marina ve ny "${f.name}"?`)) run(() => deleteFady(f.id));
                    }}
                  >
                    <Trash2 className="size-4" />
                  </IconButton>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function IconButton({
  label,
  danger,
  type = "button",
  onClick,
  children,
}: {
  label: string;
  danger?: boolean;
  type?: "button" | "submit";
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full text-ink/60 transition hover:bg-paper ${danger ? "hover:text-clay" : "hover:text-ink"}`}
    >
      {children}
    </button>
  );
}
