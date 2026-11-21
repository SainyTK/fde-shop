"use client";

import { Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Panel } from "@/components/common";
import { useShopStore } from "@/store";
import { discountPercent, formatCompact, formatPrice } from "@/utils";

export function FlashDeals() {
  const products = useShopStore((state) => state.data.products);
  const deals = useMemo(
    () =>
      products
        .filter(
          (product) =>
            product.active &&
            product.stock > 0 &&
            discountPercent(product) !== null,
        )
        .sort((a, b) => (discountPercent(b) ?? 0) - (discountPercent(a) ?? 0))
        .slice(0, 12),
    [products],
  );
  return (
    <Panel
      title={
        <span className="flex items-center gap-1.5 font-semibold text-primary uppercase italic">
          <Zap className="size-5 fill-primary" />
          Flash Deals
        </span>
      }
      action={
        <Link
          href="/search?sort=best-selling"
          className="text-primary text-sm hover:underline"
        >
          ดูทั้งหมด
        </Link>
      }
    >
      <div className="-mx-1 flex snap-x gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
        {deals.map((product) => {
          const claimed = Math.round(
            (1 - product.stock / (product.stock + 40)) * 100,
          );
          return (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="flex w-36 shrink-0 snap-start flex-col items-center gap-2 rounded-sm p-1.5 transition hover:bg-muted/50 sm:w-40"
            >
              <span className="relative aspect-square w-full">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="160px"
                  className="object-contain"
                />
                <span className="absolute top-0 right-0 bg-amber-300 px-1 py-0.5 font-semibold text-[11px] text-primary">
                  -{discountPercent(product)}%
                </span>
              </span>
              <span className="font-medium text-lg text-primary">
                {formatPrice(product.price)}
              </span>
              <span className="relative w-full">
                <span className="block h-4 overflow-hidden rounded-full bg-[#ffbda6]">
                  <span
                    className="block h-full rounded-full bg-linear-to-r from-[#ee4d2d] to-[#ff7337]"
                    style={{ width: `${claimed}%` }}
                  />
                </span>
                <span className="absolute inset-0 flex items-center justify-center font-semibold text-[10px] text-white">
                  {product.stock <= 10
                    ? `เหลือ ${product.stock} ชิ้น`
                    : `ขายแล้ว ${formatCompact(product.sold)}`}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </Panel>
  );
}
