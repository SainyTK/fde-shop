export type StockMovementReason =
  | "initial"
  | "restock"
  | "adjustment"
  | "sale"
  | "cancellation";

export type StockMovement = {
  id: string;
  productId: string;
  sellerId: string;
  reason: StockMovementReason;
  quantity: number;
  balance: number;
  note: string;
  orderId: string | null;
  at: string;
};

export type StockLevel = "in_stock" | "low" | "out";
