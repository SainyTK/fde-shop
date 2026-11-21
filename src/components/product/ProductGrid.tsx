"use client";

import { cn } from "@/lib";
import { useShopStore } from "@/store";
import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

const COLUMNS = {
  full: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
  main: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
  aside: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-2",
};

type ProductGridProps = {
  products: Product[];
  columns: keyof typeof COLUMNS;
};

export function ProductGrid({ products, columns }: ProductGridProps) {
  const users = useShopStore((state) => state.data.users);
  return (
    <div className={cn("grid gap-2", COLUMNS[columns])}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          location={
            users.find((user) => user.id === product.sellerId)?.shop?.location
          }
        />
      ))}
    </div>
  );
}
