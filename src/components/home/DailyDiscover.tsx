"use client";

import { useMemo, useState } from "react";
import { ProductGrid } from "@/components/product";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store";
import { sortProducts } from "@/utils";

const PAGE_SIZE = 36;

export function DailyDiscover() {
  const products = useShopStore((state) => state.data.products);
  const [visible, setVisible] = useState(PAGE_SIZE);
  const ranked = useMemo(
    () =>
      sortProducts(
        products.filter((product) => product.active),
        "relevance",
      ),
    [products],
  );
  return (
    <section className="flex flex-col gap-3">
      <div className="sticky top-[60px] z-10 border-primary border-b-4 bg-white py-3 text-center font-medium text-primary uppercase md:top-[108px]">
        สินค้าแนะนำประจำวัน
      </div>
      <ProductGrid products={ranked.slice(0, visible)} columns="full" />
      {visible < ranked.length ? (
        <Button
          variant="outline"
          size="lg"
          className="mx-auto h-10 w-full max-w-sm bg-white"
          onClick={() => setVisible((count) => count + PAGE_SIZE)}
        >
          ดูเพิ่มเติม
        </Button>
      ) : null}
    </section>
  );
}
