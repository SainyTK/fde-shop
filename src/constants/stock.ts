import type { StockLevel, StockMovementReason } from "@/types";

export const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const STOCK_REASON_LABEL: Record<StockMovementReason, string> = {
  initial: "ยอดตั้งต้น",
  restock: "รับสินค้าเข้า",
  adjustment: "ปรับยอด",
  sale: "ขาย",
  cancellation: "คืนจากคำสั่งซื้อที่ยกเลิก",
};

export const STOCK_LEVEL_LABEL: Record<StockLevel, string> = {
  in_stock: "มีสินค้า",
  low: "ใกล้หมด",
  out: "หมด",
};
