"use client";

import { PackageCheck } from "lucide-react";
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
import type { Order, Shop } from "@/types";
import { SELLER_CANCELLABLE } from "@/utils";
import { ShipDialog } from "./ShipDialog";

export function FulfilmentActions({
  order,
  shop,
}: {
  order: Order;
  shop: Shop;
}) {
  const packOrder = useShopStore((state) => state.packOrder);
  const markDelivered = useShopStore((state) => state.markDelivered);
  const cancelOrder = useShopStore((state) => state.cancelOrder);

  const report = (result: { ok: boolean; error?: string }, message: string) => {
    if (result.ok) {
      toast.success(message);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {SELLER_CANCELLABLE.includes(order.status) ? (
        <AlertDialog>
          <AlertDialogTrigger render={<Button variant="outline" />}>
            ยกเลิกคำสั่งซื้อ
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>ยกเลิกคำสั่งซื้อ #{order.number}?</AlertDialogTitle>
              <AlertDialogDescription>
                สินค้าจะถูกคืนเข้าสต็อกและบันทึกในประวัติความเคลื่อนไหวของสต็อก
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ไม่ยกเลิก</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  report(
                    cancelOrder(order.id, "ร้านค้ายกเลิกคำสั่งซื้อ", "seller"),
                    "ยกเลิกคำสั่งซื้อแล้ว",
                  )
                }
              >
                ยืนยันการยกเลิก
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}
      {order.status === "paid" ? (
        <Button onClick={() => report(packOrder(order.id), "เตรียมพัสดุเรียบร้อย")}>
          <PackageCheck />
          เตรียมพัสดุเรียบร้อย
        </Button>
      ) : null}
      {order.status === "packed" ? (
        <ShipDialog order={order} shop={shop} />
      ) : null}
      {order.status === "shipped" ? (
        <Button
          onClick={() =>
            report(markDelivered(order.id, "seller"), "บันทึกว่าจัดส่งสำเร็จแล้ว")
          }
        >
          จัดส่งสำเร็จ
        </Button>
      ) : null}
    </div>
  );
}
