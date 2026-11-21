import type {
  Product,
  ShopData,
  StockLevel,
  StockMovementReason,
} from "@/types";
import { newId } from "./id";

export function stockLevel(product: Product): StockLevel {
  if (product.stock <= 0) {
    return "out";
  }
  if (product.stock <= product.lowStockThreshold) {
    return "low";
  }
  return "in_stock";
}

export type StockChange = {
  productId: string;
  quantity: number;
  reason: StockMovementReason;
  note: string;
  orderId: string | null;
  at: string;
};

export function applyStockChange(
  data: ShopData,
  change: StockChange,
): ShopData {
  const product = data.products.find((item) => item.id === change.productId);
  if (!product) {
    return data;
  }
  const balance = product.stock + change.quantity;
  return {
    ...data,
    products: data.products.map((item) =>
      item.id === product.id
        ? { ...item, stock: balance, updatedAt: change.at }
        : item,
    ),
    stockMovements: [
      {
        id: newId(),
        productId: product.id,
        sellerId: product.sellerId,
        reason: change.reason,
        quantity: change.quantity,
        balance,
        note: change.note,
        orderId: change.orderId,
        at: change.at,
      },
      ...data.stockMovements,
    ],
  };
}
