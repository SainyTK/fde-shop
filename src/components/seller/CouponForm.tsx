"use client";

import { type FormEvent, useState } from "react";
import { Field, OptionSelect } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { COUPON_TYPE_LABEL } from "@/constants";
import type { Coupon, CouponInput, CouponType } from "@/types";

const TYPE_OPTIONS = (Object.keys(COUPON_TYPE_LABEL) as CouponType[]).map(
  (type) => ({
    value: type,
    label: COUPON_TYPE_LABEL[type],
  }),
);

function toDateInput(iso: string): string {
  return iso.slice(0, 10);
}

function defaultExpiry(): string {
  const date = new Date();
  date.setDate(date.getDate() + 30);
  return date.toISOString();
}

type CouponFormProps = {
  coupon: Coupon | null;
  onSubmit: (input: CouponInput) => void;
};

export function CouponForm({ coupon, onSubmit }: CouponFormProps) {
  const [code, setCode] = useState(coupon?.code ?? "");
  const [type, setType] = useState<CouponType>(coupon?.type ?? "percent");
  const [value, setValue] = useState(coupon ? String(coupon.value) : "");
  const [maxDiscount, setMaxDiscount] = useState(
    coupon?.maxDiscount ? String(coupon.maxDiscount) : "",
  );
  const [minSpend, setMinSpend] = useState(
    coupon ? String(coupon.minSpend) : "0",
  );
  const [expiresAt, setExpiresAt] = useState(
    toDateInput(coupon?.expiresAt ?? defaultExpiry()),
  );
  const [usageLimit, setUsageLimit] = useState(
    coupon ? String(coupon.usageLimit) : "100",
  );
  const [active, setActive] = useState(coupon?.active ?? true);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit({
      code,
      type,
      value: Number(value),
      maxDiscount: maxDiscount.trim() ? Number(maxDiscount) : null,
      minSpend: Number(minSpend || 0),
      expiresAt: new Date(`${expiresAt}T23:59:59+07:00`).toISOString(),
      usageLimit: Number(usageLimit),
      active,
    });
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field id="coupon-code" label="โค้ด" hint="ภาษาอังกฤษหรือตัวเลข 4-16 ตัว">
        <Input
          id="coupon-code"
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          className="font-mono"
        />
      </Field>
      <Field id="coupon-type" label="ประเภทส่วนลด">
        <OptionSelect
          id="coupon-type"
          value={type}
          options={TYPE_OPTIONS}
          onChange={setType}
        />
      </Field>
      <Field
        id="coupon-value"
        label={type === "percent" ? "ส่วนลด (%)" : "ส่วนลด (บาท)"}
      >
        <Input
          id="coupon-value"
          inputMode="decimal"
          value={value}
          onChange={(event) => setValue(event.target.value)}
        />
      </Field>
      {type === "percent" ? (
        <Field id="coupon-max" label="ลดสูงสุด (บาท)" hint="เว้นว่างถ้าไม่จำกัด">
          <Input
            id="coupon-max"
            inputMode="decimal"
            value={maxDiscount}
            onChange={(event) => setMaxDiscount(event.target.value)}
          />
        </Field>
      ) : (
        <div className="hidden sm:block" />
      )}
      <Field id="coupon-min" label="ยอดซื้อขั้นต่ำ (บาท)">
        <Input
          id="coupon-min"
          inputMode="decimal"
          value={minSpend}
          onChange={(event) => setMinSpend(event.target.value)}
        />
      </Field>
      <Field id="coupon-limit" label="จำนวนสิทธิ์ทั้งหมด" hint="ผู้ซื้อแต่ละคนใช้ได้ 1 ครั้ง">
        <Input
          id="coupon-limit"
          inputMode="numeric"
          value={usageLimit}
          onChange={(event) => setUsageLimit(event.target.value)}
        />
      </Field>
      <Field id="coupon-expiry" label="ใช้ได้ถึงวันที่">
        <Input
          id="coupon-expiry"
          type="date"
          value={expiresAt}
          onChange={(event) => setExpiresAt(event.target.value)}
        />
      </Field>
      <label className="flex items-center gap-3 self-end pb-2 text-sm">
        <Switch checked={active} onCheckedChange={setActive} />
        เปิดใช้งาน
      </label>
      <Button type="submit" className="sm:col-span-2">
        {coupon ? "บันทึกคูปอง" : "สร้างคูปอง"}
      </Button>
    </form>
  );
}
