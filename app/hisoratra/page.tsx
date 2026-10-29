import { redirect } from "next/navigation";
import { RegisterForm } from "@/components/register-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata = { title: "Hisoratra anarana — Laoka" };

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) redirect("/admin");

  return (
    <div className="mx-auto max-w-md space-y-8 pt-14">
      <header>
        <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Fisoratana</p>
        <h1 className="mt-2 font-display text-4xl font-semibold">Hisoratra anarana</h1>
        <p className="mt-3 text-lg text-muted">Ataovy mpikambana ianao mba hahafahanao manampy sy mitantana laoka.</p>
      </header>
      <RegisterForm />
    </div>
  );
}
