"use client";

import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

type QuantityStepperProps = {
  value: number;
  max: number;
  onChange: (value: number) => void;
};

export function QuantityStepper({
  value,
  max,
  onChange,
}: QuantityStepperProps) {
  const clamp = (next: number) => Math.min(Math.max(next, 1), Math.max(max, 1));
  return (
    <div className="inline-flex items-center rounded-md border bg-background">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="ลดจำนวน"
        disabled={value <= 1}
        onClick={() => onChange(clamp(value - 1))}
      >
        <Minus />
      </Button>
      <input
        aria-label="จำนวน"
        inputMode="numeric"
        className="h-7 w-11 border-x text-center text-sm tabular-nums outline-none"
        value={value}
        onChange={(event) => {
          const parsed = Number(event.target.value.replace(/\D/g, ""));
          onChange(clamp(Number.isFinite(parsed) && parsed > 0 ? parsed : 1));
        }}
      />
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="เพิ่มจำนวน"
        disabled={value >= max}
        onClick={() => onChange(clamp(value + 1))}
      >
        <Plus />
      </Button>
    </div>
  );
}
