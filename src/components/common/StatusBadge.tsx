import type { ReactNode } from "react";
import type { StatusTone } from "@/constants";
import { cn } from "@/lib";

const TONE_CLASS: Record<StatusTone, string> = {
  warning: "bg-warning-soft text-warning",
  info: "bg-info-soft text-info",
  success: "bg-success-soft text-success",
  muted: "bg-muted text-muted-foreground",
  danger: "bg-red-50 text-destructive",
};

type StatusBadgeProps = {
  tone: StatusTone;
  children: ReactNode;
  className?: string;
};

export function StatusBadge({ tone, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 font-medium text-xs",
        TONE_CLASS[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
