"use client";

import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { QuantityStepper, RatingStars } from "@/components/common";
import { Button } from "@/components/ui/button";
import { FREE_SHIPPING_MIN } from "@/constants";
import { useCurrentUser } from "@/hooks";
import { useShopStore } from "@/store";
import type { Product } from "@/types";
import {
  categoryLabel,
  discountPercent,
  formatCompact,
  formatPrice,
  shippingFeeFor,
} from "@/utils";

type PurchasePanelProps = {
  product: Product;
};

export function PurchasePanel({ product }: PurchasePanelProps) {
  const [quantity, setQuantity] = useState(1);
  const user = useCurrentUser();
  const router = useRouter();
  const addToCart = useShopStore((state) => state.addToCart);
  const buyNow = useShopStore((state) => state.buyNow);
  const discount = discountPercent(product);
  const soldOut = product.stock <= 0;

  const run = (action: "cart" | "buy") => {
    if (!user) {
      router.push(`/login?next=/products/${product.id}`);
      return;
    }
    const result =
      action === "cart"
        ? addToCart(product.id, quantity)
        : buyNow(product.id, quantity);
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    if (action === "buy") {
      router.push("/checkout");
      return;
    }
    toast.success("เพิ่มสินค้าลงตะกร้าแล้ว");
  };

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="text-muted-foreground text-xs">
          {categoryLabel(product.category)}
          {product.brand ? ` / ${product.brand}` : ""}
        </p>
        <h1 className="mt-1 font-medium text-lg leading-snug sm:text-xl">
          {product.name}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
          <span className="flex items-center gap-1 border-r pr-3">
            <span className="text-primary underline underline-offset-2">
              {product.rating.toFixed(1)}
            </span>
            <RatingStars rating={product.rating} />
          </span>
          <span className="border-r pr-3">
            <span className="underline underline-offset-2">
              {product.reviews.length}
            </span>
            <span className="ml-1 text-muted-foreground">รีวิว</span>
          </span>
          <span>
            {formatCompact(product.sold)}
            <span className="ml-1 text-muted-foreground">ขายแล้ว</span>
          </span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-sm bg-muted/70 px-4 py-3">
        {product.originalPrice ? (
          <span className="text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        ) : null}
        <span className="font-medium text-3xl text-primary">
          {formatPrice(product.price)}
        </span>
        {discount ? (
          <span className="rounded-sm bg-primary px-1.5 py-0.5 font-semibold text-white text-xs">
            ลด {discount}%
          </span>
        ) : null}
      </div>
      <dl className="grid grid-cols-[6.5rem_1fr] gap-y-4 text-sm">
        <dt className="text-muted-foreground">การจัดส่ง</dt>
        <dd>
          {shippingFeeFor(product.price) === 0 ? (
            <span className="font-medium text-success">ส่งฟรี</span>
          ) : (
            <span>
              ค่าส่ง {formatPrice(shippingFeeFor(product.price))} ส่งฟรีเมื่อซื้อครบ{" "}
              {formatPrice(FREE_SHIPPING_MIN)} ต่อร้าน
            </span>
          )}
        </dd>
        <dt className="pt-1 text-muted-foreground">จำนวน</dt>
        <dd className="flex flex-wrap items-center gap-3">
          <QuantityStepper
            value={quantity}
            max={product.stock}
            onChange={setQuantity}
          />
          <span className="text-muted-foreground">
            {soldOut
              ? "สินค้าหมด"
              : `มีสินค้าทั้งหมด ${product.stock.toLocaleString()} ชิ้น`}
          </span>
        </dd>
      </dl>
      <div className="flex gap-3">
        <Button
          variant="outline"
          size="lg"
          className="h-11 flex-1 border-primary bg-secondary text-primary hover:bg-secondary/70 hover:text-primary sm:flex-none sm:px-5"
          disabled={soldOut}
          onClick={() => run("cart")}
        >
          <ShoppingCart />
          เพิ่มไปยังรถเข็น
        </Button>
        <Button
          size="lg"
          className="h-11 flex-1 sm:flex-none sm:px-10"
          disabled={soldOut}
          onClick={() => run("buy")}
        >
          {soldOut ? "สินค้าหมด" : "ซื้อสินค้า"}
        </Button>
      </div>
    </div>
  );
}
