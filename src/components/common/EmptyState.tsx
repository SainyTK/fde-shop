import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

type EmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
        <Icon className="size-8" />
      </div>
      <p className="font-medium text-base">{title}</p>
      {description ? (
        <p className="max-w-sm text-muted-foreground text-sm">{description}</p>
      ) : null}
      {action}
    </div>
  );
}
