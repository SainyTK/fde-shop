import type { ReactNode } from "react";

type PageTitleProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageTitle({ title, description, action }: PageTitleProps) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-semibold text-xl sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
