import { CategoryManager } from "@/components/admin/category-manager";
import { requireAdmin } from "@/lib/auth";
import { getCategoriesWithCount } from "@/lib/data";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  return <CategoryManager categories={await getCategoriesWithCount()} />;
}
