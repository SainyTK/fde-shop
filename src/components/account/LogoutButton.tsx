"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useShopStore } from "@/store";

export function LogoutButton() {
  const logout = useShopStore((state) => state.logout);
  const router = useRouter();
  return (
    <Button
      variant="outline"
      className="self-start"
      onClick={() => {
        logout();
        router.push("/");
      }}
    >
      <LogOut />
      ออกจากระบบ
    </Button>
  );
}
