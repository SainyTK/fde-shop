"use client";

import { useParams } from "next/navigation";
import { ProductDetail } from "@/components/catalog";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  return <ProductDetail productId={id} />;
}
