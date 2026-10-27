"use client";

import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import { Loader2, Pencil, Plus, ShieldCheck, Trash2, User as UserIcon, X } from "lucide-react";
import { createUser, deleteUser, updateUser, type FormState } from "@/lib/admin-actions";
import { field, IconBtn, primaryBtn, Status } from "./ui";

type Row = { id: number; name: string; email: string; role: "admin" | "user"; createdAt: string };

function UserForm({
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

  useEffect(() => {
    if (!state?.ok) return;
    if (resetOnSuccess) ref.current?.reset();
    onDone?.();
  }, [state, resetOnSuccess, onDone]);

  return (
    <form ref={ref} action={formAction} className="grid gap-3 sm:grid-cols-2">
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Anarana</span>
        <input name="name" required defaultValue={initial?.name} className={field} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Mailaka</span>
        <input name="email" type="email" required defaultValue={initial?.email} autoComplete="off" className={field} />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">
          Teny miafina {initial && <span className="font-normal text-muted">(avelao foana raha tsy hovana)</span>}
        </span>
        <input
          name="password"
          type="password"
          required={!initial}
          minLength={8}
          autoComplete="new-password"
          className={field}
        />
      </label>
      <label className="space-y-1.5">
        <span className="text-sm font-medium">Andraikitra</span>
        <select name="role" defaultValue={initial?.role ?? "user"} className={field}>
          <option value="user">Mpampiasa</option>
          <option value="admin">Admin</option>
        </select>
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
        <Status state={state} />
      </div>
    </form>
  );
}

function UserRow({ user, isMe }: { user: Row; isMe: boolean }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();

  if (editing) {
    return (
      <li className="bg-paper/60 px-5 py-5">
        <UserForm
          action={updateUser.bind(null, user.id)}
          initial={user}
          submitLabel="Tahirizo"
          onDone={() => setEditing(false)}
        />
      </li>
    );
  }

  const Icon = user.role === "admin" ? ShieldCheck : UserIcon;
  return (
    <li className={`flex items-center gap-4 px-5 py-3.5 ${pending ? "opacity-50" : ""}`}>
      <div className="grid size-12 shrink-0 place-items-center rounded-full bg-paper text-ravitoto">
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-xl font-semibold">
          {user.name} {isMe && <span className="font-sans text-sm font-normal text-muted">(ianao)</span>}
        </p>
        <p className="truncate text-sm text-muted">
          {user.email} · {user.role === "admin" ? "Admin" : "Mpampiasa"}
        </p>
      </div>
      <IconBtn label={`Ovay ${user.name}`} onClick={() => setEditing(true)}>
        <Pencil className="size-4" />
      </IconBtn>
      <IconBtn
        label={`Fafao ${user.name}`}
        danger
        disabled={pending || isMe}
        onClick={() => {
          if (!confirm(`Tena hofafana marina ve ny mpampiasa "${user.name}"?`)) return;
          startTransition(async () => {
            const r = await deleteUser(user.id);
            if (!r?.ok) alert(r?.message);
          });
        }}
      >
        <Trash2 className="size-4" />
      </IconBtn>
    </li>
  );
}

export function UserManager({ users, meId }: { users: Row[]; meId: number }) {
  const [adding, setAdding] = useState(false);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold">Mpampiasa ({users.length})</h2>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-clay px-5 font-medium text-rice transition hover:bg-clay-dark"
        >
          {adding ? <X className="size-4" /> : <Plus className="size-4" />} {adding ? "Akatona" : "Mpampiasa vaovao"}
        </button>
      </div>

      {adding && (
        <div className="rounded-3xl border border-ink/10 bg-white/60 p-5">
          <UserForm action={createUser} submitLabel="Ampio" resetOnSuccess />
        </div>
      )}

      <ul className="divide-y divide-ink/10 overflow-hidden rounded-3xl border border-ink/10 bg-white/60">
        {users.map((u) => (
          <UserRow key={u.id} user={u} isMe={u.id === meId} />
        ))}
      </ul>
    </section>
  );
}
