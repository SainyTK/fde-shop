import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { STORAGE_KEY, STORAGE_VERSION } from "@/constants";
import { persistentStorage } from "@/services";
import type { ShopData } from "@/types";
import { buildSeedData } from "@/utils";
import { type AccountActions, createAccountActions } from "./account-actions";
import { type CatalogActions, createCatalogActions } from "./catalog-actions";
import { createOrderActions, type OrderActions } from "./order-actions";

export type ShopStore = {
  data: ShopData;
  hydrated: boolean;
  resetDemo: () => void;
} & AccountActions &
  CatalogActions &
  OrderActions;

const EMPTY_DATA: ShopData = {
  users: [],
  products: [],
  stockMovements: [],
  coupons: [],
  orders: [],
  carts: {},
  sessionUserId: null,
};

export const useShopStore = create<ShopStore>()(
  persist(
    (set, get, api) => ({
      data: EMPTY_DATA,
      hydrated: false,
      resetDemo: () => set({ data: buildSeedData(new Date().toISOString()) }),
      ...createAccountActions(set, get, api),
      ...createCatalogActions(set, get, api),
      ...createOrderActions(set, get, api),
    }),
    {
      name: STORAGE_KEY,
      version: STORAGE_VERSION,
      storage: createJSONStorage(() => persistentStorage),
      partialize: (state) => ({ data: state.data }),
      skipHydration: true,
    },
  ),
);

let hydration: Promise<void> | null = null;

async function hydrate(): Promise<void> {
  await useShopStore.persist.rehydrate();
  if (useShopStore.getState().data.users.length === 0) {
    useShopStore.getState().resetDemo();
  }
  useShopStore.setState({ hydrated: true });
}

export function hydrateShopStore(): Promise<void> {
  hydration ??= hydrate();
  return hydration;
}
