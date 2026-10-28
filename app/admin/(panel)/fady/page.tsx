import { FadyAdmin } from "@/components/admin/fady-admin";
import { requireUser } from "@/lib/auth";
import { getFadyList } from "@/lib/data";

export default async function AdminFadyPage() {
  const me = await requireUser();
  return <FadyAdmin list={await getFadyList()} canDelete={me.role === "admin"} />;
}
