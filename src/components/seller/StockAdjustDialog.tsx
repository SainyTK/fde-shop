"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field, OptionSelect } from "@/components/common";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useShopStore } from "@/store";
import type { Product } from "@/types";

type Mode = "restock" | "set";

const MODES = [
  { value: "restock" as const, label: "รับสินค้าเข้า (เพิ่มจากยอดเดิม)" },
  { value: "set" as const, label: "ปรับยอดตามที่นับได้จริง" },
];

export function StockAdjustDialog({ product }: { product: Product }) {
  const adjustStock = useShopStore((state) => state.adjustStock);
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("restock");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const parsed = quantity.trim() === "" ? Number.NaN : Number(quantity);
  const preview = Number.isFinite(parsed)
    ? mode === "restock"
      ? product.stock + parsed
      : parsed
    : null;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = adjustStock({
      productId: product.id,
      mode,
      quantity: parsed,
      note,
    });
    if (!result.ok) {
      toast.error(result.error);
      return;
    }
    toast.success(`อัปเดตสต็อก ${product.name} แล้ว`);
    setOpen(false);
    setQuantity("");
    setNote("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm" />}>
        ปรับสต็อก
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>ปรับสต็อกสินค้า</DialogTitle>
          <DialogDescription className="line-clamp-1">
            {product.name}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="flex flex-col gap-4">
          <Field id="stock-mode" label="ประเภท">
            <OptionSelect
              id="stock-mode"
              value={mode}
              options={MODES}
              onChange={setMode}
            />
          </Field>
          <Field
            id="stock-quantity"
            label={
              mode === "restock" ? "จำนวนที่รับเข้า (ชิ้น)" : "ยอดคงเหลือที่นับได้ (ชิ้น)"
            }
          >
            <Input
              id="stock-quantity"
              inputMode="numeric"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              autoFocus
            />
          </Field>
          <Field id="stock-note" label="หมายเหตุ">
            <Input
              id="stock-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={
                mode === "restock"
                  ? "เช่น ล็อตจากซัพพลายเออร์"
                  : "เช่น นับสต็อกประจำเดือน"
              }
            />
          </Field>
          <p className="rounded-md bg-muted/60 p-3 text-sm">
            คงเหลือปัจจุบัน <span className="font-medium">{product.stock}</span> ชิ้น
            {preview !== null ? (
              <>
                {" "}
                หลังปรับ{" "}
                <span className="font-medium text-primary">{preview}</span> ชิ้น
              </>
            ) : null}
          </p>
          <Button type="submit">บันทึก</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
