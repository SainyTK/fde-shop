import type { LucideIcon } from "lucide-react";
import Link from "next/link";

type StatCardProps = {
  label: string;
  value: string;
  icon: LucideIcon;
  href: string;
};

export function StatCard({ label, value, icon: Icon, href }: StatCardProps) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-xs ring-1 ring-black/5 transition hover:ring-primary/50"
    >
      <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-primary sm:flex">
        <Icon className="size-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-muted-foreground text-xs">{label}</span>
        <span className="block truncate font-semibold text-xl tabular-nums">
          {value}
        </span>
      </span>
    </Link>
  );
}
