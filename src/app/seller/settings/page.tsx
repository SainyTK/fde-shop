"use client";

import { ShopSettingsForm } from "@/components/seller";
import { useCurrentUser } from "@/hooks";

export default function ShopSettingsPage() {
  const seller = useCurrentUser();
  if (!seller) {
    return null;
  }
  return <ShopSettingsForm seller={seller} />;
}
