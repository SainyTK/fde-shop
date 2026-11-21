import type { ReactNode } from "react";
import { cn } from "@/lib";

type PanelProps = {
  title?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
};

export function Panel({ title, action, className, children }: PanelProps) {
  return (
    <section
      className={cn(
        "rounded-lg bg-card shadow-xs ring-1 ring-black/5",
        className,
      )}
    >
      {title || action ? (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-3 sm:px-5">
          <h2 className="font-medium text-base">{title}</h2>
          {action}
        </header>
      ) : null}
      <div className="p-4 sm:p-5">{children}</div>
    </section>
  );
}
