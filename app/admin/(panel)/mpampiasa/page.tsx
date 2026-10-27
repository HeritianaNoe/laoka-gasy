import { UserManager } from "@/components/admin/user-manager";
import { requireAdmin } from "@/lib/auth";
import { getUsersForAdmin } from "@/lib/data";

export default async function AdminUsersPage() {
  const me = await requireAdmin();
  const users = await getUsersForAdmin();
  return <UserManager users={users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }))} meId={me.id} />;
}
