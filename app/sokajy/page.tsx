import { CategoryGrid } from "@/components/category-grid";
import { getCategoriesWithCount } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  // Isa avy amin'ny query iray ihany no ampiasain'ny public sy ny dashboard
  const categories = await getCategoriesWithCount();

  return (
    <div className="space-y-8 pt-10">
      <header className="max-w-2xl">
        <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Sokajy</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Karazana laoka</h1>
        <p className="mt-3 text-lg text-muted">Safidio ny sokajy iray hahitana ireo laoka mety aminao.</p>
      </header>

      <CategoryGrid categories={categories} />
    </div>
  );
}
