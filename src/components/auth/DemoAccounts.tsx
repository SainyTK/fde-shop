"use client";

import { ShoppingBag, Store } from "lucide-react";
import type { DemoAccount } from "@/constants";
import { DEMO_ACCOUNTS, DEMO_PASSWORD } from "@/constants";

type DemoAccountsProps = {
  onPick: (account: DemoAccount) => void;
  disabled: boolean;
};

export function DemoAccounts({ onPick, disabled }: DemoAccountsProps) {
  return (
    <div className="flex flex-col gap-2 rounded-md border border-primary/30 border-dashed bg-secondary/60 p-3">
      <p className="font-medium text-sm">บัญชีทดลอง (รหัสผ่าน {DEMO_PASSWORD})</p>
      {DEMO_ACCOUNTS.map((account) => {
        const Icon = account.role === "buyer" ? ShoppingBag : Store;
        return (
          <button
            key={account.email}
            type="button"
            disabled={disabled}
            onClick={() => onPick(account)}
            className="flex items-center gap-3 rounded-md bg-white px-3 py-2 text-left ring-1 ring-black/5 transition hover:ring-primary disabled:opacity-60"
          >
            <span className="flex size-8 items-center justify-center rounded-full bg-secondary text-primary">
              <Icon className="size-4" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-medium text-sm">{account.label}</span>
              <span className="block truncate text-muted-foreground text-xs">
                {account.email}
              </span>
            </span>
            <span className="font-medium text-primary text-xs">เข้าสู่ระบบ</span>
          </button>
        );
      })}
    </div>
  );
}
