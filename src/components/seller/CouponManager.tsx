"use client";

import { TicketPercent, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, PageTitle, StatusBadge } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import type { StatusTone } from "@/constants";
import { useSellerCoupons } from "@/hooks";
import { useShopStore } from "@/store";
import type { Coupon, User } from "@/types";
import {
  couponRemaining,
  describeCoupon,
  formatDate,
  formatPrice,
  isCouponExpired,
} from "@/utils";
import { CouponDialog } from "./CouponDialog";

function couponState(
  coupon: Coupon,
  now: string,
): { label: string; tone: StatusTone } {
  if (isCouponExpired(coupon, now)) {
    return { label: "หมดอายุ", tone: "muted" };
  }
  if (couponRemaining(coupon) === 0) {
    return { label: "ใช้ครบแล้ว", tone: "muted" };
  }
  if (!coupon.active) {
    return { label: "ปิดใช้งาน", tone: "warning" };
  }
  return { label: "ใช้งานอยู่", tone: "success" };
}

export function CouponManager({ seller }: { seller: User }) {
  const coupons = useSellerCoupons(seller.id);
  const setCouponActive = useShopStore((state) => state.setCouponActive);
  const deleteCoupon = useShopStore((state) => state.deleteCoupon);
  const now = new Date().toISOString();

  return (
    <>
      <PageTitle
        title="คูปองส่วนลด"
        description="ผู้ซื้อใช้โค้ดของร้านได้ที่หน้าทำการสั่งซื้อ"
        action={
          <CouponDialog
            coupon={null}
            label="สร้างคูปอง"
            trigger={<Button size="lg" className="h-9" />}
          />
        }
      />
      {coupons.length === 0 ? (
        <div className="rounded-lg bg-white">
          <EmptyState icon={TicketPercent} title="ยังไม่มีคูปอง" />
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {coupons.map((coupon) => {
            const state = couponState(coupon, now);
            const used = coupon.usedBy.length;
            return (
              <article
                key={coupon.id}
                className="flex overflow-hidden rounded-lg bg-white shadow-xs ring-1 ring-black/5"
              >
                <div className="flex w-24 shrink-0 flex-col items-center justify-center gap-1 border-primary/40 border-r-2 border-dashed bg-secondary p-3 text-primary">
                  <TicketPercent className="size-7" />
                  <span className="text-center font-semibold text-xs">
                    {describeCoupon(coupon)}
                  </span>
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-mono font-semibold">{coupon.code}</p>
                      <p className="text-muted-foreground text-xs">
                        ขั้นต่ำ {formatPrice(coupon.minSpend)} ใช้ได้ถึง{" "}
                        {formatDate(coupon.expiresAt)}
                      </p>
                    </div>
                    <StatusBadge tone={state.tone}>{state.label}</StatusBadge>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                      <span
                        className="block h-full rounded-full bg-primary"
                        style={{
                          width: `${Math.min(100, (used / coupon.usageLimit) * 100)}%`,
                        }}
                      />
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      ใช้แล้ว {used}/{coupon.usageLimit}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <label className="flex items-center gap-2 text-sm">
                      <Switch
                        checked={coupon.active}
                        onCheckedChange={(checked) =>
                          setCouponActive(coupon.id, checked)
                        }
                        aria-label={`เปิดใช้งาน ${coupon.code}`}
                      />
                      เปิดใช้งาน
                    </label>
                    <div className="flex gap-1">
                      <CouponDialog
                        coupon={coupon}
                        label="แก้ไข"
                        trigger={<Button variant="ghost" size="sm" />}
                      />
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label={`ลบ ${coupon.code}`}
                        onClick={() => {
                          deleteCoupon(coupon.id);
                          toast.success(`ลบคูปอง ${coupon.code} แล้ว`);
                        }}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </>
  );
}
