import { MobileTabBar, ShopFooter, ShopHeader } from "@/components/layout";

export default function ShopLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <ShopHeader />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-2 py-4 sm:px-4 md:py-6">
        {children}
      </main>
      <ShopFooter />
      <MobileTabBar />
    </>
  );
}
