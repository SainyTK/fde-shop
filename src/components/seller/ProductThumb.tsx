import Image from "next/image";
import type { Product } from "@/types";

export function ProductThumb({ product }: { product: Product }) {
  return (
    <span className="relative block size-12 shrink-0 overflow-hidden rounded-sm border bg-white">
      <Image
        src={product.images[0]}
        alt=""
        fill
        sizes="48px"
        className="object-contain"
      />
    </span>
  );
}
