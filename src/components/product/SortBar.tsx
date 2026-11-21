"use client";

import { cn } from "@/lib";
import type { ProductSort } from "@/utils";

const SORTS: { id: ProductSort; label: string }[] = [
  { id: "relevance", label: "เกี่ยวข้อง" },
  { id: "latest", label: "ล่าสุด" },
  { id: "best-selling", label: "ขายดี" },
  { id: "price-asc", label: "ราคา ต่ำ-สูง" },
  { id: "price-desc", label: "ราคา สูง-ต่ำ" },
];

type SortBarProps = {
  value: ProductSort;
  onChange: (sort: ProductSort) => void;
};

export function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto rounded-sm bg-muted px-3 py-2.5 [scrollbar-width:none]">
      <span className="shrink-0 text-muted-foreground text-sm">เรียงโดย</span>
      {SORTS.map((sort) => (
        <button
          key={sort.id}
          type="button"
          onClick={() => onChange(sort.id)}
          className={cn(
            "h-8 shrink-0 rounded-sm px-3 text-sm shadow-xs transition-colors",
            value === sort.id
              ? "bg-primary text-white"
              : "bg-white hover:bg-white/70",
          )}
        >
          {sort.label}
        </button>
      ))}
    </div>
  );
}
