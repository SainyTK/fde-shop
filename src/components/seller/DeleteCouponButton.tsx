"use client";

import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store";
import type { Coupon } from "@/types";

export function DeleteCouponButton({ coupon }: { coupon: Coupon }) {
  const deleteCoupon = useShopStore((state) => state.deleteCoupon);
  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`ลบ ${coupon.code}`}
          />
        }
      >
        <Trash2 />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>ลบคูปอง {coupon.code}?</AlertDialogTitle>
          <AlertDialogDescription>
            ผู้ซื้อจะใช้โค้ดนี้ไม่ได้อีก คำสั่งซื้อที่ใช้โค้ดไปแล้วไม่เปลี่ยนแปลง
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              deleteCoupon(coupon.id);
              toast.success(`ลบคูปอง ${coupon.code} แล้ว`);
            }}
          >
            ลบคูปอง
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
