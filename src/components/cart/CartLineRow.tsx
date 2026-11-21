"use client";

import Image from "next/image";
import Link from "next/link";
import { QuantityStepper } from "@/components/common";
import { Checkbox } from "@/components/ui/checkbox";
import { useShopStore } from "@/store";
import { type CartItem, cartLineProblem, formatPrice } from "@/utils";

export function CartLineRow({ item }: { item: CartItem }) {
  const setCartQuantity = useShopStore((state) => state.setCartQuantity);
  const setCartSelected = useShopStore((state) => state.setCartSelected);
  const removeFromCart = useShopStore((state) => state.removeFromCart);
  const { product, line } = item;
  const problem = cartLineProblem(item);
  return (
    <li className="grid grid-cols-[auto_4.5rem_1fr] items-start gap-3 py-4 sm:grid-cols-[auto_5rem_1fr_8rem_8rem_6rem_4rem] sm:items-center">
      <Checkbox
        aria-label={`เลือก ${product.name}`}
        checked={line.selected && !problem}
        disabled={problem !== null && product.stock <= 0}
        onCheckedChange={(checked) =>
          setCartSelected([product.id], checked === true)
        }
        className="mt-1 sm:mt-0"
      />
      <Link
        href={`/products/${product.id}`}
        className="relative aspect-square overflow-hidden rounded-sm border bg-white"
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="80px"
          className="object-contain"
        />
      </Link>
      <div className="flex min-w-0 flex-col gap-2 sm:contents">
        <div className="min-w-0">
          <Link
            href={`/products/${product.id}`}
            className="line-clamp-2 text-sm hover:text-primary"
          >
            {product.name}
          </Link>
          {problem ? (
            <p className="mt-1 text-destructive text-xs">{problem}</p>
          ) : null}
        </div>
        <p className="text-sm sm:text-center">
          {product.originalPrice ? (
            <span className="mr-1.5 text-muted-foreground text-xs line-through">
              {formatPrice(product.originalPrice)}
            </span>
          ) : null}
          <span className="text-primary sm:text-foreground">
            {formatPrice(product.price)}
          </span>
        </p>
        <div className="flex items-center justify-between gap-2 sm:contents">
          <div className="sm:flex sm:justify-center">
            <QuantityStepper
              value={line.quantity}
              max={Math.max(product.stock, 1)}
              onChange={(quantity) => setCartQuantity(product.id, quantity)}
            />
          </div>
          <p className="hidden text-center text-primary text-sm sm:block">
            {formatPrice(product.price * line.quantity)}
          </p>
          <button
            type="button"
            onClick={() => removeFromCart([product.id])}
            className="text-sm hover:text-primary sm:text-center"
          >
            ลบ
          </button>
        </div>
      </div>
    </li>
  );
}
