"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import { Checkbox } from "@/components/ui/checkbox";
import { useShopStore } from "@/store";
import { type CartGroup, cartLineProblem } from "@/utils";
import { CartLineRow } from "./CartLineRow";

export function CartShopGroup({ group }: { group: CartGroup }) {
  const setCartSelected = useShopStore((state) => state.setCartSelected);
  const selectable = group.items.filter(
    (item) => cartLineProblem(item) === null,
  );
  const allSelected =
    selectable.length > 0 && selectable.every((item) => item.line.selected);
  return (
    <section className="rounded-sm bg-white px-4 shadow-xs ring-1 ring-black/5 sm:px-5">
      <header className="flex items-center gap-3 border-b py-3">
        <Checkbox
          aria-label={`เลือกสินค้าทั้งหมดของ ${group.seller.shop?.name}`}
          checked={allSelected}
          onCheckedChange={(checked) =>
            setCartSelected(
              selectable.map((item) => item.product.id),
              checked === true,
            )
          }
        />
        <Store className="size-4" />
        <Link
          href={`/shops/${group.seller.id}`}
          className="font-medium text-sm hover:text-primary"
        >
          {group.seller.shop?.name}
        </Link>
      </header>
      <ul className="divide-y">
        {group.items.map((item) => (
          <CartLineRow key={item.product.id} item={item} />
        ))}
      </ul>
    </section>
  );
}
