"use client";

import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { STOCK_REASON_LABEL } from "@/constants";
import { cn } from "@/lib";
import { useShopStore } from "@/store";
import type { StockMovement } from "@/types";
import { formatDateTime } from "@/utils";

type StockMovementTableProps = {
  movements: StockMovement[];
  showProduct: boolean;
};

export function StockMovementTable({
  movements,
  showProduct,
}: StockMovementTableProps) {
  const products = useShopStore((state) => state.data.products);
  const orders = useShopStore((state) => state.data.orders);
  if (movements.length === 0) {
    return (
      <p className="py-6 text-center text-muted-foreground text-sm">
        ยังไม่มีความเคลื่อนไหว
      </p>
    );
  }
  return (
    <div className="-mx-4 overflow-x-auto sm:-mx-5">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-4 sm:pl-5">เวลา</TableHead>
            {showProduct ? <TableHead>สินค้า</TableHead> : null}
            <TableHead>ประเภท</TableHead>
            <TableHead className="text-right">จำนวน</TableHead>
            <TableHead className="text-right">คงเหลือ</TableHead>
            <TableHead className="pr-4 sm:pr-5">หมายเหตุ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movements.map((movement) => {
            const order = movement.orderId
              ? orders.find((item) => item.id === movement.orderId)
              : null;
            return (
              <TableRow key={movement.id}>
                <TableCell className="whitespace-nowrap pl-4 text-muted-foreground sm:pl-5">
                  {formatDateTime(movement.at)}
                </TableCell>
                {showProduct ? (
                  <TableCell className="max-w-56">
                    <Link
                      href={`/seller/products/${movement.productId}`}
                      className="block truncate hover:text-primary"
                    >
                      {products.find(
                        (product) => product.id === movement.productId,
                      )?.name ?? "สินค้าที่ถูกลบ"}
                    </Link>
                  </TableCell>
                ) : null}
                <TableCell className="whitespace-nowrap">
                  {STOCK_REASON_LABEL[movement.reason]}
                </TableCell>
                <TableCell
                  className={cn(
                    "text-right font-medium tabular-nums",
                    movement.quantity > 0
                      ? "text-success"
                      : movement.quantity < 0
                        ? "text-destructive"
                        : "",
                  )}
                >
                  {movement.quantity > 0
                    ? `+${movement.quantity}`
                    : movement.quantity}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {movement.balance}
                </TableCell>
                <TableCell className="max-w-64 truncate pr-4 text-muted-foreground sm:pr-5">
                  {order ? (
                    <Link
                      href={`/seller/orders/${order.id}`}
                      className="hover:text-primary"
                    >
                      {movement.note}
                    </Link>
                  ) : (
                    movement.note || "-"
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
