import type { OrderStatus } from "@/types";

export type StatusTone = "warning" | "info" | "success" | "muted" | "danger";

export const ORDER_STATUS: Record<
  OrderStatus,
  { label: string; tone: StatusTone }
> = {
  awaiting_payment: { label: "รอชำระเงิน", tone: "warning" },
  payment_review: { label: "รอตรวจสลิป", tone: "warning" },
  paid: { label: "ชำระเงินแล้ว", tone: "info" },
  packed: { label: "เตรียมพัสดุแล้ว", tone: "info" },
  shipped: { label: "กำลังจัดส่ง", tone: "info" },
  delivered: { label: "จัดส่งสำเร็จ", tone: "success" },
  cancelled: { label: "ยกเลิกแล้ว", tone: "danger" },
};

export const FULFILMENT_STEPS: { status: OrderStatus; label: string }[] = [
  { status: "awaiting_payment", label: "สั่งซื้อแล้ว" },
  { status: "paid", label: "ชำระเงินแล้ว" },
  { status: "packed", label: "เตรียมพัสดุ" },
  { status: "shipped", label: "ส่งพัสดุแล้ว" },
  { status: "delivered", label: "ได้รับสินค้า" },
];

export type OrderTab = {
  id: string;
  label: string;
  statuses: OrderStatus[];
};

export const BUYER_ORDER_TABS: OrderTab[] = [
  { id: "all", label: "ทั้งหมด", statuses: [] },
  {
    id: "to-pay",
    label: "ที่ต้องชำระ",
    statuses: ["awaiting_payment", "payment_review"],
  },
  { id: "to-ship", label: "ที่ต้องจัดส่ง", statuses: ["paid", "packed"] },
  { id: "to-receive", label: "ที่ต้องได้รับ", statuses: ["shipped"] },
  { id: "completed", label: "สำเร็จแล้ว", statuses: ["delivered"] },
  { id: "cancelled", label: "ยกเลิก", statuses: ["cancelled"] },
];

export const SELLER_ORDER_TABS: OrderTab[] = [
  { id: "all", label: "ทั้งหมด", statuses: [] },
  { id: "review", label: "รอตรวจสลิป", statuses: ["payment_review"] },
  { id: "to-pack", label: "ที่ต้องแพ็ก", statuses: ["paid"] },
  { id: "to-ship", label: "ที่ต้องส่ง", statuses: ["packed"] },
  { id: "shipping", label: "กำลังจัดส่ง", statuses: ["shipped"] },
  { id: "completed", label: "สำเร็จแล้ว", statuses: ["delivered"] },
  { id: "unpaid", label: "รอชำระเงิน", statuses: ["awaiting_payment"] },
  { id: "cancelled", label: "ยกเลิก", statuses: ["cancelled"] },
];
