"use client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Panel } from "@/components/common";
import { SlipReceipt } from "@/components/payment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useShopStore } from "@/store";
import type { Order, Payment } from "@/types";

export function SlipReviewPanel({
  order,
  payment,
}: {
  order: Order;
  payment: Payment;
}) {
  const reviewPayment = useShopStore((state) => state.reviewPayment);
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  const decide = (decision: "approved" | "rejected") => {
    if (decision === "rejected" && reason.trim().length < 3) {
      toast.error("กรุณาระบุเหตุผลที่ไม่อนุมัติ");
      return;
    }
    const result = reviewPayment(order.id, decision, reason.trim());
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(
      decision === "approved" ? "ยืนยันการชำระเงินแล้ว" : "แจ้งผู้ซื้อให้ส่งสลิปใหม่แล้ว",
    );
  };

  return (
    <Panel
      title={
        <span className="flex items-center gap-2">
          {payment.check.passed ? (
            <ShieldCheck className="size-4 text-success" />
          ) : (
            <ShieldAlert className="size-4 text-warning" />
          )}
          ตรวจสอบสลิปการชำระเงิน
        </span>
      }
    >
      <div className="flex flex-col gap-4">
        <SlipReceipt payment={payment} />
        {rejecting ? (
          <div className="flex flex-col gap-2">
            <Textarea
              aria-label="เหตุผลที่ไม่อนุมัติ"
              placeholder="เช่น ยอดเงินไม่ครบ หรือไม่พบรายการเงินเข้าบัญชี"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setRejecting(false)}>
                ยกเลิก
              </Button>
              <Button variant="destructive" onClick={() => decide("rejected")}>
                ยืนยันไม่อนุมัติ
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap justify-end gap-2">
            <Button variant="outline" onClick={() => setRejecting(true)}>
              สลิปไม่ถูกต้อง
            </Button>
            <Button onClick={() => decide("approved")}>ยืนยันการชำระเงิน</Button>
          </div>
        )}
      </div>
    </Panel>
  );
}
