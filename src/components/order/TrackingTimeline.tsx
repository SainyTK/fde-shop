import { cn } from "@/lib";
import type { Order } from "@/types";
import { formatDateTime } from "@/utils";

type TimelineEntry = {
  at: string;
  title: string;
  detail: string;
};

function entriesFor(order: Order): TimelineEntry[] {
  const orderEntries = order.events.map((event) => ({
    at: event.at,
    title: event.note,
    detail: "",
  }));
  const shipmentEntries =
    order.shipment?.events.map((event) => ({
      at: event.at,
      title: event.description,
      detail: event.location,
    })) ?? [];
  return [...orderEntries, ...shipmentEntries].sort((a, b) =>
    b.at.localeCompare(a.at),
  );
}

export function TrackingTimeline({ order }: { order: Order }) {
  const entries = entriesFor(order);
  return (
    <ol className="flex flex-col">
      {entries.map((entry, index) => (
        <li
          key={`${entry.at}-${entry.title}`}
          className="relative grid grid-cols-[7.5rem_1fr] gap-4 pb-5 last:pb-0 sm:grid-cols-[9rem_1fr]"
        >
          <span className="pt-0.5 text-right text-muted-foreground text-xs sm:text-sm">
            {formatDateTime(entry.at)}
          </span>
          <div className="relative pl-5">
            <span
              aria-hidden
              className={cn(
                "absolute top-1.5 left-0 size-2.5 rounded-full",
                index === 0
                  ? "bg-success ring-4 ring-success/20"
                  : "bg-muted-foreground/40",
              )}
            />
            {index < entries.length - 1 ? (
              <span
                aria-hidden
                className="absolute top-4 bottom-[-1.25rem] left-[4.5px] w-px bg-border"
              />
            ) : null}
            <p
              className={cn(
                "text-sm",
                index === 0 ? "font-medium text-success" : "",
              )}
            >
              {entry.title}
            </p>
            {entry.detail ? (
              <p className="text-muted-foreground text-xs">{entry.detail}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  );
}
