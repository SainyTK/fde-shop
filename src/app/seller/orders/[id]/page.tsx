"use client";

import { useParams } from "next/navigation";

import { SellerOrderDetail } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function SellerOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <SellerOrderDetail seller={seller} orderId={id} />;
}
