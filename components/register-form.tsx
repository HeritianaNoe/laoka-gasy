"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { register, type FormState } from "@/lib/admin-actions";

const field =
  "w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3 text-base outline-none focus:border-clay focus:ring-4 focus:ring-clay/15";

export function RegisterForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(register, null);
  return (
    <form action={action} className="space-y-4 rounded-[2rem] border border-ink/10 bg-white/50 p-6 sm:p-8">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Anarana</span>
        <input name="name" type="text" required minLength={2} maxLength={60} autoComplete="name" className={field} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Mailaka</span>
        <input name="email" type="email" required autoComplete="email" className={field} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Teny miafina</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className={field} />
        <span className="text-xs text-muted">8 litera farafahakeliny.</span>
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Averina ny teny miafina</span>
        <input name="confirm" type="password" required minLength={8} autoComplete="new-password" className={field} />
      </label>
      {state && !state.ok && (
        <p role="alert" className="flex items-center gap-2 text-sm font-medium text-clay">
          <TriangleAlert className="size-4 shrink-0" /> {state.message}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ravitoto font-medium text-rice transition hover:bg-ravitoto-light disabled:opacity-60"
      >
        {pending && <Loader2 className="size-4 animate-spin" />} Hisoratra anarana
      </button>
      <p className="text-center text-sm text-muted">
        Efa membre ve?{" "}
        <Link href="/admin/miditra" className="font-medium text-clay underline-offset-4 hover:underline">
          Hiditra
        </Link>
      </p>
    </form>
  );
}
