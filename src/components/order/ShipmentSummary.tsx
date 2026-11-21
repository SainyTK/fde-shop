import { Truck } from "lucide-react";
import type { Shipment } from "@/types";

export function ShipmentSummary({ shipment }: { shipment: Shipment }) {
  return (
    <div className="flex items-center gap-3 rounded-md bg-muted/60 p-3 text-sm">
      <Truck className="size-5 shrink-0 text-success" />
      <div className="min-w-0">
        <p className="font-medium">{shipment.carrier}</p>
        <p className="font-mono text-muted-foreground">
          {shipment.trackingNumber}
        </p>
      </div>
    </div>
  );
}
