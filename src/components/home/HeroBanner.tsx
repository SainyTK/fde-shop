"use client";

import { ShieldCheck, TicketPercent, Truck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib";

const SLIDES = [
  {
    title: "ช้อปของแท้ ส่งไวทั่วไทย",
    body: "ส่งฟรีเมื่อซื้อครบ ฿1,000 ต่อร้าน",
    href: "/search?sort=best-selling",
    cta: "ดูสินค้าขายดี",
    className: "from-[#f53d2d] via-[#fe6433] to-[#ff9a3d]",
  },
  {
    title: "โค้ดลดสูงสุด 20%",
    body: "ใช้โค้ด STYLE20 ที่ร้าน Style Street BKK",
    href: "/search?category=women",
    cta: "ช้อปแฟชั่น",
    className: "from-[#db2777] via-[#ec4899] to-[#f97316]",
  },
  {
    title: "ไอทีลดแรง ประกันศูนย์",
    body: "ใช้โค้ด GADGET10 ลด 10% สูงสุด ฿500",
    href: "/search?category=phones",
    cta: "ดูมือถือ",
    className: "from-[#1d4ed8] via-[#2563eb] to-[#06b6d4]",
  },
];

const PERKS = [
  { icon: ShieldCheck, label: "ตรวจสลิปอัตโนมัติ" },
  { icon: TicketPercent, label: "โค้ดส่วนลดจากร้าน" },
  { icon: Truck, label: "ติดตามพัสดุได้ทุกขั้น" },
];

export function HeroBanner() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(
      () => setIndex((current) => (current + 1) % SLIDES.length),
      5000,
    );
    return () => clearInterval(timer);
  }, []);
  return (
    <section className="grid gap-1 md:grid-cols-[2fr_1fr]">
      <div className="relative h-44 overflow-hidden rounded-sm sm:h-60">
        {SLIDES.map((slide, slideIndex) => (
          <div
            key={slide.title}
            aria-hidden={slideIndex !== index}
            className={cn(
              "absolute inset-0 flex flex-col justify-center gap-2 bg-linear-to-r px-6 text-white transition-opacity duration-700 sm:px-10",
              slide.className,
              slideIndex === index
                ? "opacity-100"
                : "pointer-events-none opacity-0",
            )}
          >
            <p className="font-semibold text-2xl sm:text-4xl">{slide.title}</p>
            <p className="text-sm text-white/90 sm:text-base">{slide.body}</p>
            <Link
              href={slide.href}
              tabIndex={slideIndex === index ? 0 : -1}
              className="mt-2 w-fit rounded-full bg-white px-4 py-1.5 font-medium text-foreground text-sm shadow-sm hover:bg-white/90"
            >
              {slide.cta}
            </Link>
          </div>
        ))}
        <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
          {SLIDES.map((slide, slideIndex) => (
            <button
              key={slide.title}
              type="button"
              aria-label={`แบนเนอร์ ${slideIndex + 1}`}
              onClick={() => setIndex(slideIndex)}
              className={cn(
                "h-2 rounded-full transition-all",
                slideIndex === index ? "w-5 bg-white" : "w-2 bg-white/50",
              )}
            />
          ))}
        </div>
      </div>
      <div className="hidden grid-rows-3 gap-1 md:grid">
        {PERKS.map((perk) => (
          <div
            key={perk.label}
            className="flex items-center gap-3 rounded-sm bg-white px-5 shadow-xs ring-1 ring-black/5"
          >
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary">
              <perk.icon className="size-5" />
            </span>
            <span className="font-medium text-sm">{perk.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
