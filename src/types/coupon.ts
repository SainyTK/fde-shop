export type CouponType = "percent" | "fixed";

export type Coupon = {
  id: string;
  sellerId: string;
  code: string;
  type: CouponType;
  value: number;
  maxDiscount: number | null;
  minSpend: number;
  expiresAt: string;
  usageLimit: number;
  usedBy: string[];
  active: boolean;
  createdAt: string;
};

export type CouponInput = {
  code: string;
  type: CouponType;
  value: number;
  maxDiscount: number | null;
  minSpend: number;
  expiresAt: string;
  usageLimit: number;
  active: boolean;
};

export type CouponCheck =
  | { ok: true; discount: number }
  | { ok: false; reason: string };
