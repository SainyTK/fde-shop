"use client";

import { Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Panel } from "@/components/common";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useSlipVerification } from "@/hooks";
import { useShopStore } from "@/store";
import type { Order, Shop } from "@/types";
import { slipBlockingReason } from "@/utils";
import { DemoSlipDialog } from "./DemoSlipDialog";
import { PromptPayCard } from "./PromptPayCard";
import { SlipCheckList } from "./SlipCheckList";
import { SlipDropzone } from "./SlipDropzone";

const STEP_LABEL = {
  qr: "กำลังอ่าน QR บนสลิป",
  ocr: "กำลังอ่านยอดเงินบนสลิป",
};

type PaymentPanelProps = {
  order: Order;
  shop: Shop;
};

export function PaymentPanel({ order, shop }: PaymentPanelProps) {
  const { state, verify, reset } = useSlipVerification(order);
  const submitPayment = useShopStore((store) => store.submitPayment);
  const lastRejection = order.rejectedPayments.at(-1)?.review;
  const blocking =
    state.phase === "checked" ? slipBlockingReason(state.check) : null;

  const submit = () => {
    if (state.phase !== "checked") {
      return;
    }
    const result = submitPayment(order.id, state.image, state.check);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("ส่งสลิปเรียบร้อย รอผู้ขายยืนยัน");
    reset();
  };

  return (
    <Panel title="ชำระเงินด้วยการโอนผ่านพร้อมเพย์">
      <div className="grid gap-5 md:grid-cols-[16rem_1fr]">
        <PromptPayCard shop={shop} amount={order.total} />
        <div className="flex min-w-0 flex-col gap-4">
          {lastRejection ? (
            <Alert variant="destructive">
              <AlertTitle>สลิปก่อนหน้าไม่ผ่านการตรวจสอบ</AlertTitle>
              <AlertDescription>{lastRejection.reason}</AlertDescription>
            </Alert>
          ) : null}
          <ol className="list-decimal space-y-1 pl-5 text-muted-foreground text-sm">
            <li>สแกน QR ด้วยแอปธนาคาร ยอดเงินจะถูกกรอกให้อัตโนมัติ</li>
            <li>บันทึกสลิปหลังโอนสำเร็จ แล้วอัปโหลดที่นี่</li>
            <li>ระบบตรวจ QR บนสลิป เลขอ้างอิงซ้ำ และยอดเงิน ก่อนส่งให้ผู้ขายยืนยัน</li>
          </ol>
          {state.phase === "idle" || state.phase === "error" ? (
            <>
              <SlipDropzone onFile={verify} />
              {state.phase === "error" ? (
                <p className="text-destructive text-sm">{state.message}</p>
              ) : null}
              <DemoSlipDialog order={order} shop={shop} onUse={verify} />
            </>
          ) : (
            <div className="grid gap-4 sm:grid-cols-[8rem_1fr]">
              <div className="relative aspect-[3/5] w-32 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={state.image}
                  alt="สลิปที่อัปโหลด"
                  fill
                  unoptimized
                  className="object-contain"
                />
              </div>
              {state.phase === "scanning" ? (
                <div className="flex items-center gap-2 self-center text-sm">
                  <Loader2 className="size-4 animate-spin text-primary" />
                  {STEP_LABEL[state.step]}
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <SlipCheckList check={state.check} />
                  {blocking ? (
                    <p className="font-medium text-destructive text-sm">
                      {blocking}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" onClick={reset}>
                      เลือกสลิปใหม่
                    </Button>
                    <Button onClick={submit} disabled={blocking !== null}>
                      ส่งสลิปให้ร้านค้า
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
