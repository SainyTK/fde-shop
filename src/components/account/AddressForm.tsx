"use client";

import { type FormEvent, useState } from "react";
import { Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Address } from "@/types";

const EMPTY: Address = {
  recipient: "",
  phone: "",
  line: "",
  district: "",
  province: "",
  postcode: "",
};

const FIELDS: {
  key: keyof Address;
  label: string;
  wide?: boolean;
  inputMode?: "tel" | "numeric";
}[] = [
  { key: "recipient", label: "ชื่อผู้รับ" },
  { key: "phone", label: "เบอร์โทร", inputMode: "tel" },
  { key: "line", label: "บ้านเลขที่ ถนน ซอย", wide: true },
  { key: "district", label: "เขต/อำเภอ" },
  { key: "province", label: "จังหวัด" },
  { key: "postcode", label: "รหัสไปรษณีย์", inputMode: "numeric" },
];

export function validateAddress(address: Address): string | null {
  if (FIELDS.some((field) => address[field.key].trim() === "")) {
    return "กรุณากรอกที่อยู่ให้ครบทุกช่อง";
  }
  if (!/^0\d{8,9}$/.test(address.phone.trim())) {
    return "เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก";
  }
  if (!/^\d{5}$/.test(address.postcode.trim())) {
    return "รหัสไปรษณีย์ต้องมี 5 หลัก";
  }
  return null;
}

type AddressFormProps = {
  initial: Address | null;
  submitLabel: string;
  onSave: (address: Address) => void;
};

export function AddressForm({
  initial,
  submitLabel,
  onSave,
}: AddressFormProps) {
  const [address, setAddress] = useState<Address>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const problem = validateAddress(address);
    setError(problem);
    if (!problem) {
      onSave(address);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      {FIELDS.map((field) => (
        <div
          key={field.key}
          className={field.wide ? "sm:col-span-2" : undefined}
        >
          <Field id={`address-${field.key}`} label={field.label}>
            <Input
              id={`address-${field.key}`}
              inputMode={field.inputMode}
              value={address[field.key]}
              onChange={(event) =>
                setAddress((current) => ({
                  ...current,
                  [field.key]: event.target.value,
                }))
              }
            />
          </Field>
        </div>
      ))}
      {error ? (
        <p className="text-destructive text-sm sm:col-span-2">{error}</p>
      ) : null}
      <Button type="submit" className="sm:col-span-2 sm:justify-self-end">
        {submitLabel}
      </Button>
    </form>
  );
}
