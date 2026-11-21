"use client";

import { ChevronDown, LogOut, Package, Store, UserRound } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLE_LABEL } from "@/constants";
import { useCurrentUser } from "@/hooks";
import { cn } from "@/lib";
import { useShopStore } from "@/store";

type AccountMenuProps = {
  tone: "light" | "dark";
};

export function AccountMenu({ tone }: AccountMenuProps) {
  const user = useCurrentUser();
  const logout = useShopStore((state) => state.logout);
  const router = useRouter();

  if (!user) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 text-sm",
          tone === "light" ? "text-white" : "text-foreground",
        )}
      >
        <Link href="/register" className="hover:opacity-80">
          สมัครใหม่
        </Link>
        <span className="opacity-50">|</span>
        <Link href="/login" className="hover:opacity-80">
          เข้าสู่ระบบ
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-none transition-colors",
          tone === "light"
            ? "text-white hover:bg-white/10"
            : "text-foreground hover:bg-muted",
        )}
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-white/90 font-semibold text-primary text-xs ring-1 ring-black/5">
          {user.name.slice(0, 1)}
        </span>
        <span className="hidden max-w-32 truncate sm:inline">{user.name}</span>
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <p className="truncate font-medium text-foreground">{user.email}</p>
          <p className="font-normal text-muted-foreground text-xs">
            บัญชี{ROLE_LABEL[user.role]}
          </p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {user.role === "buyer" ? (
          <>
            <DropdownMenuItem onClick={() => router.push("/account")}>
              <UserRound />
              บัญชีของฉัน
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/orders")}>
              <Package />
              การซื้อของฉัน
            </DropdownMenuItem>
          </>
        ) : (
          <DropdownMenuItem onClick={() => router.push("/seller")}>
            <Store />
            Seller Centre
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            logout();
            router.push("/");
          }}
        >
          <LogOut />
          ออกจากระบบ
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
