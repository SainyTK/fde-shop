"use client";

import { useShopStore } from "@/store";
import type { CartLine } from "@/types";

const EMPTY: CartLine[] = [];

export function useCartLines(): CartLine[] {
  return useShopStore((state) =>
    state.data.sessionUserId
      ? (state.data.carts[state.data.sessionUserId] ?? EMPTY)
      : EMPTY,
  );
}
