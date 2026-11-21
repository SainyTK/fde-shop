"use client";

import { useParams } from "next/navigation";
import { ShopProfile } from "@/components/catalog";

export default function ShopPage() {
  const { id } = useParams<{ id: string }>();
  return <ShopProfile sellerId={id} />;
}
