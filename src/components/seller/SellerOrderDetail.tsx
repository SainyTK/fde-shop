"use client";

import { ChevronLeft, ReceiptText } from "lucide-react";
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
import { SlipReceipt } from "@/components/payment";
import { useOrder, useUser } from "@/hooks";
import type { User } from "@/types";
import { formatDateTime } from "@/utils";
import { FulfilmentActions } from "./FulfilmentActions";
import { SlipReviewPanel } from "./SlipReviewPanel";
import { TrackingUpdateForm } from "./TrackingUpdateForm";

export function SellerOrderDetail({
  seller,
  orderId,
}: {
  seller: User;
  orderId: string;
}) {
  const order = useOrder(orderId);
  const buyer = useUser(order?.buyerId ?? null);
  if (!order || order.sellerId !== seller.id || !seller.shop) {
    return <EmptyState icon={ReceiptText} title="ไม่พบคำสั่งซื้อนี้" />;
  }
  const approvedSlip =
    order.payment?.review?.decision === "approved" && order.payment.slipImage
      ? order.payment
      : null;

  return (
    <>
      <Link
        href="/seller/orders"
        className="flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        คำสั่งซื้อ
      </Link>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-xl">คำสั่งซื้อ #{order.number}</h1>
          <p className="text-muted-foreground text-sm">
            สั่งเมื่อ {formatDateTime(order.createdAt)} โดย {buyer?.name}
          </p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>
      {order.status !== "cancelled" ? (
        <Panel>
          <OrderProgress order={order} />
        </Panel>
      ) : null}
      {order.status === "payment_review" && order.payment ? (
        <SlipReviewPanel order={order} payment={order.payment} />
      ) : null}
      <div className="grid gap-5 lg:grid-cols-[1fr_24rem]">
        <div className="flex flex-col gap-5">
          <Panel title="สินค้า">
            <div className="flex flex-col gap-4">
              <OrderItems items={order.items} />
              <OrderAmounts order={order} />
              {order.note ? (
                <p className="rounded-sm bg-muted/60 p-2 text-sm">
                  ข้อความจากผู้ซื้อ: {order.note}
                </p>
              ) : null}
              <FulfilmentActions order={order} shop={seller.shop} />
            </div>
          </Panel>
          <Panel title="การจัดส่ง">
            <div className="flex flex-col gap-4">
              {order.shipment ? (
                <ShipmentSummary shipment={order.shipment} />
              ) : null}
              {order.status === "shipped" ? (
                <TrackingUpdateForm order={order} />
              ) : null}
              <TrackingTimeline order={order} />
            </div>
          </Panel>
        </div>
        <div className="flex flex-col gap-5">
          <Panel title="ที่อยู่จัดส่ง">
            <AddressBlock address={order.address} />
          </Panel>
          {approvedSlip ? (
            <Panel title="สลิปที่อนุมัติแล้ว">
              <SlipReceipt payment={approvedSlip} />
            </Panel>
          ) : null}
          {order.rejectedPayments.length > 0 ? (
            <Panel title="สลิปที่ไม่อนุมัติ">
              <ul className="flex flex-col gap-4">
                {order.rejectedPayments.map((payment) => (
                  <li key={payment.submittedAt} className="flex flex-col gap-2">
                    <p className="text-destructive text-sm">
                      เหตุผล: {payment.review?.reason}
                    </p>
                    <SlipReceipt payment={payment} />
                  </li>
                ))}
              </ul>
            </Panel>
          ) : null}
        </div>
      </div>
    </>
  );
}
