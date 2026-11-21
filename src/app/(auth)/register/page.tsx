import { Suspense } from "react";
import { AuthLayout, RegisterForm } from "@/components/auth";

export const metadata = { title: "สมัครใหม่" };

export default function RegisterPage() {
  return (
    <AuthLayout title="สมัครใหม่">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthLayout>
  );
}
