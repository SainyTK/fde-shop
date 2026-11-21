import { Store, Truck } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { Logo } from "@/components/common";
import { AccountMenu } from "./AccountMenu";
import { CartButton } from "./CartButton";
import { SearchBar } from "./SearchBar";

export function ShopHeader() {
  return (
    <header className="sticky top-0 z-40 bg-linear-to-b from-[#f53d2d] to-[#f63] text-white shadow-sm">
      <div className="mx-auto hidden max-w-6xl items-center justify-between px-4 pt-1.5 text-[13px] md:flex">
        <div className="flex items-center gap-4">
          <Link
            href="/seller"
            className="flex items-center gap-1 hover:opacity-80"
          >
            <Store className="size-3.5" />
            Seller Centre
          </Link>
          <Link
            href="/track"
            className="flex items-center gap-1 hover:opacity-80"
          >
            <Truck className="size-3.5" />
            ติดตามพัสดุ
          </Link>
        </div>
        <AccountMenu tone="light" />
      </div>
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 md:gap-8 md:px-4 md:py-4">
        <div className="hidden md:block">
          <Logo href="/" tone="light" />
        </div>
        <Suspense
          fallback={<div className="h-10 flex-1 rounded-sm bg-white" />}
        >
          <SearchBar />
        </Suspense>
        <CartButton />
      </div>
    </header>
  );
}
