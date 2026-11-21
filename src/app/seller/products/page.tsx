"use client";

import { SellerProductList } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerProductsPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <SellerProductList seller={seller} />;
}
