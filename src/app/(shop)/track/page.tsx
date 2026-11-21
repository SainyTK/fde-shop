import { Suspense } from "react";
import { TrackingLookup } from "@/components/buyer";
import { PageTitle } from "@/components/common";

export const metadata = { title: "ติดตามพัสดุ" };

export default function TrackPage() {
  return (
    <>
      <PageTitle title="ติดตามพัสดุ" />
      <Suspense>
        <TrackingLookup />
      </Suspense>
    </>
  );
}
