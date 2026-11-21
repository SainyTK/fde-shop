import type { CouponInput, Result, ShopData } from "@/types";
import { normalizeCouponCode } from "./coupon";
import { newId } from "./id";

export function validateCouponInput(input: CouponInput): string | null {
  const code = normalizeCouponCode(input.code);
  if (!/^[A-Z0-9]{4,16}$/.test(code)) {
    return "โค้ดต้องเป็นตัวอักษรภาษาอังกฤษหรือตัวเลข 4-16 ตัว";
  }
  if (!Number.isFinite(input.value) || input.value <= 0) {
    return "มูลค่าส่วนลดต้องมากกว่า 0";
  }
  if (input.type === "percent" && input.value > 90) {
    return "ส่วนลดเปอร์เซ็นต์ต้องไม่เกิน 90%";
  }
  if (input.maxDiscount !== null && input.maxDiscount <= 0) {
    return "ส่วนลดสูงสุดต้องมากกว่า 0";
  }
  if (!Number.isFinite(input.minSpend) || input.minSpend < 0) {
    return "ยอดซื้อขั้นต่ำต้องไม่ติดลบ";
  }
  if (
    input.type === "fixed" &&
    input.minSpend > 0 &&
    input.value >= input.minSpend
  ) {
    return "ส่วนลดแบบจำนวนเงินต้องน้อยกว่ายอดซื้อขั้นต่ำ";
  }
  if (!Number.isInteger(input.usageLimit) || input.usageLimit < 1) {
    return "จำนวนสิทธิ์ต้องเป็นจำนวนเต็มอย่างน้อย 1";
  }
  if (Number.isNaN(new Date(input.expiresAt).getTime())) {
    return "กรุณาระบุวันหมดอายุ";
  }
  return null;
}

export function saveCoupon(
  data: ShopData,
  sellerId: string,
  couponId: string | null,
  input: CouponInput,
  now: string,
): Result<ShopData> {
  const problem = validateCouponInput(input);
  if (problem) {
    return { ok: false, error: problem };
  }
  const code = normalizeCouponCode(input.code);
  const clash = data.coupons.some(
    (coupon) =>
      coupon.code === code &&
      coupon.sellerId === sellerId &&
      coupon.id !== couponId,
  );
  if (clash) {
    return { ok: false, error: `มีโค้ด ${code} อยู่แล้ว` };
  }
  const fields = {
    ...input,
    code,
    maxDiscount: input.type === "percent" ? input.maxDiscount : null,
  };
  if (couponId) {
    const existing = data.coupons.find((coupon) => coupon.id === couponId);
    if (existing && input.usageLimit < existing.usedBy.length) {
      return {
        ok: false,
        error: `มีผู้ใช้โค้ดนี้ไปแล้ว ${existing.usedBy.length} สิทธิ์`,
      };
    }
    return {
      ok: true,
      value: {
        ...data,
        coupons: data.coupons.map((coupon) =>
          coupon.id === couponId ? { ...coupon, ...fields } : coupon,
        ),
      },
    };
  }
  return {
    ok: true,
    value: {
      ...data,
      coupons: [
        { ...fields, id: newId(), sellerId, usedBy: [], createdAt: now },
        ...data.coupons,
      ],
    },
  };
}
