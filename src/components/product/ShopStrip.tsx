import { MapPin, Store } from "lucide-react";
import Link from "next/link";
import { ShopAvatar } from "@/components/common";
import { Button } from "@/components/ui/button";
import type { User } from "@/types";

type ShopStripProps = {
  seller: User;
  productCount: number;
};

export function ShopStrip({ seller, productCount }: ShopStripProps) {
  if (!seller.shop) {
    return null;
  }
  return (
    <div className="flex flex-wrap items-center gap-4 rounded-sm bg-white p-4 shadow-xs ring-1 ring-black/5 sm:p-5">
      <ShopAvatar shop={seller.shop} size="lg" />
      <div className="min-w-0 flex-1">
        <p className="font-medium">{seller.shop.name}</p>
        <p className="truncate text-muted-foreground text-sm">
          {seller.shop.tagline}
        </p>
        <p className="mt-1 flex items-center gap-3 text-muted-foreground text-xs">
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {seller.shop.location}
          </span>
          <span>สินค้า {productCount} รายการ</span>
        </p>
      </div>
      <Button
        variant="outline"
        nativeButton={false}
        render={<Link href={`/shops/${seller.id}`} />}
      >
        <Store />
        ดูร้านค้า
      </Button>
    </div>
  );
}
