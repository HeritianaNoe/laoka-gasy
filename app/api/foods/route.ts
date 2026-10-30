import { NextResponse } from "next/server";
import { getFoods } from "@/lib/foods";

export const dynamic = "force-dynamic";

/** GET /api/foods?fady=1,3&category=2 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const fadyIds = (searchParams.get("fady") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map(Number);

  const category = Number(searchParams.get("category"));
  const foods = await getFoods({
    fadyIds,
    categoryId: Number.isInteger(category) && category > 0 ? category : undefined,
  });

  return NextResponse.json(foods);
}
