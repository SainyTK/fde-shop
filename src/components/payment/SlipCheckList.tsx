import { CircleAlert, CircleCheck, CircleX } from "lucide-react";
import { SLIP_CHECK_LABEL } from "@/constants";
import { cn } from "@/lib";
import type { SlipCheck } from "@/types";

export function SlipCheckList({ check }: { check: SlipCheck }) {
  if (check.items.length === 0) {
    return <p className="text-muted-foreground text-sm">ไม่มีผลตรวจสลิป</p>;
  }
  return (
    <ul className="flex flex-col gap-2.5">
      {check.items.map((item) => {
        const unreadable =
          item.key === "amount" && !item.passed && check.amountFound === null;
        const Icon = item.passed
          ? CircleCheck
          : unreadable
            ? CircleAlert
            : CircleX;
        return (
          <li key={item.key} className="flex gap-2.5 text-sm">
            <Icon
              className={cn(
                "mt-0.5 size-4 shrink-0",
                item.passed
                  ? "text-success"
                  : unreadable
                    ? "text-warning"
                    : "text-destructive",
              )}
            />
            <div>
              <p className="font-medium">{SLIP_CHECK_LABEL[item.key]}</p>
              {item.detail ? (
                <p className="text-muted-foreground">{item.detail}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
