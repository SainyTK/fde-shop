import { StatusBadge } from "@/components/common";
import { ORDER_STATUS } from "@/constants";
import type { OrderStatus } from "@/types";

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const meta = ORDER_STATUS[status];
  return <StatusBadge tone={meta.tone}>{meta.label}</StatusBadge>;
}
