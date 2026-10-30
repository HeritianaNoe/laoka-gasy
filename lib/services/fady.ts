import { prisma } from "@/lib/prisma";

export const listFady = () => prisma.fady.findMany({ orderBy: { name: "asc" } });
export const createFady = (name: string) => prisma.fady.create({ data: { name } });
export const updateFady = (id: number, name: string) => prisma.fady.update({ where: { id }, data: { name } });
/** Les liens foodswithfady partent en cascade (onDelete: Cascade). */
export const deleteFady = (id: number) => prisma.fady.deleteMany({ where: { id } });
