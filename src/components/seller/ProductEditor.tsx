"use client";

import { ChevronLeft, ExternalLink, PackageSearch, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { EmptyState, PageTitle, Panel } from "@/components/common";
import { StockLabel } from "@/components/product";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useProduct } from "@/hooks";
import { useShopStore } from "@/store";
import type { User } from "@/types";
import { ProductForm } from "./ProductForm";
import { StockAdjustDialog } from "./StockAdjustDialog";
import { StockMovementTable } from "./StockMovementTable";

export function ProductEditor({
  seller,
  productId,
}: {
  seller: User;
  productId: string | null;
}) {
  const router = useRouter();
  const product = useProduct(productId ?? "");
  const createProduct = useShopStore((state) => state.createProduct);
  const updateProduct = useShopStore((state) => state.updateProduct);
  const deleteProduct = useShopStore((state) => state.deleteProduct);
  const allMovements = useShopStore((state) => state.data.stockMovements);
  const movements = useMemo(
    () => allMovements.filter((movement) => movement.productId === productId),
    [allMovements, productId],
  );

  if (productId && (!product || product.sellerId !== seller.id)) {
    return <EmptyState icon={PackageSearch} title="ไม่พบสินค้านี้" />;
  }

  const back = (
    <Link
      href="/seller/products"
      className="flex w-fit items-center gap-1 text-muted-foreground text-sm hover:text-primary"
    >
      <ChevronLeft className="size-4" />
      สินค้าของฉัน
    </Link>
  );

  return (
    <>
      {back}
      <PageTitle
        title={product ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
        action={
          product ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                render={
                  <Link href={`/products/${product.id}`} target="_blank" />
                }
              >
                <ExternalLink />
                ดูหน้าสินค้า
              </Button>
              <AlertDialog>
                <AlertDialogTrigger render={<Button variant="destructive" />}>
                  <Trash2 />
                  ลบ
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ลบสินค้านี้?</AlertDialogTitle>
                    <AlertDialogDescription>
                      สินค้าที่มีคำสั่งซื้อแล้วจะถูกปิดการขายแทนการลบ เพื่อเก็บประวัติคำสั่งซื้อไว้
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        deleteProduct(product.id);
                        toast.success("ลบสินค้าแล้ว");
                        router.push("/seller/products");
                      }}
                    >
                      ลบสินค้า
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : null
        }
      />
      {product ? (
        <Panel
          title="สต็อกสินค้า"
          action={<StockAdjustDialog product={product} />}
        >
          <div className="mb-4 flex flex-wrap items-center gap-6 text-sm">
            <span>
              คงเหลือ{" "}
              <span className="font-semibold text-2xl tabular-nums">
                {product.stock}
              </span>{" "}
              ชิ้น
            </span>
            <span className="text-muted-foreground">
              แจ้งเตือนเมื่อเหลือไม่เกิน {product.lowStockThreshold} ชิ้น
            </span>
            <StockLabel product={product} />
          </div>
          <StockMovementTable movements={movements} showProduct={false} />
        </Panel>
      ) : null}
      <ProductForm
        key={product?.updatedAt ?? "new"}
        product={product}
        onSubmit={(input, initialStock) => {
          if (product) {
            const result = updateProduct(product.id, input);
            if (!result.ok) {
              toast.error(result.error);
              return false;
            }
            toast.success("บันทึกสินค้าแล้ว");
            return true;
          }
          const result = createProduct(input, initialStock);
          if (!result.ok) {
            toast.error(result.error);
            return false;
          }
          toast.success("เพิ่มสินค้าแล้ว");
          router.replace(`/seller/products/${result.value}`);
          return true;
        }}
      />
    </>
  );
}
