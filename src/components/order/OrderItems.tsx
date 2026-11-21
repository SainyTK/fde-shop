import Image from "next/image";
import type { OrderItem } from "@/types";
import { formatPrice } from "@/utils";

export function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <ul className="divide-y">
      {items.map((item) => (
        <li
          key={item.productId}
          className="flex gap-3 py-3 first:pt-0 last:pb-0"
        >
          <span className="relative size-16 shrink-0 overflow-hidden rounded-sm border bg-white sm:size-20">
            {item.image ? (
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="80px"
                className="object-contain"
              />
            ) : null}
          </span>
          <div className="min-w-0 flex-1">
            <p className="line-clamp-2 text-sm">{item.name}</p>
            <p className="text-muted-foreground text-sm">x{item.quantity}</p>
          </div>
          <p className="shrink-0 text-sm">
            {formatPrice(item.price * item.quantity)}
          </p>
        </li>
      ))}
    </ul>
  );
}
