import Image from "next/image";
import type { Payment } from "@/types";
import { formatDateTime } from "@/utils";
import { SlipCheckList } from "./SlipCheckList";

export function SlipReceipt({ payment }: { payment: Payment }) {
  return (
    <div className="@container">
      <div className="grid @md:grid-cols-[9rem_1fr] gap-4">
        {payment.slipImage ? (
          <a
            href={payment.slipImage}
            target="_blank"
            rel="noreferrer"
            className="relative block aspect-[3/5] w-36 overflow-hidden rounded-md border bg-muted"
          >
            <Image
              src={payment.slipImage}
              alt="สลิปโอนเงิน"
              fill
              unoptimized
              className="object-contain"
            />
          </a>
        ) : null}
        <div className="flex flex-col gap-3">
          <p className="text-muted-foreground text-xs">
            ส่งสลิปเมื่อ {formatDateTime(payment.submittedAt)}
          </p>
          <SlipCheckList check={payment.check} />
        </div>
      </div>
    </div>
  );
}
