import { AddFoodForm } from "@/components/add-food-form";
import { getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function AddPage() {
  const categories = await getCategories();
  return (
    <div className="mx-auto max-w-3xl space-y-8 pt-10">
      <header>
        <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Hampiditra</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Laoka vaovao</h1>
        <p className="mt-3 text-lg text-muted">Asio sary, anarana ary famaritana fohy ny laoka tianao.</p>
      </header>
      <AddFoodForm categories={categories} />
    </div>
  );
}
