import { CategoryManager } from "@/components/admin/category-manager";
import { requireUser } from "@/lib/auth";
import { getCategoriesWithCount } from "@/lib/data";

export default async function AdminCategoriesPage() {
  const me = await requireUser();
  return <CategoryManager categories={await getCategoriesWithCount()} canDelete={me.role === "admin"} />;
}
