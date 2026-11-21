"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib";

export type Option<T extends string> = {
  value: T;
  label: string;
};

type OptionSelectProps<T extends string> = {
  id: string;
  value: T;
  options: Option<T>[];
  onChange: (value: T) => void;
  className?: string;
};

export function OptionSelect<T extends string>({
  id,
  value,
  options,
  onChange,
  className,
}: OptionSelectProps<T>) {
  return (
    <Select
      items={options}
      value={value}
      onValueChange={(next) => next !== null && onChange(next as T)}
    >
      <SelectTrigger id={id} className={cn("h-9 w-full", className)}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
