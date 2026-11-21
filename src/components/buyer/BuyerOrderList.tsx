"use client";

import { Package, Store } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { EmptyState } from "@/components/common";
import { OrderListCard, OrderTabs } from "@/components/order";
import { BUYER_ORDER_TABS } from "@/constants";
import { useOrdersFor } from "@/hooks";
import { useShopStore } from "@/store";
import type { User } from "@/types";

export function BuyerOrderList({ buyer }: { buyer: User }) {
  const orders = useOrdersFor("buyer", buyer.id);
  const users = useShopStore((state) => state.data.users);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const tab =
    BUYER_ORDER_TABS.find((item) => item.id === params.get("tab")) ??
    BUYER_ORDER_TABS[0];
  const shown = tab.statuses.length
    ? orders.filter((order) => tab.statuses.includes(order.status))
    : orders;

  return (
    <div className="flex flex-col gap-3">
      <OrderTabs
        tabs={BUYER_ORDER_TABS}
        active={tab.id}
        orders={orders}
        className="top-[60px] md:top-[108px]"
        onChange={(id) =>
          router.replace(id === "all" ? pathname : `${pathname}?tab=${id}`, {
            scroll: false,
          })
        }
      />
      {shown.length === 0 ? (
        <div className="rounded-sm bg-white">
          <EmptyState icon={Package} title="ยังไม่มีคำสั่งซื้อ" />
        </div>
      ) : (
        shown.map((order) => (
          <OrderListCard
            key={order.id}
            order={order}
            href={`/orders/${order.id}`}
            heading={
              <>
                <Store className="size-4 shrink-0" />
                <span className="truncate font-medium text-sm">
                  {users.find((user) => user.id === order.sellerId)?.shop?.name}
                </span>
              </>
            }
          />
        ))
      )}
    </div>
  );
}
