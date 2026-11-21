import Link from "next/link";
import type { ReactNode } from "react";
import type { Order } from "@/types";
import { formatDateTime, formatPrice } from "@/utils";
import { OrderItems } from "./OrderItems";
import { OrderStatusBadge } from "./OrderStatusBadge";

type OrderListCardProps = {
  order: Order;
  href: string;
  heading: ReactNode;
};

export function OrderListCard({ order, href, heading }: OrderListCardProps) {
  const latest = order.events.at(-1);
  return (
    <article className="rounded-sm bg-white shadow-xs ring-1 ring-black/5">
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">{heading}</div>
        <div className="flex items-center gap-2 text-sm">
          {latest ? (
            <span className="hidden text-success sm:inline">{latest.note}</span>
          ) : null}
          <OrderStatusBadge status={order.status} />
        </div>
      </header>
      <Link
        href={href}
        className="block px-4 py-3 transition-colors hover:bg-muted/30"
      >
        <OrderItems items={order.items} />
      </Link>
      <footer className="flex flex-wrap items-center justify-between gap-2 border-t bg-[#fffefb] px-4 py-3">
        <span className="text-muted-foreground text-xs">
          #{order.number} สั่งเมื่อ {formatDateTime(order.createdAt)}
        </span>
        <span className="text-sm">
          ยอดคำสั่งซื้อทั้งหมด{" "}
          <span className="ml-1 font-medium text-lg text-primary">
            {formatPrice(order.total)}
          </span>
        </span>
      </footer>
    </article>
  );
}
