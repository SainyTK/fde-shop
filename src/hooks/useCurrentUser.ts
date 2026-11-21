"use client";

import { useShopStore } from "@/store";
import type { User } from "@/types";

export function useCurrentUser(): User | null {
  return useShopStore(
    (state) =>
      state.data.users.find((user) => user.id === state.data.sessionUserId) ??
      null,
  );
}
