"use client";

import { useShopStore } from "@/store";
import type { User } from "@/types";

export function useUser(userId: string | null): User | null {
  return useShopStore(
    (state) => state.data.users.find((user) => user.id === userId) ?? null,
  );
}
