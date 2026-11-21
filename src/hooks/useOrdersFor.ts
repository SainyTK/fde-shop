"use client";

import { useMemo } from "react";
import { useShopStore } from "@/store";
import type { Order } from "@/types";

export function useOrdersFor(
  role: "buyer" | "seller",
  userId: string | null,
): Order[] {
  const orders = useShopStore((state) => state.data.orders);
  return useMemo(
    () =>
      orders
        .filter(
          (order) =>
            (role === "buyer" ? order.buyerId : order.sellerId) === userId,
        )
        .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [orders, role, userId],
  );
}
