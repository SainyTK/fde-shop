"use client";

import Image from "next/image";
import { useQrImage } from "@/hooks";
import { promptPayPayload } from "@/lib";
import type { Shop } from "@/types";
import { formatAmount } from "@/utils";

type PromptPayCardProps = {
  shop: Shop;
  amount: number;
};

export function PromptPayCard({ shop, amount }: PromptPayCardProps) {
  const qr = useQrImage(promptPayPayload(shop.promptPayId, amount), 240);
  return (
    <div className="flex flex-col items-center gap-3 rounded-md border p-4 text-center">
      <div className="flex w-full items-center justify-center rounded-sm bg-[#113566] py-2 font-semibold text-sm text-white tracking-wide">
        THAI QR PAYMENT
      </div>
      <div className="relative size-48 bg-white">
        {qr ? (
          <Image
            src={qr}
            alt="QR พร้อมเพย์สำหรับชำระเงิน"
            fill
            unoptimized
            className="object-contain"
          />
        ) : null}
      </div>
      <div className="text-sm">
        <p className="font-medium">{shop.bankAccountName}</p>
        <p className="text-muted-foreground">
          พร้อมเพย์ {shop.promptPayId.replace(/(\d{3})(\d{3})(\d+)/, "$1-$2-$3")}
        </p>
      </div>
      <p className="font-semibold text-2xl text-primary">
        ฿{formatAmount(amount)}
      </p>
    </div>
  );
}
