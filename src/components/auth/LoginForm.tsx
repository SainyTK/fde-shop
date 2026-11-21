"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Field } from "@/components/common";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DEMO_PASSWORD, type DemoAccount } from "@/constants";
import { useShopStore } from "@/store";
import { DemoAccounts } from "./DemoAccounts";
import { redirectTarget } from "./redirectTarget";

export function LoginForm() {
  const login = useShopStore((state) => state.login);
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const signIn = async (emailValue: string, passwordValue: string) => {
    setPending(true);
    setError(null);
    const result = await login(emailValue, passwordValue);
    setPending(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const user = useShopStore
      .getState()
      .data.users.find(
        (item) => item.id === useShopStore.getState().data.sessionUserId,
      );
    toast.success(`ยินดีต้อนรับ ${user?.name ?? ""}`);
    router.replace(redirectTarget(user?.role ?? "buyer", params.get("next")));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    signIn(email, password);
  };

  const pick = (account: DemoAccount) => {
    setEmail(account.email);
    setPassword(DEMO_PASSWORD);
    signIn(account.email, DEMO_PASSWORD);
  };

  return (
    <div className="flex flex-col gap-5">
      <h1 className="font-medium text-xl">เข้าสู่ระบบ</h1>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Field id="email" label="อีเมล">
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="h-10"
          />
        </Field>
        <Field id="password" label="รหัสผ่าน">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="h-10"
          />
        </Field>
        {error ? (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        ) : null}
        <Button type="submit" size="lg" className="h-10" disabled={pending}>
          เข้าสู่ระบบ
        </Button>
      </form>
      <DemoAccounts onPick={pick} disabled={pending} />
      <p className="text-center text-muted-foreground text-sm">
        ยังไม่มีบัญชี?{" "}
        <Link
          href="/register"
          className="font-medium text-primary hover:underline"
        >
          สมัครใหม่
        </Link>
      </p>
    </div>
  );
}
