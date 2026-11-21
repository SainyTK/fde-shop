import { StatusBadge } from "@/components/common";
import { STOCK_LEVEL_LABEL } from "@/constants";
import type { Product } from "@/types";
import { stockLevel } from "@/utils";

export function StockLabel({ product }: { product: Product }) {
  const level = stockLevel(product);
  const tone =
    level === "out" ? "danger" : level === "low" ? "warning" : "success";
  return <StatusBadge tone={tone}>{STOCK_LEVEL_LABEL[level]}</StatusBadge>;
}
