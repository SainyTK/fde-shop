"use client";

import { type ReactNode, useEffect } from "react";
import { LoadingScreen } from "@/components/common";
import { hydrateShopStore, useShopStore } from "@/store";

export function StoreGate({ children }: { children: ReactNode }) {
  const hydrated = useShopStore((state) => state.hydrated);
  useEffect(() => {
    hydrateShopStore();
  }, []);
  return hydrated ? children : <LoadingScreen />;
}
