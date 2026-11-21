import { ShoppingBag } from "lucide-react";

export function LoadingScreen() {
  return (
    <div className="flex min-h-dvh flex-1 flex-col items-center justify-center gap-3 text-primary">
      <ShoppingBag className="size-10 animate-pulse" />
      <p className="text-muted-foreground text-sm">กำลังโหลดร้านค้า</p>
    </div>
  );
}
