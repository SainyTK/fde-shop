"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field, PageTitle, Panel } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopStore } from "@/store";
import type { Shop, User } from "@/types";

const FIELDS: { key: keyof Shop; label: string; hint?: string }[] = [
  { key: "name", label: "ชื่อร้าน" },
  { key: "tagline", label: "คำอธิบายร้าน" },
  { key: "location", label: "จังหวัดที่ส่งสินค้า" },
  {
    key: "promptPayId",
    label: "พร้อมเพย์สำหรับรับเงิน",
    hint: "เบอร์มือถือ 10 หลัก หรือเลขบัตรประชาชน 13 หลัก",
  },
  { key: "bankAccountName", label: "ชื่อบัญชีที่แสดงตอนชำระเงิน" },
];

export function ShopSettingsForm({ seller }: { seller: User }) {
  const updateShop = useShopStore((state) => state.updateShop);
  const [shop, setShop] = useState<Shop | null>(seller.shop);
  if (!shop) {
    return null;
  }

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = updateShop(shop);
    if (result.ok) {
      toast.success("บันทึกข้อมูลร้านแล้ว");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <>
      <PageTitle title="ตั้งค่าร้านค้า" />
      <Panel>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          {FIELDS.map((field) => (
            <Field
              key={field.key}
              id={`shop-${field.key}`}
              label={field.label}
              hint={field.hint}
            >
              <Input
                id={`shop-${field.key}`}
                value={shop[field.key]}
                onChange={(event) =>
                  setShop({ ...shop, [field.key]: event.target.value })
                }
              />
            </Field>
          ))}
          <Button type="submit" className="self-end sm:justify-self-end">
            บันทึก
          </Button>
        </form>
      </Panel>
    </>
  );
}
