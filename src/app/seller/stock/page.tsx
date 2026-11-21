"use client";

import { Suspense } from "react";
import { StockOverview } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerStockPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return (
    <Suspense>
      <StockOverview seller={seller} />
    </Suspense>
  );
}
