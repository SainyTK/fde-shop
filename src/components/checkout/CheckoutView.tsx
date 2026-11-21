"use client";

import { MapPin, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AddressCard } from "@/components/account";
import { EmptyState, Panel } from "@/components/common";
import { Button } from "@/components/ui/button";
import { useCartGroups } from "@/hooks";
import { useShopStore } from "@/store";
import type { User } from "@/types";
import { formatPrice, selectedItems } from "@/utils";
import { CheckoutShopGroup } from "./CheckoutShopGroup";
import { groupTotals } from "./checkoutTotals";

export function CheckoutView({ buyer }: { buyer: User }) {
  const router = useRouter();
  const groups = useCartGroups().filter(
    (group) => selectedItems(group).length > 0,
  );
  const coupons = useShopStore((state) => state.data.coupons);
  const placeOrders = useShopStore((state) => state.placeOrders);
  const [couponCodes, setCouponCodes] = useState<Record<string, string | null>>(
    {},
  );
  const [notes, setNotes] = useState<Record<string, string>>({});
  const now = useMemo(() => new Date().toISOString(), []);

  const totals = groups.map((group) => {
    const code = couponCodes[group.seller.id] ?? null;
    const coupon =
      coupons.find(
        (item) => item.code === code && item.sellerId === group.seller.id,
      ) ?? null;
    return groupTotals(group, coupon, buyer.id, now);
  });
  const sum = (key: "subtotal" | "discount" | "shippingFee" | "total") =>
    totals.reduce((total, item) => total + item[key], 0);

  if (groups.length === 0) {
    return (
      <div className="rounded-sm bg-white">
        <EmptyState
          icon={ShoppingCart}
          title="ยังไม่ได้เลือกสินค้า"
          action={
            <Button nativeButton={false} render={<Link href="/cart" />}>
              กลับไปที่ตะกร้า
            </Button>
          }
        />
      </div>
    );
  }

  const submit = () => {
    if (!buyer.address) {
      toast.error("กรุณาเพิ่มที่อยู่จัดส่ง");
      return;
    }
    if (totals.some((item) => item.couponError)) {
      toast.error("มีโค้ดส่วนลดที่ใช้ไม่ได้ กรุณาเปลี่ยนหรือยกเลิกโค้ด");
      return;
    }
    const result = placeOrders(
      buyer.address,
      groups.map((group) => ({
        sellerId: group.seller.id,
        couponCode: couponCodes[group.seller.id] ?? null,
        note: notes[group.seller.id] ?? "",
      })),
    );
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success("สั่งซื้อสำเร็จ กรุณาชำระเงินและอัปโหลดสลิป");
    router.replace(
      result.value.length === 1
        ? `/orders/${result.value[0]}`
        : "/orders?tab=to-pay",
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Panel
        title={
          <span className="flex items-center gap-2 text-primary">
            <MapPin className="size-4" />
            ที่อยู่ในการจัดส่ง
          </span>
        }
      >
        <AddressCard user={buyer} />
      </Panel>
      {groups.map((group, index) => (
        <CheckoutShopGroup
          key={group.seller.id}
          buyerId={buyer.id}
          group={group}
          totals={totals[index]}
          couponCode={couponCodes[group.seller.id] ?? null}
          note={notes[group.seller.id] ?? ""}
          onCouponChange={(code) =>
            setCouponCodes((current) => ({
              ...current,
              [group.seller.id]: code,
            }))
          }
          onNoteChange={(note) =>
            setNotes((current) => ({ ...current, [group.seller.id]: note }))
          }
        />
      ))}
      <Panel
        title="วิธีการชำระเงิน"
        action={<span className="text-sm">โอนผ่านพร้อมเพย์ (แนบสลิป)</span>}
      >
        <dl className="ml-auto grid w-full max-w-sm grid-cols-[1fr_auto] gap-x-6 gap-y-2 text-sm">
          <dt className="text-muted-foreground">รวมค่าสินค้า</dt>
          <dd className="text-right">{formatPrice(sum("subtotal"))}</dd>
          <dt className="text-muted-foreground">รวมค่าจัดส่ง</dt>
          <dd className="text-right">{formatPrice(sum("shippingFee"))}</dd>
          <dt className="text-muted-foreground">ส่วนลดจากโค้ด</dt>
          <dd className="text-right text-primary">
            -{formatPrice(sum("discount"))}
          </dd>
          <dt className="pt-2 font-medium">ยอดชำระเงินทั้งหมด</dt>
          <dd className="pt-1 text-right font-semibold text-2xl text-primary">
            {formatPrice(sum("total"))}
          </dd>
        </dl>
        <div className="mt-4 flex flex-col items-end gap-2 border-t border-dashed pt-4">
          {groups.length > 1 ? (
            <p className="text-muted-foreground text-xs">
              ระบบจะแยกเป็น {groups.length} คำสั่งซื้อตามร้านค้า
            </p>
          ) : null}
          <Button
            size="lg"
            className="h-11 w-full px-12 sm:w-auto"
            onClick={submit}
          >
            สั่งสินค้า
          </Button>
        </div>
      </Panel>
    </div>
  );
}
