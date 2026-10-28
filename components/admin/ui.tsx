import { CheckCircle2, TriangleAlert } from "lucide-react";
import type { FormState } from "@/lib/admin-actions";

export const field =
  "w-full rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-base outline-none focus:border-clay focus:ring-4 focus:ring-clay/15";

export const primaryBtn =
  "inline-flex h-11 items-center gap-2 rounded-full bg-ravitoto px-5 font-medium text-rice transition hover:bg-ravitoto-light disabled:opacity-60";

export function Status({ state }: { state: FormState }) {
  if (!state) return null;
  return (
    <p role="status" className={`flex items-center gap-1.5 text-sm font-medium ${state.ok ? "text-ravitoto" : "text-clay"}`}>
      {state.ok ? <CheckCircle2 className="size-4" /> : <TriangleAlert className="size-4" />} {state.message}
    </p>
  );
}

export function IconBtn({
  label,
  danger,
  disabled,
  onClick,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  danger?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={disabled && hint ? hint : label}
      disabled={disabled}
      onClick={onClick}
      className={`grid size-9 place-items-center rounded-full text-ink/60 transition hover:bg-paper disabled:cursor-not-allowed disabled:opacity-40 ${danger ? "hover:text-clay" : "hover:text-ink"}`}
    >
      {children}
    </button>
  );
}

export function Thumb({ src, name }: { src: string; name: string }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={name} className="size-14 shrink-0 rounded-xl object-cover" />
  ) : (
    <div className="grid size-14 shrink-0 place-items-center rounded-xl bg-paper text-xs text-muted">Sary</div>
  );
}
