"use client";

import { useParams } from "next/navigation";

import { ProductEditor } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <ProductEditor seller={seller} productId={id} />;
}
