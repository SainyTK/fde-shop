"use client";

import { PackageSearch } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { EmptyState, Panel } from "@/components/common";
import {
  ProductGallery,
  ProductGrid,
  PurchasePanel,
  ReviewList,
  ShopStrip,
  ShopVouchers,
} from "@/components/product";
import { Button } from "@/components/ui/button";
import { useProduct, useSellerProducts, useUser } from "@/hooks";
import { categoryLabel } from "@/utils";

export function ProductDetail({ productId }: { productId: string }) {
  const product = useProduct(productId);
  const seller = useUser(product?.sellerId ?? null);
  const shopProducts = useSellerProducts(product?.sellerId ?? null);
  const related = useMemo(
    () =>
      shopProducts
        .filter(
          (item) =>
            item.active &&
            item.id !== productId &&
            item.category === product?.category,
        )
        .slice(0, 6),
    [shopProducts, productId, product?.category],
  );

  if (!product || !product.active || !seller) {
    return (
      <div className="rounded-sm bg-white">
        <EmptyState
          icon={PackageSearch}
          title="ไม่พบสินค้านี้"
          description="สินค้าอาจถูกปิดการขายหรือลบไปแล้ว"
          action={
            <Button nativeButton={false} render={<Link href="/" />}>
              กลับหน้าแรก
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <nav className="flex gap-1.5 text-muted-foreground text-sm">
        <Link href="/" className="text-info hover:underline">
          FDE Shop
        </Link>
        /
        <Link
          href={`/search?category=${product.category}`}
          className="text-info hover:underline"
        >
          {categoryLabel(product.category)}
        </Link>
      </nav>
      <section className="grid gap-6 rounded-sm bg-white p-4 shadow-xs ring-1 ring-black/5 md:grid-cols-[minmax(0,26rem)_1fr] md:p-5">
        <ProductGallery images={product.images} name={product.name} />
        <div className="flex flex-col gap-5">
          <PurchasePanel product={product} />
          <ShopVouchers sellerId={seller.id} />
        </div>
      </section>
      <ShopStrip
        seller={seller}
        productCount={shopProducts.filter((item) => item.active).length}
      />
      <div className="grid gap-4 lg:grid-cols-[1fr_20rem]">
        <div className="flex flex-col gap-4">
          <Panel title="รายละเอียดสินค้า">
            <p className="whitespace-pre-line text-sm leading-relaxed">
              {product.description}
            </p>
          </Panel>
          <Panel title={`รีวิวสินค้า (${product.reviews.length})`}>
            <ReviewList reviews={product.reviews} />
          </Panel>
        </div>
        {related.length > 0 ? (
          <Panel title="สินค้าอื่นจากร้านนี้" className="self-start">
            <ProductGrid products={related} columns="aside" />
          </Panel>
        ) : null}
      </div>
    </>
  );
}
