import { FadyManager } from "@/components/fady-manager";
import { getFadyList } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function FadyPage() {
  const list = await getFadyList();
  return (
    <div className="mx-auto max-w-2xl space-y-8 pt-10">
      <header>
        <p className="text-sm font-semibold tracking-[0.25em] text-clay uppercase">Fady</p>
        <h1 className="mt-2 font-display text-4xl font-semibold sm:text-5xl">Ny tsy hohanina</h1>
        <p className="mt-3 text-lg text-muted">
          Soraty eto ireo zavatra fady aminao na amin'ny fianakavianao. Ireo laoka misy azy dia voamarika sy afenina ao amin'ny lisitra.
        </p>
      </header>
      <FadyManager list={list} />
    </div>
  );
}
