"use client";

import { useState, useTransition } from "react";
import { Ban, Plus } from "lucide-react";
import type { Fady } from "@prisma/client";
import { addFady } from "@/lib/actions";

export function FadyManager({ list }: { list: Fady[] }) {
  const [draft, setDraft] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          startTransition(async () => {
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
              <span className="flex-1 text-lg font-medium">{f.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
