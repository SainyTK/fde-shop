import type { Result, Role, ShopData, User } from "@/types";
import { newId } from "./id";

export type RegisterInput = {
  role: Role;
  name: string;
  email: string;
  phone: string;
  passwordHash: string;
  shopName: string;
};

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function validateRegistration(
  input: Omit<RegisterInput, "passwordHash"> & { password: string },
): string | null {
  if (input.name.trim().length < 2) {
    return "กรุณากรอกชื่อ";
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim())) {
    return "รูปแบบอีเมลไม่ถูกต้อง";
  }
  if (!/^0\d{8,9}$/.test(input.phone.trim())) {
    return "เบอร์โทรต้องขึ้นต้นด้วย 0 และมี 9-10 หลัก";
  }
  if (input.password.length < 8) {
    return "รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร";
  }
  if (input.role === "seller" && input.shopName.trim().length < 3) {
    return "ชื่อร้านต้องมีอย่างน้อย 3 ตัวอักษร";
  }
  return null;
}

export function registerUser(
  data: ShopData,
  input: RegisterInput,
  avatarColor: string,
  now: string,
): Result<{ data: ShopData; user: User }> {
  const email = normalizeEmail(input.email);
  if (data.users.some((user) => user.email === email)) {
    return { ok: false, error: "อีเมลนี้ถูกใช้สมัครแล้ว" };
  }
  const user: User = {
    id: newId(),
    role: input.role,
    name: input.name.trim(),
    email,
    phone: input.phone.trim(),
    passwordHash: input.passwordHash,
    createdAt: now,
    address: null,
    shop:
      input.role === "seller"
        ? {
            name: input.shopName.trim(),
            tagline: "ร้านค้าใหม่บน FDE Shop",
            avatarColor,
            promptPayId: input.phone.trim(),
            bankAccountName: input.name.trim(),
            location: "กรุงเทพมหานคร",
          }
        : null,
  };
  return {
    ok: true,
    value: {
      user,
      data: { ...data, users: [...data.users, user], sessionUserId: user.id },
    },
  };
}
