"use client";

import { ShoppingBag, Store } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib";
import { type RegisterForm as RegisterFields, useShopStore } from "@/store";
import type { Role } from "@/types";

const ROLE_OPTIONS: {
  role: Role;
  label: string;
  description: string;
  icon: typeof Store;
}[] = [
  {
    role: "buyer",
    label: "ผู้ซื้อ",
    description: "ช้อปและติดตามคำสั่งซื้อ",
    icon: ShoppingBag,
  },
  {
    role: "seller",
    label: "ผู้ขาย",
    description: "เปิดร้านและจัดการสต็อก",
    icon: Store,
  },
];

export function RegisterForm() {
  const register = useShopStore((state) => state.register);
  const router = useRouter();
  const params = useSearchParams();
  const [form, setForm] = useState<RegisterFields>({
    role: params.get("role") === "seller" ? "seller" : "buyer",
    name: "",
    email: "",
    phone: "",
    password: "",
    shopName: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const set = <K extends keyof RegisterFields>(
    key: K,
    value: RegisterFields[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setPending(true);
    const result = await register(form);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    toast.success("สมัครสมาชิกสำเร็จ");
    router.replace(form.role === "seller" ? "/seller" : "/");
  };

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <h1 className="font-medium text-xl">สมัครใหม่</h1>
      <div
        className="grid grid-cols-2 gap-2"
        role="radiogroup"
        aria-label="ประเภทบัญชี"
      >
        {ROLE_OPTIONS.map((option) => (
          <button
            key={option.role}
            type="button"
            aria-pressed={form.role === option.role}
            onClick={() => set("role", option.role)}
            className={cn(
              "flex flex-col items-start gap-1 rounded-md border p-3 text-left transition",
              form.role === option.role
                ? "border-primary bg-secondary ring-1 ring-primary"
                : "hover:border-primary/50",
            )}
          >
            <option.icon
              className={cn(
                "size-5",
                form.role === option.role
                  ? "text-primary"
                  : "text-muted-foreground",
              )}
            />
            <span className="font-medium text-sm">{option.label}</span>
            <span className="text-muted-foreground text-xs">
              {option.description}
            </span>
          </button>
        ))}
      </div>
      {form.role === "seller" ? (
        <Field id="shopName" label="ชื่อร้าน">
          <Input
            id="shopName"
            value={form.shopName}
            onChange={(event) => set("shopName", event.target.value)}
            className="h-10"
          />
        </Field>
      ) : null}
      <Field id="name" label="ชื่อ-นามสกุล">
        <Input
          id="name"
          autoComplete="name"
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
          className="h-10"
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field id="email" label="อีเมล">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(event) => set("email", event.target.value)}
            className="h-10"
          />
        </Field>
        <Field id="phone" label="เบอร์โทร">
          <Input
            id="phone"
            inputMode="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={(event) => set("phone", event.target.value)}
            className="h-10"
          />
        </Field>
      </div>
      <Field id="password" label="รหัสผ่าน" hint="อย่างน้อย 8 ตัวอักษร">
        <Input
          id="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(event) => set("password", event.target.value)}
          className="h-10"
        />
      </Field>
      {error ? (
        <p className="text-destructive text-sm" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" size="lg" className="h-10" disabled={pending}>
        สมัครสมาชิก
      </Button>
      <p className="text-center text-muted-foreground text-sm">
        มีบัญชีแล้ว?{" "}
        <Link
          href="/login"
          className="font-medium text-primary hover:underline"
        >
          เข้าสู่ระบบ
        </Link>
      </p>
    </form>
  );
}
