import { LogOut } from "lucide-react";
import { AdminTabs } from "@/components/admin/tabs";
import { logout } from "@/lib/admin-actions";
import { requireUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const me = await requireUser();
  return (
    <div className="space-y-6 pt-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold sm:text-5xl">Dashboard</h1>
          <p className="mt-3 text-lg text-muted">Salama, {me.name}.</p>
        </div>
        <form action={logout}>
          <button className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm font-medium transition hover:bg-paper">
            <LogOut className="size-4" /> Hiala
          </button>
        </form>
      </header>
      <AdminTabs isAdmin={me.role === "admin"} />
      {children}
    </div>
  );
}
