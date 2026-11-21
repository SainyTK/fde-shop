import { cn } from "@/lib";
import type { Shop } from "@/types";

type ShopAvatarProps = {
  shop: Shop;
  size: "sm" | "lg";
};

export function ShopAvatar({ shop, size }: ShopAvatarProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white",
        size === "sm" ? "size-7 text-xs" : "size-16 text-xl",
      )}
      style={{ backgroundColor: shop.avatarColor }}
      aria-hidden
    >
      {shop.name.slice(0, 1).toUpperCase()}
    </span>
  );
}
