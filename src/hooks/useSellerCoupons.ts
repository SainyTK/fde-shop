"use client";

import { useMemo } from "react";
import { useShopStore } from "@/store";
import type { Coupon } from "@/types";

export function useSellerCoupons(sellerId: string | null): Coupon[] {
  const coupons = useShopStore((state) => state.data.coupons);
  return useMemo(
    () => coupons.filter((coupon) => coupon.sellerId === sellerId),
    [coupons, sellerId],
  );
}
