"use client";

import { CouponManager } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerCouponsPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <CouponManager seller={seller} />;
}
