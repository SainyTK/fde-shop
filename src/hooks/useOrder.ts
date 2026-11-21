"use client";

import { useShopStore } from "@/store";
import type { Order } from "@/types";

export function useOrder(orderId: string): Order | null {
  return useShopStore(
    (state) => state.data.orders.find((order) => order.id === orderId) ?? null,
  );
}
