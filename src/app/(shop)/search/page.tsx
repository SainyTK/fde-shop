import { Suspense } from "react";
import { SearchResults } from "@/components/catalog";

export const metadata = { title: "ค้นหาสินค้า" };

export default function SearchPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
