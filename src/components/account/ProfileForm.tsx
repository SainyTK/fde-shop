"use client";

import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopStore } from "@/store";
import type { User } from "@/types";

export function ProfileForm({ user }: { user: User }) {
  const updateProfile = useShopStore((state) => state.updateProfile);
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const result = updateProfile({ name, phone, address: user.address });
    if (result.ok) {
      toast.success("บันทึกข้อมูลแล้ว");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
      <Field id="profile-email" label="อีเมล">
        <Input id="profile-email" value={user.email} disabled />
      </Field>
      <Field id="profile-name" label="ชื่อ">
        <Input
          id="profile-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </Field>
      <Field id="profile-phone" label="เบอร์โทร">
        <Input
          id="profile-phone"
          inputMode="tel"
          value={phone}
          onChange={(event) => setPhone(event.target.value)}
        />
      </Field>
      <Button type="submit" className="self-end sm:justify-self-end">
        บันทึก
      </Button>
    </form>
  );
}
