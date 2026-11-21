"use client";

import { useMemo } from "react";
import { useShopStore } from "@/store";
import type { Product } from "@/types";

export function useSellerProducts(sellerId: string | null): Product[] {
  const products = useShopStore((state) => state.data.products);
  return useMemo(
    () => products.filter((product) => product.sellerId === sellerId),
    [products, sellerId],
  );
}
