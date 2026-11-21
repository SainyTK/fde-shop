import { FREE_SHIPPING_MIN, SHIPPING_FEE } from "@/constants";
import type { Product } from "@/types";

export function shippingFeeFor(subtotal: number): number {
  return subtotal >= FREE_SHIPPING_MIN ? 0 : SHIPPING_FEE;
}

export function discountPercent(product: Product): number | null {
  if (
    product.originalPrice === null ||
    product.originalPrice <= product.price
  ) {
    return null;
  }
  return Math.round((1 - product.price / product.originalPrice) * 100);
}

export function roundPrice(value: number): number {
  return Math.max(Math.round(value / 10) * 10 - 1, 9);
}
