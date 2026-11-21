import type { Role } from "@/types";

export function redirectTarget(role: Role, next: string | null): string {
  if (next?.startsWith("/") && !next.startsWith("//")) {
    const sellerPath = next.startsWith("/seller");
    if (sellerPath === (role === "seller")) {
      return next;
    }
  }
  return role === "seller" ? "/seller" : "/";
}
