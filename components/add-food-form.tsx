"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Loader2, TriangleAlert } from "lucide-react";
import type { Category } from "@prisma/client";
import { addFood, type FormState } from "@/lib/actions";

// Downscale large camera photos in the browser so uploads stay small
async function resizeImage(file: File, max = 1400): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("resize failed"))), "image/jpeg", 0.85),
  );
  return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
}

export function AddFoodForm({ categories }: { categories: Category[] }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState<FormState, FormData>(async (prev, formData) => {
    if (photo) formData.set("photo", photo);
    return addFood(prev, formData);
  }, null);

  useEffect(() => {
    if (state?.ok) {
      formRef.current?.reset();
      setPhoto(null);
      setPreview(null);
    }
  }, [state]);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const resized = await resizeImage(file).catch(() => file);
    setPhoto(resized);
    setPreview(URL.createObjectURL(resized));
  }

  const field =
    "w-full rounded-2xl border border-ink/15 bg-white/70 px-4 py-3 text-base outline-none focus:border-clay focus:ring-4 focus:ring-clay/15";

  return (
    <form ref={formRef} action={formAction} className="grid gap-6 rounded-[2rem] border border-ink/10 bg-white/50 p-5 sm:grid-cols-[240px_1fr] sm:p-8">
      <label className="group relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-3xl border-2 border-dashed border-ink/20 bg-paper text-center transition hover:border-clay">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Sary nofidina" className="absolute inset-0 size-full object-cover" />
        ) : (
          <span className="flex flex-col items-center gap-2 px-4 text-muted">
            <Camera className="size-9 text-clay" />
            <span className="font-medium text-ink">Hampiditra sary</span>
            <span className="text-xs">JPG, PNG na WEBP</span>
          </span>
        )}
        {preview && (
          <span className="absolute inset-x-3 bottom-3 rounded-full bg-ink/75 py-1.5 text-xs font-medium text-rice opacity-0 transition group-hover:opacity-100">
            Hanova sary
          </span>
        )}
        <input type="file" accept="image/*" onChange={onPick} className="sr-only" />
      </label>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-sm font-medium">Anaran'ny laoka</label>
          <input id="name" name="name" required placeholder="ohatra: Romazava" className={field} />
        </div>
        <div className="space-y-1.5">
          <label htmlFor="categoryId" className="text-sm font-medium">Sokajy</label>
          <select id="categoryId" name="categoryId" className={field} defaultValue={categories[0]?.id}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-sm font-medium">Famaritana</label>
          <textarea
            id="description"
            name="description"
            required
            rows={4}
            placeholder="Inona no ao anatiny? Ahoana no fahandrahoana azy?"
            className={field}
          />
        </div>

        {state && (
          <p
            role="status"
            className={`flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium ${
              state.ok ? "bg-ravitoto/10 text-ravitoto" : "bg-clay/10 text-clay-dark"
            }`}
          >
            {state.ok ? <CheckCircle2 className="size-4" /> : <TriangleAlert className="size-4" />}
            {state.message}
            {state.ok && (
              <Link href="/" className="ml-auto underline underline-offset-4">Jereo ny lisitra</Link>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-clay font-medium text-rice shadow-lg shadow-clay/25 transition hover:bg-clay-dark disabled:opacity-60 sm:w-auto sm:px-8"
        >
          {pending && <Loader2 className="size-4 animate-spin" />}
          {pending ? "Mitahiry…" : "Tahirizo"}
        </button>
      </div>
    </form>
  );
}
