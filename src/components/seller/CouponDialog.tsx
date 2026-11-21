"use client";

import type { ReactElement } from "react";
import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useShopStore } from "@/store";
import type { Coupon } from "@/types";
import { CouponForm } from "./CouponForm";

type CouponDialogProps = {
  coupon: Coupon | null;
  trigger: ReactElement;
  label: string;
};

export function CouponDialog({ coupon, trigger, label }: CouponDialogProps) {
  const saveCoupon = useShopStore((state) => state.saveCoupon);
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}>{label}</DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {coupon ? `แก้ไขคูปอง ${coupon.code}` : "สร้างคูปองส่วนลด"}
          </DialogTitle>
        </DialogHeader>
        <CouponForm
          coupon={coupon}
          onSubmit={(input) => {
            const result = saveCoupon(coupon?.id ?? null, input);
            if (!result.ok) {
              toast.error(result.error);
              return;
            }
            toast.success(coupon ? "บันทึกคูปองแล้ว" : "สร้างคูปองแล้ว");
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
