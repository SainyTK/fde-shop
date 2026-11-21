"use client";

import { SellerDashboard } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerDashboardPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <SellerDashboard seller={seller} />;
}
