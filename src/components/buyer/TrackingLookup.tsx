"use client";

import { PackageSearch, Search, Truck } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { EmptyState, Panel } from "@/components/common";
import {
  OrderProgress,
  OrderStatusBadge,
  ShipmentSummary,
  TrackingTimeline,
} from "@/components/order";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopStore } from "@/store";

export function TrackingLookup() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const query = (params.get("no") ?? "").trim().toUpperCase();
  const [text, setText] = useState(query);
  const order = useShopStore((state) =>
    query
      ? state.data.orders.find(
          (item) =>
            item.shipment?.trackingNumber === query ||
            item.number === query.replace(/^#/, ""),
        )
      : undefined,
  );

  const submit = (event: FormEvent) => {
    event.preventDefault();
    router.replace(`${pathname}?no=${encodeURIComponent(text.trim())}`);
  };

  return (
    <div className="flex flex-col gap-3">
      <Panel>
        <form
          onSubmit={submit}
          className="flex flex-col gap-3 sm:flex-row sm:items-center"
        >
          <Truck className="hidden size-8 text-primary sm:block" />
          <Input
            aria-label="เลขพัสดุหรือหมายเลขคำสั่งซื้อ"
            placeholder="กรอกเลขพัสดุ หรือหมายเลขคำสั่งซื้อ"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="h-11 flex-1"
          />
          <Button type="submit" size="lg" className="h-11 px-8">
            <Search />
            ติดตามพัสดุ
          </Button>
        </form>
      </Panel>
      {query && !order ? (
        <div className="rounded-sm bg-white">
          <EmptyState
            icon={PackageSearch}
            title="ไม่พบพัสดุ"
            description={`ไม่พบข้อมูลของ ${query} ตรวจสอบเลขอีกครั้ง`}
          />
        </div>
      ) : null}
      {order ? (
        <>
          <Panel
            title={`คำสั่งซื้อ #${order.number}`}
            action={<OrderStatusBadge status={order.status} />}
          >
            <OrderProgress order={order} />
          </Panel>
          <Panel title="สถานะการจัดส่ง">
            <div className="flex flex-col gap-4">
              {order.shipment ? (
                <ShipmentSummary shipment={order.shipment} />
              ) : null}
              <p className="text-muted-foreground text-sm">
                ปลายทาง: {order.address.district}, {order.address.province}
              </p>
              <TrackingTimeline order={order} />
            </div>
          </Panel>
        </>
      ) : null}
    </div>
  );
}
