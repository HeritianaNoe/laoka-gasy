import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user?.role === "admin") redirect("/admin");

  return (
    <div className="mx-auto max-w-md space-y-8 pt-14">
      <header>
        <h1 className="font-display text-4xl font-semibold">Fidirana admin</h1>
        <p className="mt-3 text-lg text-muted">Ho an'ny mpitantana ihany ity faritra ity.</p>
      </header>
      <LoginForm />
    </div>
  );
}
