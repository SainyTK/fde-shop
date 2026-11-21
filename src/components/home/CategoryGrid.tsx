"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { Panel } from "@/components/common";
import { CATEGORIES } from "@/constants";
import { useShopStore } from "@/store";

export function CategoryGrid() {
  const products = useShopStore((state) => state.data.products);
  const tiles = useMemo(
    () =>
      CATEGORIES.map((category) => ({
        ...category,
        image: products.find(
          (product) => product.category === category.id && product.active,
        )?.images[0],
      })),
    [products],
  );
  return (
    <Panel title="หมวดหมู่">
      <div className="-m-2 grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-11">
        {tiles.map((tile) => (
          <Link
            key={tile.id}
            href={`/search?category=${tile.id}`}
            className="flex flex-col items-center gap-2 rounded-sm p-2 text-center transition hover:bg-muted/60"
          >
            <span className="relative size-14 overflow-hidden rounded-full bg-muted sm:size-16">
              {tile.image ? (
                <Image
                  src={tile.image}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-contain p-1.5"
                />
              ) : null}
            </span>
            <span className="line-clamp-2 text-xs leading-tight">
              {tile.label}
            </span>
          </Link>
        ))}
      </div>
    </Panel>
  );
}
