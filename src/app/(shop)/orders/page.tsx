"use client";

import { Suspense } from "react";
import { BuyerOrderList } from "@/components/buyer";
import { LoadingScreen, PageTitle } from "@/components/common";
import { useRoleGuard } from "@/hooks";

export default function OrdersPage() {
  const buyer = useRoleGuard("buyer");
  if (!buyer) {
    return <LoadingScreen />;
  }
  return (
    <>
      <PageTitle title="การซื้อของฉัน" />
      <Suspense>
        <BuyerOrderList buyer={buyer} />
      </Suspense>
    </>
  );
}
