"use client";

import { CartView } from "@/components/cart";
import { LoadingScreen, PageTitle } from "@/components/common";
import { useRoleGuard } from "@/hooks";

export default function CartPage() {
  const buyer = useRoleGuard("buyer");
  if (!buyer) {
    return <LoadingScreen />;
  }
  return (
    <>
      <PageTitle title="ตะกร้าสินค้า" />
      <CartView />
    </>
  );
}
