"use client";

import { ImageUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib";

export function SlipDropzone({ onFile }: { onFile: (file: File) => void }) {
  const [dragging, setDragging] = useState(false);
  return (
    <label
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        const file = event.dataTransfer.files[0];
        if (file) {
          onFile(file);
        }
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed px-4 py-8 text-center transition-colors",
        dragging
          ? "border-primary bg-secondary"
          : "border-input hover:border-primary/60 hover:bg-muted/40",
      )}
    >
      <ImageUp className="size-8 text-primary" />
      <span className="font-medium text-sm">อัปโหลดสลิปโอนเงิน</span>
      <span className="text-muted-foreground text-xs">
        ลากไฟล์มาวาง หรือแตะเพื่อเลือกรูป (JPG, PNG)
      </span>
      <input
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            onFile(file);
          }
        }}
      />
    </label>
  );
}
