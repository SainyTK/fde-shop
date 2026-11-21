"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCartLines } from "@/hooks";
import { cartQuantity } from "@/utils";

export function CartButton() {
  const count = cartQuantity(useCartLines());
  return (
    <Link
      href="/cart"
      aria-label={`ตะกร้าสินค้า ${count} ชิ้น`}
      className="relative flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10"
    >
      <ShoppingCart className="size-6" />
      {count > 0 ? (
        <span className="absolute top-0 right-0 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-primary bg-white px-1 font-semibold text-[11px] text-primary tabular-nums">
          {count > 99 ? "99+" : count}
        </span>
      ) : null}
    </Link>
  );
}
