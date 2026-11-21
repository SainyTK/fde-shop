import type { Coupon, CouponCheck } from "@/types";
import { formatPrice } from "./format";

export function normalizeCouponCode(code: string): string {
  return code.trim().toUpperCase();
}

export function couponDiscount(coupon: Coupon, subtotal: number): number {
  if (coupon.type === "fixed") {
    return Math.min(coupon.value, subtotal);
  }
  const raw = Math.floor((subtotal * coupon.value) / 100);
  const capped =
    coupon.maxDiscount === null ? raw : Math.min(raw, coupon.maxDiscount);
  return Math.min(capped, subtotal);
}

export function couponRemaining(coupon: Coupon): number {
  return Math.max(coupon.usageLimit - coupon.usedBy.length, 0);
}

export function isCouponExpired(coupon: Coupon, now: string): boolean {
  return new Date(coupon.expiresAt).getTime() < new Date(now).getTime();
}

export type CouponContext = {
  buyerId: string;
  sellerId: string;
  subtotal: number;
  now: string;
};

export function checkCoupon(
  coupon: Coupon,
  context: CouponContext,
): CouponCheck {
  if (coupon.sellerId !== context.sellerId) {
    return { ok: false, reason: "โค้ดนี้ใช้กับร้านค้านี้ไม่ได้" };
  }
  if (!coupon.active) {
    return { ok: false, reason: "โค้ดนี้ถูกปิดใช้งาน" };
  }
  if (isCouponExpired(coupon, context.now)) {
    return { ok: false, reason: "โค้ดนี้หมดอายุแล้ว" };
  }
  if (couponRemaining(coupon) === 0) {
    return { ok: false, reason: "โค้ดนี้ถูกใช้ครบจำนวนแล้ว" };
  }
  if (coupon.usedBy.includes(context.buyerId)) {
    return { ok: false, reason: "คุณใช้โค้ดนี้ไปแล้ว" };
  }
  if (context.subtotal < coupon.minSpend) {
    return {
      ok: false,
      reason: `ซื้อขั้นต่ำ ${formatPrice(coupon.minSpend)} (ขาดอีก ${formatPrice(coupon.minSpend - context.subtotal)})`,
    };
  }
  return { ok: true, discount: couponDiscount(coupon, context.subtotal) };
}

export function describeCoupon(coupon: Coupon): string {
  if (coupon.type === "fixed") {
    return `ลด ${formatPrice(coupon.value)}`;
  }
  const cap =
    coupon.maxDiscount === null
      ? ""
      : ` สูงสุด ${formatPrice(coupon.maxDiscount)}`;
  return `ลด ${coupon.value}%${cap}`;
}
