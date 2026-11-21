"use client";

import { useShopStore } from "@/store";
import type { Product } from "@/types";

export function useProduct(productId: string): Product | null {
  return useShopStore(
    (state) =>
      state.data.products.find((product) => product.id === productId) ?? null,
  );
}
