"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EmptyState } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useCartGroups } from "@/hooks";
import { useShopStore } from "@/store";
import { cartLineProblem, formatPrice, itemsSubtotal } from "@/utils";
import { CartShopGroup } from "./CartShopGroup";

export function CartView() {
  const groups = useCartGroups();
  const router = useRouter();
  const setCartSelected = useShopStore((state) => state.setCartSelected);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const items = groups.flatMap((group) => group.items);
  const valid = items.filter((item) => cartLineProblem(item) === null);
  const chosen = valid.filter((item) => item.line.selected);
  const allSelected = valid.length > 0 && chosen.length === valid.length;

  if (items.length === 0) {
    return (
      <div className="rounded-sm bg-white">
        <EmptyState
          icon={ShoppingCart}
          title="ยังไม่มีสินค้าในตะกร้า"
          action={
            <Button nativeButton={false} render={<Link href="/" />}>
              ไปช้อปเลย
            </Button>
          }
        />
      </div>
    );
  }

  const checkout = () => {
    if (chosen.length === 0) {
      toast.error("กรุณาเลือกสินค้าอย่างน้อย 1 รายการ");
      return;
    }
    const blocked = items.find(
      (item) => item.line.selected && cartLineProblem(item) !== null,
    );
    if (blocked) {
      toast.error(`${blocked.product.name}: ${cartLineProblem(blocked)}`);
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="flex flex-col gap-3 pb-20 md:pb-0">
      <div className="hidden grid-cols-[auto_5rem_1fr_8rem_8rem_6rem_4rem] items-center gap-3 rounded-sm bg-white px-5 py-3 text-muted-foreground text-sm shadow-xs ring-1 ring-black/5 sm:grid">
        <span className="size-4" />
        <span className="col-span-2 text-foreground">สินค้า</span>
        <span className="text-center">ราคาต่อชิ้น</span>
        <span className="text-center">จำนวน</span>
        <span className="text-center">ราคารวม</span>
        <span className="text-center">แอคชัน</span>
      </div>
      {groups.map((group) => (
        <CartShopGroup key={group.seller.id} group={group} />
      ))}
      <div className="fixed inset-x-0 bottom-[57px] z-30 border-t bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.06)] md:sticky md:bottom-0 md:rounded-sm md:border-0 md:ring-1 md:ring-black/5">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 md:px-5 md:py-4">
          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={allSelected}
              onCheckedChange={(checked) =>
                setCartSelected(
                  valid.map((item) => item.product.id),
                  checked === true,
                )
              }
            />
            เลือกทั้งหมด ({valid.length})
          </label>
          <button
            type="button"
            className="hidden text-sm hover:text-primary sm:block"
            onClick={() =>
              removeFromCart(chosen.map((item) => item.product.id))
            }
          >
            ลบที่เลือก
          </button>
          <div className="ml-auto text-right text-sm">
            <span className="hidden sm:inline">
              รวม ({chosen.reduce((sum, item) => sum + item.line.quantity, 0)}{" "}
              สินค้า):{" "}
            </span>
            <span className="font-medium text-lg text-primary sm:text-2xl">
              {formatPrice(itemsSubtotal(chosen))}
            </span>
          </div>
          <Button size="lg" className="h-10 px-6 sm:px-12" onClick={checkout}>
            สั่งสินค้า
          </Button>
        </div>
      </div>
    </div>
  );
}
