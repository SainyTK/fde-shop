import { BRAND_NAME } from "@/constants";
import { ResetDemoButton } from "./ResetDemoButton";

export function ShopFooter() {
  return (
    <footer className="mt-10 border-primary border-t-4 bg-white pb-20 md:pb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-muted-foreground text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {BRAND_NAME}. ข้อมูลทั้งหมดเก็บในเบราว์เซอร์นี้</p>
        <ResetDemoButton />
      </div>
    </footer>
  );
}
