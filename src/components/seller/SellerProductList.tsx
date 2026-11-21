"use client";

import { Package, Plus, Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { EmptyState, PageTitle, Panel, StatusBadge } from "@/components/common";
import { StockLabel } from "@/components/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSellerProducts } from "@/hooks";
import type { User } from "@/types";
import { categoryLabel, formatCompact, formatPrice } from "@/utils";
import { ProductThumb } from "./ProductThumb";

export function SellerProductList({ seller }: { seller: User }) {
  const products = useSellerProducts(seller.id);
  const [text, setText] = useState("");
  const shown = useMemo(() => {
    const needle = text.trim().toLowerCase();
    return products
      .filter((product) => product.name.toLowerCase().includes(needle))
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [products, text]);

  return (
    <>
      <PageTitle
        title="สินค้าของฉัน"
        description={`ทั้งหมด ${products.length} รายการ`}
        action={
          <Button
            nativeButton={false}
            render={<Link href="/seller/products/new" />}
            size="lg"
            className="h-9"
          >
            <Plus />
            เพิ่มสินค้าใหม่
          </Button>
        }
      />
      <Panel>
        <div className="relative mb-4 max-w-sm">
          <Search className="absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="ค้นหาสินค้า"
            placeholder="ค้นหาชื่อสินค้า"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="pl-8"
          />
        </div>
        {shown.length === 0 ? (
          <EmptyState icon={Package} title="ไม่พบสินค้า" />
        ) : (
          <>
            <ul className="divide-y md:hidden">
              {shown.map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/seller/products/${product.id}`}
                    className="flex items-center gap-3 py-3"
                  >
                    <ProductThumb product={product} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {product.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatPrice(product.price)} คงเหลือ {product.stock}
                      </span>
                    </span>
                    {product.active ? (
                      <StockLabel product={product} />
                    ) : (
                      <StatusBadge tone="muted">ปิดขาย</StatusBadge>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="-mx-5 hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5">สินค้า</TableHead>
                    <TableHead>หมวดหมู่</TableHead>
                    <TableHead className="text-right">ราคา</TableHead>
                    <TableHead className="text-right">คงเหลือ</TableHead>
                    <TableHead className="text-right">ขายแล้ว</TableHead>
                    <TableHead>สถานะ</TableHead>
                    <TableHead className="pr-5" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {shown.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="pl-5">
                        <Link
                          href={`/seller/products/${product.id}`}
                          className="flex max-w-80 items-center gap-3 hover:text-primary"
                        >
                          <ProductThumb product={product} />
                          <span className="truncate">{product.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {categoryLabel(product.category)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatPrice(product.price)}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {product.stock}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatCompact(product.sold)}
                      </TableCell>
                      <TableCell>
                        {product.active ? (
                          <StockLabel product={product} />
                        ) : (
                          <StatusBadge tone="muted">ปิดขาย</StatusBadge>
                        )}
                      </TableCell>
                      <TableCell className="pr-5 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          nativeButton={false}
                          render={
                            <Link href={`/seller/products/${product.id}`} />
                          }
                        >
                          แก้ไข
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </Panel>
    </>
  );
}
