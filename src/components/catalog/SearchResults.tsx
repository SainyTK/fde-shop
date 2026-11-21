"use client";

import { SearchX } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { EmptyState } from "@/components/common";
import { ProductGrid, SortBar } from "@/components/product";
import { CATEGORIES } from "@/constants";
import { cn } from "@/lib";
import { useShopStore } from "@/store";
import { categoryLabel, type ProductSort, searchProducts } from "@/utils";

const SORT_IDS: ProductSort[] = [
  "relevance",
  "latest",
  "best-selling",
  "price-asc",
  "price-desc",
];

export function SearchResults() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const products = useShopStore((state) => state.data.products);
  const text = params.get("q") ?? "";
  const category = params.get("category");
  const sortParam = params.get("sort") as ProductSort | null;
  const sort =
    sortParam && SORT_IDS.includes(sortParam) ? sortParam : "relevance";
  const results = useMemo(
    () => searchProducts(products, { text, category, sort, sellerId: null }),
    [products, text, category, sort],
  );

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  return (
    <div className="grid gap-4 md:grid-cols-[13rem_1fr]">
      <aside className="md:sticky md:top-32 md:self-start">
        <p className="mb-2 hidden font-semibold text-sm md:block">
          หมวดหมู่ทั้งหมด
        </p>
        <div className="-mx-2 flex gap-1.5 overflow-x-auto px-2 pb-1 [scrollbar-width:none] md:mx-0 md:flex-col md:px-0">
          {[{ id: null, label: "ทั้งหมด" }, ...CATEGORIES].map((item) => (
            <button
              key={item.id ?? "all"}
              type="button"
              onClick={() => update("category", item.id)}
              className={cn(
                "shrink-0 rounded-full border bg-white px-3 py-1.5 text-left text-sm transition-colors md:rounded-sm md:border-0 md:bg-transparent md:px-2",
                category === item.id
                  ? "border-primary font-medium text-primary"
                  : "hover:text-primary",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </aside>
      <section className="flex min-w-0 flex-col gap-3">
        <p className="text-sm">
          {text ? (
            <>
              ผลการค้นหา{" "}
              <span className="font-medium text-primary">
                &quot;{text}&quot;
              </span>
            </>
          ) : (
            <span className="font-medium">
              {category ? categoryLabel(category) : "สินค้าทั้งหมด"}
            </span>
          )}
          <span className="ml-2 text-muted-foreground">
            {results.length} รายการ
          </span>
        </p>
        <SortBar
          value={sort}
          onChange={(value) =>
            update("sort", value === "relevance" ? null : value)
          }
        />
        {results.length === 0 ? (
          <div className="rounded-sm bg-white">
            <EmptyState
              icon={SearchX}
              title="ไม่พบสินค้าที่ค้นหา"
              description="ลองใช้คำค้นอื่น หรือเลือกหมวดหมู่ทั้งหมด"
            />
          </div>
        ) : (
          <ProductGrid products={results} columns="main" />
        )}
      </section>
    </div>
  );
}
