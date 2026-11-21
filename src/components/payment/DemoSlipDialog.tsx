"use client";

import { Download, FlaskConical } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { BANKS, DEMO_SLIP_BANK } from "@/constants";
import { useCurrentUser } from "@/hooks";
import { dataUrlToFile, downloadDataUrl, renderDemoSlip } from "@/services";
import type { Order, Shop } from "@/types";
import {
  buildSlipPayload,
  createRandom,
  createTransRef,
  formatAmount,
  formatDateTime,
  randomDigits,
} from "@/utils";

type DemoSlipDialogProps = {
  order: Order;
  shop: Shop;
  onUse: (file: File) => void;
};

export function DemoSlipDialog({ order, shop, onUse }: DemoSlipDialogProps) {
  const buyer = useCurrentUser();
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState(String(order.total));
  const [slip, setSlip] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const generate = async () => {
    setPending(true);
    const now = new Date().toISOString();
    const transRef = createTransRef(
      now,
      randomDigits(createRandom(Date.now()), 11),
    );
    const image = await renderDemoSlip({
      bankName: BANKS[DEMO_SLIP_BANK],
      bankColor: "#138f2d",
      senderName: buyer?.name ?? "ผู้ซื้อ",
      receiverName: shop.bankAccountName,
      receiverAccount: `พร้อมเพย์ xxx-xxx-${shop.promptPayId.slice(-4)}`,
      amount: formatAmount(Number(amount) || 0),
      fee: formatAmount(0),
      dateTime: formatDateTime(now),
      transRef,
      qrPayload: buildSlipPayload({ bankCode: DEMO_SLIP_BANK, transRef }),
      disclaimer: "สลิปจำลองสำหรับทดสอบระบบ FDE Shop",
    });
    setSlip(image);
    setPending(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        setSlip(null);
      }}
    >
      <DialogTrigger
        render={<Button variant="link" size="sm" className="h-auto px-0" />}
      >
        <FlaskConical />
        ยังไม่มีสลิป? สร้างสลิปทดลอง
      </DialogTrigger>
      <DialogContent className="max-h-[92dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>สร้างสลิปทดลอง</DialogTitle>
          <DialogDescription>
            สลิปจำลองมี QR ตรวจสอบรูปแบบเดียวกับสลิปธนาคารไทย
            ลองแก้ยอดเงินเพื่อดูว่าระบบจับยอดไม่ตรงได้
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <Field id="demo-amount" label="ยอดเงินบนสลิป (บาท)">
              <Input
                id="demo-amount"
                inputMode="decimal"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
              />
            </Field>
          </div>
          <Button onClick={generate} disabled={pending}>
            สร้างสลิป
          </Button>
        </div>
        {slip ? (
          <div className="relative mx-auto aspect-[720/1180] w-56 overflow-hidden rounded-md border">
            <Image
              src={slip}
              alt="สลิปทดลอง"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        ) : null}
        {slip ? (
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => downloadDataUrl(slip, `slip-${order.number}.png`)}
            >
              <Download />
              ดาวน์โหลด
            </Button>
            <Button
              onClick={async () => {
                onUse(await dataUrlToFile(slip, `slip-${order.number}.png`));
                setOpen(false);
              }}
            >
              ใช้สลิปนี้
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
