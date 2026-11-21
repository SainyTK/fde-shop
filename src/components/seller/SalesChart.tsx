"use client";

import { useState } from "react";
import { cn } from "@/lib";
import type { DailySales } from "@/utils";
import { formatDay, formatPrice } from "@/utils";

export function SalesChart({ data }: { data: DailySales[] }) {
  const [active, setActive] = useState<number | null>(null);
  const max = Math.max(...data.map((item) => item.revenue), 1);
  const ticks = [max, max / 2, 0];
  return (
    <figure className="flex flex-col gap-2">
      <div className="grid grid-cols-[3.5rem_1fr] gap-2">
        <div className="flex h-48 flex-col justify-between text-right text-[11px] text-muted-foreground tabular-nums">
          {ticks.map((tick) => (
            <span
              key={tick}
              className="-translate-y-1/2 first:translate-y-0 last:translate-y-0"
            >
              {tick >= 1000 ? `${Math.round(tick / 1000)}k` : Math.round(tick)}
            </span>
          ))}
        </div>
        <div className="relative h-48 border-b">
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 border-border/70 border-t border-dashed"
          />
          <div
            aria-hidden
            className="absolute inset-x-0 top-1/2 border-border/70 border-t border-dashed"
          />
          <div className="absolute inset-0 flex items-end gap-0.5 sm:gap-1">
            {data.map((item, index) => (
              <button
                key={item.day}
                type="button"
                aria-label={`${formatDay(item.day)} ยอดขาย ${formatPrice(item.revenue)} ${item.orders} คำสั่งซื้อ`}
                onMouseEnter={() => setActive(index)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(index)}
                onBlur={() => setActive(null)}
                className="group relative flex h-full flex-1 items-end"
              >
                <span
                  className={cn(
                    "w-full rounded-t-[4px] bg-primary transition-opacity",
                    active !== null && active !== index
                      ? "opacity-40"
                      : "opacity-100",
                  )}
                  style={{
                    height: `${(item.revenue / max) * 100}%`,
                    minHeight: item.revenue > 0 ? 2 : 0,
                  }}
                />
                {active === index ? (
                  <span
                    className={cn(
                      "pointer-events-none absolute bottom-full z-10 mb-1 whitespace-nowrap rounded-md bg-foreground px-2.5 py-1.5 text-left text-white text-xs shadow-lg",
                      index > data.length / 2 ? "right-0" : "left-0",
                    )}
                  >
                    <span className="block text-white/70">
                      {formatDay(item.day)}
                    </span>
                    <span className="block font-medium">
                      {formatPrice(item.revenue)}
                    </span>
                    <span className="block text-white/70">
                      {item.orders} คำสั่งซื้อ
                    </span>
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="ml-[4rem] flex justify-between text-[11px] text-muted-foreground">
        <span>{formatDay(data[0].day)}</span>
        <span>{formatDay(data[data.length - 1].day)}</span>
      </div>
    </figure>
  );
}
