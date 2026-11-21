import type { SlipCheck } from "./slip";
import type { Address } from "./user";

export type OrderStatus =
  | "awaiting_payment"
  | "payment_review"
  | "paid"
  | "packed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type OrderItem = {
  productId: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

export type OrderEvent = {
  status: OrderStatus;
  at: string;
  note: string;
};

export type TrackingEvent = {
  at: string;
  location: string;
  description: string;
};

export type Shipment = {
  carrier: string;
  trackingNumber: string;
  shippedAt: string;
  events: TrackingEvent[];
};

export type SlipReview = {
  decision: "approved" | "rejected";
  reason: string;
  at: string;
};

export type Payment = {
  slipImage: string;
  submittedAt: string;
  check: SlipCheck;
  review: SlipReview | null;
};

export type Order = {
  id: string;
  number: string;
  buyerId: string;
  sellerId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  couponCode: string | null;
  shippingFee: number;
  total: number;
  address: Address;
  note: string;
  status: OrderStatus;
  events: OrderEvent[];
  payment: Payment | null;
  rejectedPayments: Payment[];
  shipment: Shipment | null;
  createdAt: string;
};

export type CheckoutGroup = {
  sellerId: string;
  couponCode: string | null;
  note: string;
};
