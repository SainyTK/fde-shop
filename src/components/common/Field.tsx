import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

type FieldProps = {
  id: string;
  label: string;
  hint?: string;
  children: ReactNode;
};

export function Field({ id, label, hint, children }: FieldProps) {
  return (
    <div className="grid content-start gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
      {hint ? <p className="text-muted-foreground text-xs">{hint}</p> : null}
    </div>
  );
}
