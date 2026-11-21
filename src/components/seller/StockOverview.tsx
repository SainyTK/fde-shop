"use client";

import { AlertTriangle, Boxes, PackageX } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { PageTitle, Panel } from "@/components/common";
import { StockLabel } from "@/components/product";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSellerProducts } from "@/hooks";
import { cn } from "@/lib";
import { useShopStore } from "@/store";
import type { User } from "@/types";
import { stockLevel } from "@/utils";
import { ProductThumb } from "./ProductThumb";
import { StockAdjustDialog } from "./StockAdjustDialog";
import { StockMovementTable } from "./StockMovementTable";

const FILTERS = [
  { id: "all", label: "ทั้งหมด", icon: Boxes },
  { id: "alert", label: "ใกล้หมดและหมด", icon: AlertTriangle },
  { id: "out", label: "หมด", icon: PackageX },
];

export function StockOverview({ seller }: { seller: User }) {
  const products = useSellerProducts(seller.id);
  const allMovements = useShopStore((state) => state.data.stockMovements);
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const filter =
    FILTERS.find((item) => item.id === params.get("level"))?.id ?? "all";
  const active = products.filter((product) => product.active);
  const counts = {
    all: active.length,
    alert: active.filter((product) => stockLevel(product) !== "in_stock")
      .length,
    out: active.filter((product) => stockLevel(product) === "out").length,
  };
  const shown = active
    .filter((product) => {
      const level = stockLevel(product);
      return (
        filter === "all" ||
        (filter === "out" ? level === "out" : level !== "in_stock")
      );
    })
    .sort((a, b) => a.stock - b.stock);
  const movements = useMemo(
    () =>
      allMovements
        .filter((movement) => movement.sellerId === seller.id)
        .slice(0, 40),
    [allMovements, seller.id],
  );

  return (
    <>
      <PageTitle
        title="สต็อกสินค้า"
        description="ตัดสต็อกอัตโนมัติเมื่อมีคำสั่งซื้อ และคืนสต็อกเมื่อยกเลิก"
      />
      <div className="grid grid-cols-3 gap-3">
        {FILTERS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() =>
              router.replace(
                item.id === "all" ? pathname : `${pathname}?level=${item.id}`,
                { scroll: false },
              )
            }
            className={cn(
              "flex flex-col items-start gap-1 rounded-lg bg-white p-3 text-left shadow-xs ring-1 transition sm:flex-row sm:items-center sm:gap-3 sm:p-4",
              filter === item.id
                ? "ring-2 ring-primary"
                : "ring-black/5 hover:ring-primary/50",
            )}
          >
            <item.icon
              className={cn(
                "size-5",
                item.id === "all"
                  ? "text-info"
                  : item.id === "alert"
                    ? "text-warning"
                    : "text-destructive",
              )}
            />
            <span>
              <span className="block font-semibold text-xl tabular-nums">
                {counts[item.id as keyof typeof counts]}
              </span>
              <span className="block text-muted-foreground text-xs">
                {item.label}
              </span>
            </span>
          </button>
        ))}
      </div>
      <Panel title="ระดับสต็อก">
        <div className="-mx-4 overflow-x-auto sm:-mx-5">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-4 sm:pl-5">สินค้า</TableHead>
                <TableHead className="text-right">คงเหลือ</TableHead>
                <TableHead className="hidden text-right sm:table-cell">
                  จุดแจ้งเตือน
                </TableHead>
                <TableHead>สถานะ</TableHead>
                <TableHead className="pr-4 text-right sm:pr-5" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="pl-4 sm:pl-5">
                    <Link
                      href={`/seller/products/${product.id}`}
                      className="flex max-w-40 items-center gap-3 hover:text-primary sm:max-w-96"
                    >
                      <ProductThumb product={product} />
                      <span className="truncate">{product.name}</span>
                    </Link>
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {product.stock}
                  </TableCell>
                  <TableCell className="hidden text-right text-muted-foreground tabular-nums sm:table-cell">
                    {product.lowStockThreshold}
                  </TableCell>
                  <TableCell>
                    <StockLabel product={product} />
                  </TableCell>
                  <TableCell className="pr-4 text-right sm:pr-5">
                    <StockAdjustDialog product={product} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Panel>
      <Panel title="ความเคลื่อนไหวของสต็อกล่าสุด">
        <StockMovementTable movements={movements} showProduct />
      </Panel>
    </>
  );
}
