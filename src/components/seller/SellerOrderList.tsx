"use client";

import { ReceiptText } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState, PageTitle } from "@/components/common";
import { OrderListCard, OrderTabs } from "@/components/order";
import { SELLER_ORDER_TABS } from "@/constants";
import { useOrdersFor } from "@/hooks";
import { useShopStore } from "@/store";
import type { User } from "@/types";

export function SellerOrderList({ seller }: { seller: User }) {
  const orders = useOrdersFor("seller", seller.id);
  const users = useShopStore((state) => state.data.users);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab =
    SELLER_ORDER_TABS.find((item) => item.id === params.get("tab")) ??
    SELLER_ORDER_TABS[0];
  const shown = tab.statuses.length
    ? orders.filter((order) => tab.statuses.includes(order.status))
    : orders;

  return (
    <>
      <PageTitle title="คำสั่งซื้อ" />
      <div className="flex flex-col gap-3">
        <OrderTabs
          tabs={SELLER_ORDER_TABS}
          active={tab.id}
          orders={orders}
          className="top-[104px] lg:top-14"
          onChange={(id) =>
            router.replace(id === "all" ? pathname : `${pathname}?tab=${id}`, {
              scroll: false,
            })
          }
        />
        {shown.length === 0 ? (
          <div className="rounded-sm bg-white">
            <EmptyState icon={ReceiptText} title="ไม่มีคำสั่งซื้อในสถานะนี้" />
          </div>
        ) : (
          shown.map((order) => (
            <OrderListCard
              key={order.id}
              order={order}
              href={`/seller/orders/${order.id}`}
              heading={
                <span className="truncate text-sm">
                  ผู้ซื้อ{" "}
                  <span className="font-medium">
                    {users.find((user) => user.id === order.buyerId)?.name}
                  </span>
                </span>
              }
            />
          ))
        )}
      </div>
    </>
  );
}
