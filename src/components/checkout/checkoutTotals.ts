import type { Coupon } from "@/types";
import {
  type CartGroup,
  checkCoupon,
  itemsSubtotal,
  selectedItems,
  shippingFeeFor,
} from "@/utils";

export type GroupTotals = {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  couponError: string | null;
};

export function groupTotals(
  group: CartGroup,
  coupon: Coupon | null,
  buyerId: string,
  now: string,
): GroupTotals {
  const subtotal = itemsSubtotal(selectedItems(group));
  const check = coupon
    ? checkCoupon(coupon, { buyerId, sellerId: group.seller.id, subtotal, now })
    : null;
  const discount = check?.ok ? check.discount : 0;
  const shippingFee = shippingFeeFor(subtotal);
  return {
    subtotal,
    discount,
    shippingFee,
    total: subtotal - discount + shippingFee,
    couponError: check && !check.ok ? check.reason : null,
  };
}
