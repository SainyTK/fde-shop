import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { BRAND_NAME } from "@/constants";
import { cn } from "@/lib";

type LogoProps = {
  href: string;
  tone: "light" | "brand";
  suffix?: string;
};

export function Logo({ href, tone, suffix }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex shrink-0 items-center gap-2 font-semibold text-xl tracking-tight",
        tone === "light" ? "text-white" : "text-primary",
      )}
    >
      <ShoppingBag className="size-7" strokeWidth={2.2} />
      <span>{BRAND_NAME}</span>
      {suffix ? (
        <span
          className={cn(
            "border-l pl-2 font-normal text-base",
            tone === "light"
              ? "border-white/40"
              : "border-border text-foreground",
          )}
        >
          {suffix}
        </span>
      ) : null}
    </Link>
  );
}
