"use client";

import type { OrderTab } from "@/constants";
import { cn } from "@/lib";
import type { Order } from "@/types";

type OrderTabsProps = {
  tabs: OrderTab[];
  active: string;
  orders: Order[];
  onChange: (tabId: string) => void;
  className: string;
};

export function OrderTabs({
  tabs,
  active,
  orders,
  onChange,
  className,
}: OrderTabsProps) {
  return (
    <div
      className={cn(
        "sticky z-10 flex overflow-x-auto rounded-sm bg-white shadow-xs ring-1 ring-black/5 [scrollbar-width:none]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const count = tab.statuses.length
          ? orders.filter((order) => tab.statuses.includes(order.status)).length
          : 0;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChange(tab.id)}
            className={cn(
              "flex min-w-max flex-1 items-center justify-center gap-1 border-b-2 px-4 py-3.5 text-sm transition-colors",
              active === tab.id
                ? "border-primary text-primary"
                : "border-transparent hover:text-primary",
            )}
          >
            {tab.label}
            {count > 0 ? <span className="text-xs">({count})</span> : null}
          </button>
        );
      })}
    </div>
  );
}
