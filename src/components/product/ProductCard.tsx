import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/types";
import { discountPercent, formatCompact, formatPrice } from "@/utils";

type ProductCardProps = {
  product: Product;
  location?: string;
};

export function ProductCard({ product, location }: ProductCardProps) {
  const discount = discountPercent(product);
  const soldOut = product.stock <= 0;
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col overflow-hidden rounded-sm bg-white shadow-xs ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/60"
    >
      <div className="relative aspect-square bg-white">
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 190px, (min-width: 640px) 25vw, 50vw"
          className="object-contain p-2"
        />
        {discount ? (
          <span className="absolute top-0 right-0 bg-amber-300/95 px-1.5 py-1 font-semibold text-[11px] text-primary leading-none">
            -{discount}%
          </span>
        ) : null}
        {soldOut ? (
          <span className="absolute inset-0 flex items-center justify-center bg-white/60">
            <span className="flex size-20 items-center justify-center rounded-full bg-black/60 font-medium text-sm text-white">
              สินค้าหมด
            </span>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-2">
        <p className="line-clamp-2 min-h-9 text-[13px] leading-[18px]">
          {product.name}
        </p>
        <div className="mt-auto flex items-end justify-between gap-1">
          <span className="font-medium text-base text-primary">
            {formatPrice(product.price)}
          </span>
          <span className="text-[11px] text-muted-foreground">
            ขายแล้ว {formatCompact(product.sold)}
          </span>
        </div>
        {location ? (
          <span className="flex items-center gap-0.5 text-[11px] text-muted-foreground">
            <MapPin className="size-3" />
            {location}
          </span>
        ) : null}
      </div>
    </Link>
  );
}
