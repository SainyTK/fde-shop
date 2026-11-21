"use client";

import { ChevronLeft, Clock, PackageSearch, Store } from "lucide-react";
import Link from "next/link";
import { EmptyState, Panel } from "@/components/common";
import {
  AddressBlock,
  OrderAmounts,
  OrderItems,
  OrderProgress,
  OrderStatusBadge,
  ShipmentSummary,
  TrackingTimeline,
} from "@/components/order";
import { PaymentPanel, SlipReceipt } from "@/components/payment";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useOrder, useUser } from "@/hooks";
import type { User } from "@/types";
import { BuyerOrderActions } from "./BuyerOrderActions";

export function BuyerOrderDetail({
  orderId,
  buyer,
}: {
  orderId: string;
  buyer: User;
}) {
  const order = useOrder(orderId);
  const seller = useUser(order?.sellerId ?? null);

  if (!order || order.buyerId !== buyer.id || !seller?.shop) {
    return (
      <div className="rounded-sm bg-white">
        <EmptyState icon={PackageSearch} title="ไม่พบคำสั่งซื้อนี้" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-sm bg-white px-4 py-3 shadow-xs ring-1 ring-black/5">
        <Link
          href="/orders"
          className="flex items-center gap-1 text-muted-foreground text-sm hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          ย้อนกลับ
        </Link>
        <div className="flex items-center gap-3 text-sm">
          <span>
            หมายเลขคำสั่งซื้อ <span className="font-medium">#{order.number}</span>
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
      </div>
      {order.status === "cancelled" ? (
        <Alert variant="destructive">
          <AlertTitle>คำสั่งซื้อถูกยกเลิก</AlertTitle>
          <AlertDescription>{order.events.at(-1)?.note}</AlertDescription>
        </Alert>
      ) : (
        <Panel>
          <OrderProgress order={order} />
        </Panel>
      )}
      {order.status === "awaiting_payment" ? (
        <PaymentPanel order={order} shop={seller.shop} />
      ) : null}
      {order.status === "payment_review" && order.payment ? (
        <Panel
          title={
            <span className="flex items-center gap-2">
              <Clock className="size-4 text-warning" />
              รอร้านค้ายืนยันการชำระเงิน
            </span>
          }
        >
          <SlipReceipt payment={order.payment} />
        </Panel>
      ) : null}
      <div className="grid gap-3 lg:grid-cols-[1fr_24rem]">
        <Panel title="ข้อมูลการจัดส่ง">
          <div className="flex flex-col gap-4">
            <AddressBlock address={order.address} />
            {order.shipment ? (
              <ShipmentSummary shipment={order.shipment} />
            ) : null}
            <TrackingTimeline order={order} />
          </div>
        </Panel>
        <Panel
          className="self-start"
          title={
            <Link
              href={`/shops/${seller.id}`}
              className="flex items-center gap-2 hover:text-primary"
            >
              <Store className="size-4" />
              {seller.shop.name}
            </Link>
          }
        >
          <div className="flex flex-col gap-4">
            <OrderItems items={order.items} />
            <OrderAmounts order={order} />
            {order.note ? (
              <p className="rounded-sm bg-muted/60 p-2 text-muted-foreground text-xs">
                ข้อความถึงร้าน: {order.note}
              </p>
            ) : null}
            <BuyerOrderActions order={order} />
          </div>
        </Panel>
      </div>
    </div>
  );
}
