"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ban, Info, ShieldCheck, LayoutGrid, PlusCircle, UtensilsCrossed } from "lucide-react";

const primary = [
  { href: "/", label: "Laoka", icon: UtensilsCrossed },
  { href: "/sokajy", label: "Sokajy", icon: LayoutGrid },
  { href: "/hampiditra", label: "Hampiditra", icon: PlusCircle },
];

const secondary = [
  { href: "/fady", label: "Fady", icon: Ban },
  { href: "/momba", label: "Momba", icon: Info },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" || pathname.startsWith("/laoka") : pathname.startsWith(href);
}

export function Header() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-rice/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-3xl font-semibold tracking-tight text-clay">Laoka</span>
          <span className="hidden text-xs uppercase tracking-[0.2em] text-muted sm:inline">sakafo Malagasy</span>
        </Link>
        <nav className="flex items-center gap-1">
          {[...primary, ...secondary].map(({ href, label, icon: Icon }, i) => (
            <Link
              key={href}
              href={href}
              className={`${i < primary.length ? "hidden md:flex" : "flex"} items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition ${
                isActive(pathname, href) ? "bg-ravitoto text-rice" : "text-ink/70 hover:bg-paper hover:text-ink"
              }`}
            >
              <Icon className="size-4" />
              <span className={i < primary.length ? "" : "hidden sm:inline"}>{label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

// Mirrors the Android bottom navigation (Home / Category / Update)
export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 rounded-2xl border border-ink/10 bg-ravitoto p-1.5 shadow-xl shadow-ravitoto/30 md:hidden">
      {primary.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={`flex flex-col items-center gap-0.5 rounded-xl py-2 text-xs font-medium transition ${
            isActive(pathname, href) ? "bg-rice text-ravitoto" : "text-rice/75"
          }`}
        >
          <Icon className="size-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
