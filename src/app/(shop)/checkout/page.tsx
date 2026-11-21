"use client";

import { CheckoutView } from "@/components/checkout";
import { LoadingScreen, PageTitle } from "@/components/common";
import { useRoleGuard } from "@/hooks";

export default function CheckoutPage() {
  const buyer = useRoleGuard("buyer");
  if (!buyer) {
    return <LoadingScreen />;
  }
  return (
    <>
      <PageTitle title="ทำการสั่งซื้อ" />
      <CheckoutView buyer={buyer} />
    </>
  );
}
