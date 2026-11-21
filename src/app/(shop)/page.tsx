"use client";

import {
  CategoryGrid,
  DailyDiscover,
  FlashDeals,
  HeroBanner,
} from "@/components/home";

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <CategoryGrid />
      <FlashDeals />
      <DailyDiscover />
    </>
  );
}
