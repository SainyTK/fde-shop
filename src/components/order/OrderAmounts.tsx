import type { Order } from "@/types";
import { formatPrice } from "@/utils";

export function OrderAmounts({ order }: { order: Order }) {
  return (
    <dl className="ml-auto grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
      <dt className="text-muted-foreground">รวมค่าสินค้า</dt>
      <dd className="text-right">{formatPrice(order.subtotal)}</dd>
      <dt className="text-muted-foreground">ค่าจัดส่ง</dt>
      <dd className="text-right">
        {order.shippingFee === 0 ? "ฟรี" : formatPrice(order.shippingFee)}
      </dd>
      {order.discount > 0 ? (
        <>
          <dt className="text-muted-foreground">โค้ดส่วนลด {order.couponCode}</dt>
          <dd className="text-right text-primary">
            -{formatPrice(order.discount)}
          </dd>
        </>
      ) : null}
      <dt className="border-t pt-2 font-medium">ยอดคำสั่งซื้อทั้งหมด</dt>
      <dd className="border-t pt-2 text-right font-semibold text-primary text-xl">
        {formatPrice(order.total)}
      </dd>
    </dl>
  );
}
