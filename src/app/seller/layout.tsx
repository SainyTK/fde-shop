import { SellerShell } from "@/components/layout";

export const metadata = {
  title: { default: "Seller Centre", template: "%s | Seller Centre" },
};

export default function SellerLayout({ children }: LayoutProps<"/seller">) {
  return <SellerShell>{children}</SellerShell>;
}
