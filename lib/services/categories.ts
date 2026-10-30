import { prisma } from "@/lib/prisma";

type CategoryData = { name: string; photo?: string };

export const listCategories = () => prisma.category.findMany({ orderBy: { id: "asc" } });

export async function listCategoriesWithCount() {
  const rows = await prisma.category.findMany({
    orderBy: { id: "asc" },
    include: { _count: { select: { foods: true } } },
  });
  return rows.map(({ _count, ...c }) => ({ ...c, foodCount: _count.foods }));
}

export const createCategory = (data: CategoryData) => prisma.category.create({ data });
export const updateCategory = (id: number, data: CategoryData) => prisma.category.update({ where: { id }, data });
export const deleteCategory = (id: number) => prisma.category.deleteMany({ where: { id } });
