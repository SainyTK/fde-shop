"use client";

import { Suspense } from "react";
import { SellerOrderList } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerOrdersPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return (
    <Suspense>
      <SellerOrderList seller={seller} />
    </Suspense>
  );
}
