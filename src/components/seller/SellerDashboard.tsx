"use client";

import {
  AlertTriangle,
  Boxes,
  ChevronRight,
  CircleDollarSign,
  PackageCheck,
  ReceiptText,
  TicketPercent,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { EmptyState, PageTitle, Panel } from "@/components/common";
import { OrderStatusBadge } from "@/components/order";
import { StockLabel } from "@/components/product";
import { useOrdersFor, useSellerCoupons, useSellerProducts } from "@/hooks";
import type { User } from "@/types";
import {
  couponRemaining,
  dailySales,
  formatPrice,
  isCouponExpired,
  isRevenueOrder,
  stockLevel,
} from "@/utils";
import { SalesChart } from "./SalesChart";
import { StatCard } from "./StatCard";

export function SellerDashboard({ seller }: { seller: User }) {
  const orders = useOrdersFor("seller", seller.id);
  const products = useSellerProducts(seller.id);
  const coupons = useSellerCoupons(seller.id);
  const sales = useMemo(() => dailySales(orders, 14, new Date()), [orders]);
  const revenue = sales.reduce((sum, day) => sum + day.revenue, 0);
  const alerts = products
    .filter((product) => product.active && stockLevel(product) !== "in_stock")
    .sort((a, b) => a.stock - b.stock);
  const now = new Date().toISOString();
  const liveCoupons = coupons.filter(
    (coupon) =>
      coupon.active &&
      !isCouponExpired(coupon, now) &&
      couponRemaining(coupon) > 0,
  );
  const todo = [
    {
      label: "รอตรวจสลิป",
      count: orders.filter((order) => order.status === "payment_review").length,
      href: "/seller/orders?tab=review",
      icon: ReceiptText,
    },
    {
      label: "ที่ต้องแพ็ก",
      count: orders.filter((order) => order.status === "paid").length,
      href: "/seller/orders?tab=to-pack",
      icon: PackageCheck,
    },
    {
      label: "ที่ต้องส่ง",
      count: orders.filter((order) => order.status === "packed").length,
      href: "/seller/orders?tab=to-ship",
      icon: Truck,
    },
    {
      label: "สินค้าใกล้หมด/หมด",
      count: alerts.length,
      href: "/seller/stock?level=alert",
      icon: AlertTriangle,
    },
  ];

  return (
    <>
      <PageTitle
        title={`สวัสดี ${seller.shop?.name}`}
        description="ภาพรวมร้านค้าของคุณ"
      />
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="ยอดขาย 14 วัน"
          value={formatPrice(revenue)}
          icon={CircleDollarSign}
          href="/seller/orders"
        />
        <StatCard
          label="คำสั่งซื้อที่ชำระแล้ว"
          value={String(orders.filter(isRevenueOrder).length)}
          icon={ReceiptText}
          href="/seller/orders"
        />
        <StatCard
          label="สินค้าที่วางขาย"
          value={String(products.filter((product) => product.active).length)}
          icon={Boxes}
          href="/seller/products"
        />
        <StatCard
          label="คูปองที่ใช้ได้"
          value={String(liveCoupons.length)}
          icon={TicketPercent}
          href="/seller/coupons"
        />
      </div>
      <Panel title="สิ่งที่ต้องทำ">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {todo.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-1 rounded-md p-3 text-center transition hover:bg-muted/60"
            >
              <span className="font-semibold text-2xl text-info tabular-nums">
                {item.count}
              </span>
              <span className="flex items-center gap-1 text-sm">
                <item.icon className="size-4 text-muted-foreground" />
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </Panel>
      <div className="grid gap-5 lg:grid-cols-[1fr_22rem]">
        <Panel title="ยอดขายรายวัน (บาท)">
          {revenue > 0 ? (
            <SalesChart data={sales} />
          ) : (
            <EmptyState
              icon={CircleDollarSign}
              title="ยังไม่มียอดขายใน 14 วันที่ผ่านมา"
            />
          )}
        </Panel>
        <Panel
          title="แจ้งเตือนสต็อก"
          action={
            <Link
              href="/seller/stock?level=alert"
              className="text-primary text-sm hover:underline"
            >
              ดูทั้งหมด
            </Link>
          }
        >
          {alerts.length === 0 ? (
            <EmptyState icon={Boxes} title="สต็อกเพียงพอทุกรายการ" />
          ) : (
            <ul className="divide-y">
              {alerts.slice(0, 5).map((product) => (
                <li key={product.id}>
                  <Link
                    href={`/seller/products/${product.id}`}
                    className="flex items-center gap-3 py-2.5 hover:text-primary"
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-sm border bg-white">
                      <Image
                        src={product.images[0]}
                        alt=""
                        fill
                        sizes="40px"
                        className="object-contain"
                      />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm">
                        {product.name}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        คงเหลือ {product.stock} ชิ้น
                      </span>
                    </span>
                    <StockLabel product={product} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
      <Panel
        title="คำสั่งซื้อล่าสุด"
        action={
          <Link
            href="/seller/orders"
            className="text-primary text-sm hover:underline"
          >
            ดูทั้งหมด
          </Link>
        }
      >
        {orders.length === 0 ? (
          <EmptyState icon={ReceiptText} title="ยังไม่มีคำสั่งซื้อ" />
        ) : (
          <ul className="-my-2.5 divide-y">
            {orders.slice(0, 6).map((order) => (
              <li key={order.id}>
                <Link
                  href={`/seller/orders/${order.id}`}
                  className="flex items-center gap-3 py-2.5 text-sm hover:text-primary"
                >
                  <span className="w-32 shrink-0 font-mono text-xs">
                    #{order.number}
                  </span>
                  <span className="hidden min-w-0 flex-1 truncate sm:block">
                    {order.items.map((item) => item.name).join(", ")}
                  </span>
                  <span className="ml-auto shrink-0 tabular-nums">
                    {formatPrice(order.total)}
                  </span>
                  <OrderStatusBadge status={order.status} />
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}
