import { FoodManager } from "@/components/admin/food-manager";
import { requireAdmin } from "@/lib/auth";
import { getCategories, getFoodsForAdmin } from "@/lib/data";

export default async function AdminFoodsPage() {
  await requireAdmin();
  const [foods, categories] = await Promise.all([getFoodsForAdmin(), getCategories()]);
  return <FoodManager foods={foods} categories={categories.map((c) => ({ id: c.id, name: c.name }))} />;
}
