"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Sokajy" },
  { href: "/admin/laoka", label: "Laoka" },
  { href: "/admin/fady", label: "Fady" },
  { href: "/admin/mpampiasa", label: "Mpampiasa" },
];

export function AdminTabs({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 border-b border-ink/10">
      {tabs.filter((t) => isAdmin || t.href !== "/admin/mpampiasa").map((t) => {
        const active = t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={active ? "page" : undefined}
            className={`-mb-px border-b-2 px-4 py-2.5 text-sm font-medium transition ${
              active ? "border-clay text-clay" : "border-transparent text-ink/60 hover:text-ink"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
