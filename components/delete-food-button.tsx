"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteFood } from "@/lib/actions";

export function DeleteFoodButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Tena hofafana marina ve ny "${name}"?`)) return;
        startTransition(async () => {
          await deleteFood(id);
          router.push("/");
        });
      }}
      className="inline-flex items-center gap-2 text-sm font-medium text-muted transition hover:text-clay disabled:opacity-50"
    >
      <Trash2 className="size-4" /> {pending ? "Mamafa…" : "Fafao ity laoka ity"}
    </button>
  );
}
