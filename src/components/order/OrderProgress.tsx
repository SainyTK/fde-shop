import {
  CircleDollarSign,
  type LucideIcon,
  PackageCheck,
  ReceiptText,
  Star,
  Truck,
} from "lucide-react";
import { FULFILMENT_STEPS } from "@/constants";
import { cn } from "@/lib";
import type { Order, OrderStatus } from "@/types";
import { formatDateTime, statusReachedAt } from "@/utils";

const ICONS: Record<string, LucideIcon> = {
  awaiting_payment: ReceiptText,
  paid: CircleDollarSign,
  packed: PackageCheck,
  shipped: Truck,
  delivered: Star,
};

const RANK: Record<OrderStatus, number> = {
  awaiting_payment: 0,
  payment_review: 0,
  paid: 1,
  packed: 2,
  shipped: 3,
  delivered: 4,
  cancelled: -1,
};

export function OrderProgress({ order }: { order: Order }) {
  const reached = RANK[order.status];
  return (
    <ol className="grid grid-cols-5">
      {FULFILMENT_STEPS.map((step, index) => {
        const Icon = ICONS[step.status];
        const done = index <= reached;
        const at =
          step.status === "awaiting_payment"
            ? order.createdAt
            : statusReachedAt(order, step.status);
        return (
          <li
            key={step.status}
            className="relative flex flex-col items-center gap-2 text-center"
          >
            {index > 0 ? (
              <span
                aria-hidden
                className={cn(
                  "absolute top-5 right-1/2 h-1 w-full -translate-y-1/2 sm:top-7",
                  done ? "bg-success" : "bg-muted",
                )}
              />
            ) : null}
            <span
              className={cn(
                "relative z-10 flex size-10 items-center justify-center rounded-full border-4 bg-white sm:size-14",
                done
                  ? "border-success text-success"
                  : "border-muted text-muted-foreground",
              )}
            >
              <Icon className="size-4 sm:size-6" />
            </span>
            <span
              className={cn(
                "text-[11px] sm:text-sm",
                done ? "font-medium" : "text-muted-foreground",
              )}
            >
              {step.label}
            </span>
            {done && at ? (
              <span className="hidden text-muted-foreground text-xs sm:block">
                {formatDateTime(at)}
              </span>
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
