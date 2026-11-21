"use client";

import {
  Boxes,
  LayoutDashboard,
  type LucideIcon,
  Package,
  ReceiptText,
  Settings,
  TicketPercent,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useOrdersFor, useSellerProducts } from "@/hooks";
import { cn } from "@/lib";
import { stockLevel } from "@/utils";

type SellerNavProps = {
  sellerId: string;
  layout: "sidebar" | "tabs";
};

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

export function SellerNav({ sellerId, layout }: SellerNavProps) {
  const pathname = usePathname();
  const orders = useOrdersFor("seller", sellerId);
  const products = useSellerProducts(sellerId);
  const pendingOrders = orders.filter((order) =>
    ["payment_review", "paid", "packed"].includes(order.status),
  ).length;
  const stockAlerts = products.filter(
    (product) => product.active && stockLevel(product) !== "in_stock",
  ).length;
  const items: NavItem[] = [
    { href: "/seller", label: "ภาพรวม", icon: LayoutDashboard, count: 0 },
    {
      href: "/seller/orders",
      label: "คำสั่งซื้อ",
      icon: ReceiptText,
      count: pendingOrders,
    },
    { href: "/seller/products", label: "สินค้า", icon: Package, count: 0 },
    {
      href: "/seller/stock",
      label: "สต็อกสินค้า",
      icon: Boxes,
      count: stockAlerts,
    },
    {
      href: "/seller/coupons",
      label: "คูปองส่วนลด",
      icon: TicketPercent,
      count: 0,
    },
    { href: "/seller/settings", label: "ตั้งค่าร้านค้า", icon: Settings, count: 0 },
  ];
  return (
    <nav
      className={cn(
        layout === "sidebar"
          ? "flex flex-col gap-1"
          : "flex gap-1 overflow-x-auto px-2 pb-2 [scrollbar-width:none]",
      )}
    >
      {items.map((item) => {
        const active =
          item.href === "/seller"
            ? pathname === "/seller"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
              active
                ? "bg-secondary font-medium text-primary"
                : "text-foreground hover:bg-muted",
            )}
          >
            <item.icon className="size-4" />
            <span className="flex-1">{item.label}</span>
            {item.count > 0 ? (
              <span className="rounded-full bg-primary px-1.5 font-semibold text-[11px] text-white tabular-nums">
                {item.count}
              </span>
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}
