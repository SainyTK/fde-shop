"use client";

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
import type { Order } from "@/types";
import { BUYER_CANCELLABLE } from "@/utils";

export function BuyerOrderActions({ order }: { order: Order }) {
  const cancelOrder = useShopStore((state) => state.cancelOrder);
  const markDelivered = useShopStore((state) => state.markDelivered);
  const cancellable = BUYER_CANCELLABLE.includes(order.status);
  if (!cancellable && order.status !== "shipped") {
    return null;
  }
  return (
    <div className="flex flex-wrap justify-end gap-2">
      {order.status === "shipped" ? (
        <Button
          onClick={() => {
            const result = markDelivered(order.id, "buyer");
            if (result.ok) {
              toast.success("ยืนยันการรับสินค้าแล้ว ขอบคุณที่ช้อปกับเรา");
            } else {
              toast.error(result.error);
            }
          }}
        >
          ได้รับสินค้าแล้ว
        </Button>
      ) : null}
      {cancellable ? (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            ยกเลิกคำสั่งซื้อ
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยกเลิกคำสั่งซื้อ #{order.number}?</AlertDialogTitle>
              <AlertDialogDescription>
                สินค้าจะถูกคืนเข้าสต็อกของร้าน และโค้ดส่วนลดที่ใช้จะกลับมาใช้ได้อีกครั้ง
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ไม่ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  const result = cancelOrder(
                    order.id,
                    "ผู้ซื้อยกเลิกคำสั่งซื้อ",
                    "buyer",
                  );
                  if (result.ok) {
                    toast.success("ยกเลิกคำสั่งซื้อแล้ว");
                  } else {
                    toast.error(result.error);
                  }
                }}
              >
                ยืนยันการยกเลิก
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
    </div>
  );
}
