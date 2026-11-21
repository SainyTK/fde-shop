"use client";

import { MapPin, Store } from "lucide-react";
import { useMemo, useState } from "react";
import { EmptyState, ShopAvatar } from "@/components/common";
import { ProductGrid, ShopVouchers, SortBar } from "@/components/product";
import { useSellerProducts, useUser } from "@/hooks";
import {
  formatCompact,
  formatDate,
  type ProductSort,
  searchProducts,
} from "@/utils";

export function ShopProfile({ sellerId }: { sellerId: string }) {
  const seller = useUser(sellerId);
  const products = useSellerProducts(sellerId);
  const [sort, setSort] = useState<ProductSort>("relevance");
  const listed = useMemo(
    () =>
      searchProducts(products, { text: "", category: null, sort, sellerId }),
    [products, sort, sellerId],
  );

  if (!seller?.shop) {
    return (
      <div className="rounded-sm bg-white">
        <EmptyState icon={Store} title="ไม่พบร้านค้านี้" />
      </div>
    );
  }
  const totalSold = products.reduce((sum, product) => sum + product.sold, 0);
  const rated = products.filter((product) => product.rating > 0);
  const rating = rated.length
    ? rated.reduce((sum, product) => sum + product.rating, 0) / rated.length
    : 0;

  return (
    <>
      <section className="grid gap-4 overflow-hidden rounded-sm bg-white shadow-xs ring-1 ring-black/5 md:grid-cols-[22rem_1fr]">
        <div
          className="flex items-center gap-4 p-5 text-white"
          style={{
            background: `linear-gradient(135deg, ${seller.shop.avatarColor}, #111827)`,
          }}
        >
          <span className="rounded-full ring-4 ring-white/30">
            <ShopAvatar shop={seller.shop} size="lg" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate font-semibold text-lg">
              {seller.shop.name}
            </h1>
            <p className="flex items-center gap-1 text-sm text-white/80">
              <MapPin className="size-3.5" />
              {seller.shop.location}
            </p>
          </div>
        </div>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 p-5 text-sm sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className="text-muted-foreground">สินค้า</dt>
            <dd className="font-medium text-primary">{listed.length}</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">ขายแล้ว</dt>
            <dd className="font-medium text-primary">
              {formatCompact(totalSold)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">คะแนน</dt>
            <dd className="font-medium text-primary">
              {rating.toFixed(1)} / 5
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">เข้าร่วมเมื่อ</dt>
            <dd className="font-medium text-primary">
              {formatDate(seller.createdAt)}
            </dd>
          </div>
          <p className="col-span-full text-muted-foreground">
            {seller.shop.tagline}
          </p>
        </dl>
      </section>
      <div className="rounded-sm bg-white p-4 shadow-xs ring-1 ring-black/5">
        <ShopVouchers sellerId={sellerId} />
      </div>
      <SortBar value={sort} onChange={setSort} />
      <ProductGrid products={listed} columns="full" />
    </>
  );
}
