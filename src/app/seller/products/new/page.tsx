"use client";

import { ProductEditor } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function NewProductPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <ProductEditor seller={seller} productId={null} />;
}
