"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import type { Role, User } from "@/types";
import { useCurrentUser } from "./useCurrentUser";

export function useRoleGuard(role: Role): User | null {
  const user = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();
  const allowed = user?.role === role;
  useEffect(() => {
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!allowed) {
      router.replace(role === "seller" ? "/" : "/seller");
    }
  }, [user, allowed, role, router, pathname]);
  return allowed ? user : null;
}
