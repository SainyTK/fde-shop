import type { Order } from "@/types";

export type DailySales = {
  day: string;
  revenue: number;
  orders: number;
};

const COUNTED = new Set(["paid", "packed", "shipped", "delivered"]);

export function isRevenueOrder(order: Order): boolean {
  return COUNTED.has(order.status);
}

export function dailySales(
  orders: Order[],
  days: number,
  now: Date,
): DailySales[] {
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  const buckets = Array.from({ length: days }, (_, index) => {
    const day = new Date(start);
    day.setDate(start.getDate() + index);
    return { day: day.toISOString(), revenue: 0, orders: 0 };
  });
  for (const order of orders) {
    if (!isRevenueOrder(order)) {
      continue;
    }
    const index = Math.floor(
      (new Date(order.createdAt).getTime() - start.getTime()) / 86_400_000,
    );
    if (index >= 0 && index < days) {
      buckets[index].revenue += order.total;
      buckets[index].orders += 1;
    }
  }
  return buckets;
}
