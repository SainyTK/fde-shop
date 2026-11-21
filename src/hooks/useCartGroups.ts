"use client";

import { useMemo } from "react";
import { useShopStore } from "@/store";
import { type CartGroup, groupCart } from "@/utils";
import { useCartLines } from "./useCartLines";

export function useCartGroups(): CartGroup[] {
  const lines = useCartLines();
  const products = useShopStore((state) => state.data.products);
  const users = useShopStore((state) => state.data.users);
  return useMemo(
    () => groupCart(lines, products, users),
    [lines, products, users],
  );
}
