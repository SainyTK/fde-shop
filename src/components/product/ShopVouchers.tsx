"use client";

import { TicketPercent } from "lucide-react";
import { useMemo } from "react";
import { useSellerCoupons } from "@/hooks";
import {
  couponRemaining,
  describeCoupon,
  formatPrice,
  isCouponExpired,
} from "@/utils";

export function ShopVouchers({ sellerId }: { sellerId: string }) {
  const coupons = useSellerCoupons(sellerId);
  const available = useMemo(() => {
    const now = new Date().toISOString();
    return coupons.filter(
      (coupon) =>
        coupon.active &&
        !isCouponExpired(coupon, now) &&
        couponRemaining(coupon) > 0,
    );
  }, [coupons]);
  if (available.length === 0) {
    return null;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="flex items-center gap-1.5 font-medium text-sm">
        <TicketPercent className="size-4 text-primary" />
        โค้ดส่วนลดของร้าน
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:thin]">
        {available.map((coupon) => (
          <div
            key={coupon.id}
            className="flex shrink-0 items-stretch overflow-hidden rounded-sm border border-primary/40 bg-secondary text-xs"
          >
            <div className="flex flex-col justify-center border-primary/40 border-r border-dashed px-3 py-2">
              <span className="font-semibold text-primary">
                {describeCoupon(coupon)}
              </span>
              <span className="text-muted-foreground">
                ขั้นต่ำ {formatPrice(coupon.minSpend)}
              </span>
            </div>
            <div className="flex items-center px-3 font-mono font-semibold text-primary">
              {coupon.code}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
