import { Suspense } from "react";
import { AuthLayout, LoginForm } from "@/components/auth";

export const metadata = { title: "เข้าสู่ระบบ" };

export default function LoginPage() {
  return (
    <AuthLayout title="เข้าสู่ระบบ">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
