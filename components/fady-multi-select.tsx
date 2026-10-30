"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";

export type FadyOption = { id: number; name: string };

type Props = {
  options: FadyOption[];
  /** Mode contrôlé : IDs sélectionnés. Si omis, le composant gère son propre état. */
  value?: number[];
  defaultValue?: number[];
  /** Appelé à chaque changement avec la liste complète des IDs sélectionnés. */
  onChange?: (ids: number[]) => void;
  placeholder?: string;
  className?: string;
};

export function FadyMultiSelect({
  options,
  value,
  defaultValue = [],
  onChange,
  placeholder = "Safidio ny fady…",
  className = "",
}: Props) {
  const [inner, setInner] = useState<number[]>(defaultValue);
  const selected = value ?? inner;
  const selectedSet = useMemo(() => new Set(selected), [selected]);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  function commit(next: number[]) {
    if (value === undefined) setInner(next);
    onChange?.(next);
  }

  function toggle(id: number) {
    commit(selectedSet.has(id) ? selected.filter((x) => x !== id) : [...selected, id]);
  }

  function close(refocus = false) {
    setOpen(false);
    setQuery("");
    if (refocus) trigger.current?.focus();
  }

  // Fermeture au clic extérieur
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) close();
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? options.filter((o) => o.name.toLowerCase().includes(q)) : options;
  }, [options, query]);

  const count = selected.length;
  const label =
    count === 0 ? placeholder : `${count} fady voafidy`;

  return (
    <div
      ref={root}
      className={`relative ${className}`}
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          e.stopPropagation();
          close(true);
        }
      }}
    >
      <div className="flex items-center gap-2">
        <button
          ref={trigger}
          type="button"
          aria-haspopup="true"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
          className="flex h-12 flex-1 items-center justify-between gap-3 rounded-full border border-ink/15 bg-white/70 px-5 text-left outline-none transition focus-visible:border-clay focus-visible:ring-4 focus-visible:ring-clay/15"
        >
          <span className={count === 0 ? "text-muted" : "font-medium text-ink"}>{label}</span>
          <ChevronDown
            aria-hidden
            className={`size-5 shrink-0 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          />
        </button>

        {count > 0 && (
          <button
            type="button"
            onClick={() => commit([])}
            className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-full border border-ink/15 px-4 text-sm font-medium text-clay-dark transition hover:bg-clay/10 focus-visible:ring-4 focus-visible:ring-clay/15 focus-visible:outline-none"
          >
            <X aria-hidden className="size-4" /> Esory rehetra
          </button>
        )}
      </div>

      {open && (
        <div
          id={panelId}
          className="absolute z-20 mt-2 w-full overflow-hidden rounded-3xl border border-ink/10 bg-rice shadow-xl shadow-ink/10"
        >
          <label className="relative block border-b border-ink/10">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Hikaroka fady…"
              aria-label="Hikaroka fady"
              className="h-11 w-full bg-transparent pr-4 pl-10 text-sm outline-none placeholder:text-muted"
            />
          </label>

          <ul role="group" aria-label="Liste des fady" className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-5 py-6 text-center text-sm text-muted">
                {options.length === 0 ? "Tsy misy fady voarakitra." : "Tsy misy fady mifanaraka."}
              </li>
            ) : (
              filtered.map((o) => {
                const checked = selectedSet.has(o.id);
                return (
                  <li key={o.id}>
                    <label className="flex cursor-pointer items-center gap-3 px-5 py-2.5 transition hover:bg-clay/10 has-[:focus-visible]:bg-clay/10">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(o.id)}
                        className="peer sr-only"
                      />
                      <span
                        aria-hidden
                        className="grid size-5 shrink-0 place-items-center rounded-md border border-ink/30 bg-white text-white transition peer-checked:border-clay peer-checked:bg-clay"
                      >
                        {checked && <Check className="size-3.5" strokeWidth={3} />}
                      </span>
                      <span className={checked ? "font-medium" : ""}>{o.name}</span>
                    </label>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
