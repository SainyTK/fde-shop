"use client";

import { ExternalLink } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LoadingScreen, Logo } from "@/components/common";
import { useRoleGuard } from "@/hooks";
import { AccountMenu } from "./AccountMenu";
import { SellerNav } from "./SellerNav";

export function SellerShell({ children }: { children: ReactNode }) {
  const seller = useRoleGuard("seller");
  if (!seller) {
    return <LoadingScreen />;
  }
  return (
    <div className="flex min-h-dvh flex-col bg-muted/60">
      <header className="sticky top-0 z-40 border-b bg-white">
        <div className="flex h-14 items-center justify-between gap-3 px-4">
          <Logo href="/seller" tone="brand" suffix="Seller Centre" />
          <div className="flex items-center gap-2">
            <Link
              href={`/shops/${seller.id}`}
              className="hidden items-center gap-1 text-muted-foreground text-sm hover:text-primary sm:flex"
            >
              ดูหน้าร้าน
              <ExternalLink className="size-3.5" />
            </Link>
            <AccountMenu tone="dark" />
          </div>
        </div>
        <div className="lg:hidden">
          <SellerNav sellerId={seller.id} layout="tabs" />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-60 shrink-0 border-r bg-white p-3 lg:block">
          <SellerNav sellerId={seller.id} layout="sidebar" />
        </aside>
        <main className="min-w-0 flex-1 p-4 sm:p-6">
          <div className="mx-auto flex max-w-6xl flex-col gap-5">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
