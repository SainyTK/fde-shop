"use client";

import { useParams } from "next/navigation";
import { BuyerOrderDetail } from "@/components/buyer";
import { LoadingScreen } from "@/components/common";
import { useRoleGuard } from "@/hooks";

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const buyer = useRoleGuard("buyer");
  if (!buyer) {
    return <LoadingScreen />;
  }
  return <BuyerOrderDetail orderId={id} buyer={buyer} />;
}
