import { FadyAdmin } from "@/components/admin/fady-admin";
import { requireAdmin } from "@/lib/auth";
import { getFadyList } from "@/lib/data";

export default async function AdminFadyPage() {
  await requireAdmin(); // admin ihany no mahita sy mitantana ny fady
  return <FadyAdmin list={await getFadyList()} />;
}
