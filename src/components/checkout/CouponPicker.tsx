"use client";

import { TicketPercent } from "lucide-react";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSellerCoupons } from "@/hooks";
import { cn } from "@/lib";
import {
  checkCoupon,
  describeCoupon,
  formatDate,
  formatPrice,
  normalizeCouponCode,
} from "@/utils";

type CouponPickerProps = {
  buyerId: string;
  sellerId: string;
  subtotal: number;
  selected: string | null;
  onSelect: (code: string | null) => void;
};

export function CouponPicker({
  buyerId,
  sellerId,
  subtotal,
  selected,
  onSelect,
}: CouponPickerProps) {
  const coupons = useSellerCoupons(sellerId);
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const now = useMemo(() => new Date().toISOString(), []);
  const listed = useMemo(
    () =>
      coupons
        .filter((coupon) => coupon.active)
        .map((coupon) => ({
          coupon,
          check: checkCoupon(coupon, { buyerId, sellerId, subtotal, now }),
        }))
        .sort((a, b) => Number(b.check.ok) - Number(a.check.ok)),
    [coupons, buyerId, sellerId, subtotal, now],
  );

  const apply = () => {
    const normalized = normalizeCouponCode(code);
    const coupon = coupons.find((item) => item.code === normalized);
    if (!coupon) {
      setError("ไม่พบโค้ดนี้ในร้านค้านี้");
      return;
    }
    const check = checkCoupon(coupon, { buyerId, sellerId, subtotal, now });
    if (!check.ok) {
      setError(check.reason);
      return;
    }
    onSelect(coupon.code);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setError(null);
        setCode("");
      }}
    >
      <DialogTrigger
        render={<Button variant="link" size="sm" className="h-auto px-0" />}
      >
        {selected ? "เปลี่ยนโค้ด" : "เลือกโค้ด"}
      </DialogTrigger>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>โค้ดส่วนลดของร้าน</DialogTitle>
          <DialogDescription>
            ยอดสินค้าจากร้านนี้ {formatPrice(subtotal)}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2">
          <Input
            aria-label="กรอกโค้ดส่วนลด"
            placeholder="กรอกโค้ดส่วนลด"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            className="uppercase"
          />
          <Button onClick={apply} disabled={!code.trim()}>
            ใช้โค้ด
          </Button>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <ul className="flex flex-col gap-2">
          {listed.map(({ coupon, check }) => (
            <li key={coupon.id}>
              <button
                type="button"
                disabled={!check.ok}
                onClick={() => {
                  onSelect(coupon.code);
                  setOpen(false);
                }}
                className={cn(
                  "flex w-full items-stretch overflow-hidden rounded-md text-left ring-1 transition",
                  selected === coupon.code
                    ? "ring-2 ring-primary"
                    : "ring-border hover:ring-primary/60",
                  !check.ok && "opacity-60",
                )}
              >
                <span className="flex w-20 shrink-0 flex-col items-center justify-center gap-1 bg-primary p-2 text-white">
                  <TicketPercent className="size-6" />
                  <span className="font-mono text-[10px]">{coupon.code}</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5 p-3 text-sm">
                  <span className="font-medium">{describeCoupon(coupon)}</span>
                  <span className="text-muted-foreground text-xs">
                    ขั้นต่ำ {formatPrice(coupon.minSpend)} ใช้ได้ถึง{" "}
                    {formatDate(coupon.expiresAt)}
                  </span>
                  {check.ok ? (
                    <span className="text-success text-xs">
                      ลดได้ {formatPrice(check.discount)}
                    </span>
                  ) : (
                    <span className="text-destructive text-xs">
                      {check.reason}
                    </span>
                  )}
                </span>
              </button>
            </li>
          ))}
        </ul>
        {selected ? (
          <Button
            variant="outline"
            onClick={() => {
              onSelect(null);
              setOpen(false);
            }}
          >
            ไม่ใช้โค้ด
          </Button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
