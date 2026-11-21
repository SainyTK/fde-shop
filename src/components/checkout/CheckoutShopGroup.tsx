"use client";

import { Store, TicketPercent } from "lucide-react";
import { OrderItems } from "@/components/order";
import { Input } from "@/components/ui/input";
import { FREE_SHIPPING_MIN } from "@/constants";
import { type CartGroup, formatPrice, selectedItems } from "@/utils";
import { CouponPicker } from "./CouponPicker";
import type { GroupTotals } from "./checkoutTotals";

type CheckoutShopGroupProps = {
  buyerId: string;
  group: CartGroup;
  totals: GroupTotals;
  couponCode: string | null;
  note: string;
  onCouponChange: (code: string | null) => void;
  onNoteChange: (note: string) => void;
};

export function CheckoutShopGroup({
  buyerId,
  group,
  totals,
  couponCode,
  note,
  onCouponChange,
  onNoteChange,
}: CheckoutShopGroupProps) {
  const items = selectedItems(group).map(({ product, line }) => ({
    productId: product.id,
    name: product.name,
    image: product.images[0],
    price: product.price,
    quantity: line.quantity,
  }));
  return (
    <section className="rounded-sm bg-white shadow-xs ring-1 ring-black/5">
      <header className="flex items-center gap-2 border-b px-4 py-3 font-medium text-sm sm:px-5">
        <Store className="size-4" />
        {group.seller.shop?.name}
      </header>
      <div className="px-4 py-4 sm:px-5">
        <OrderItems items={items} />
      </div>
      <div className="grid gap-3 border-t border-dashed bg-[#fafdff] px-4 py-4 text-sm sm:px-5 md:grid-cols-2 md:gap-6">
        <label className="flex items-center gap-3">
          <span className="shrink-0">ข้อความถึงร้าน</span>
          <Input
            value={note}
            onChange={(event) => onNoteChange(event.target.value)}
            placeholder="(ไม่บังคับ)"
            className="bg-white"
          />
        </label>
        <dl className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-2">
          <dt className="flex items-center gap-1.5">
            <TicketPercent className="size-4 text-primary" />
            โค้ดส่วนลดร้านค้า
            {couponCode ? (
              <span className="rounded-sm border border-primary px-1 font-mono text-primary text-xs">
                {couponCode}
              </span>
            ) : null}
          </dt>
          <dd className="text-right">
            <CouponPicker
              buyerId={buyerId}
              sellerId={group.seller.id}
              subtotal={totals.subtotal}
              selected={couponCode}
              onSelect={onCouponChange}
            />
          </dd>
          {totals.couponError ? (
            <dd className="col-span-2 text-destructive text-xs">
              {totals.couponError}
            </dd>
          ) : null}
          <dt className="text-muted-foreground">ค่าจัดส่ง</dt>
          <dd className="text-right">
            {totals.shippingFee === 0 ? (
              <span className="text-success">ส่งฟรี</span>
            ) : (
              formatPrice(totals.shippingFee)
            )}
          </dd>
          {totals.shippingFee > 0 ? (
            <dd className="col-span-2 text-muted-foreground text-xs">
              ซื้ออีก {formatPrice(FREE_SHIPPING_MIN - totals.subtotal)} เพื่อรับส่งฟรี
            </dd>
          ) : null}
          {totals.discount > 0 ? (
            <>
              <dt className="text-muted-foreground">ส่วนลด</dt>
              <dd className="text-right text-primary">
                -{formatPrice(totals.discount)}
              </dd>
            </>
          ) : null}
          <dt className="font-medium">ยอดรวมร้านนี้</dt>
          <dd className="text-right font-medium text-primary">
            {formatPrice(totals.total)}
          </dd>
        </dl>
      </div>
    </section>
  );
}
