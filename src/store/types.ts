import type { StateCreator } from "zustand";
import type { ShopStore } from "./shop-store";

export type ActionCreator<T> = StateCreator<
  ShopStore,
  [["zustand/persist", unknown]],
  [],
  T
>;
