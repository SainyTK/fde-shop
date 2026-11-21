"use client";

import {
  House,
  LayoutGrid,
  Package,
  ShoppingCart,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib";

const TABS = [
  { href: "/", label: "หน้าแรก", icon: House },
  { href: "/search", label: "หมวดหมู่", icon: LayoutGrid },
  { href: "/cart", label: "ตะกร้า", icon: ShoppingCart },
  { href: "/orders", label: "คำสั่งซื้อ", icon: Package },
  { href: "/account", label: "ฉัน", icon: UserRound },
];

export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
      {TABS.map((tab) => {
        const active =
          tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 text-[11px]",
              active ? "text-primary" : "text-muted-foreground",
            )}
          >
            <tab.icon className="size-5" />
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
