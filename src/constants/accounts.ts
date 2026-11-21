import type { Role } from "@/types";

export const DEMO_PASSWORD = "demo1234";
export const DEMO_PASSWORD_HASH =
  "0ead2060b65992dca4769af601a1b3a35ef38cfad2c2c465bb160ea764157c5d";

export type DemoAccount = {
  role: Role;
  label: string;
  email: string;
};

export const DEMO_ACCOUNTS: DemoAccount[] = [
  { role: "buyer", label: "ผู้ซื้อ", email: "buyer@fdeshop.test" },
  {
    role: "seller",
    label: "ผู้ขาย (Gadget Hub TH)",
    email: "seller@fdeshop.test",
  },
  {
    role: "seller",
    label: "ผู้ขาย (บ้านสบาย Living)",
    email: "home@fdeshop.test",
  },
];

export const ROLE_LABEL: Record<Role, string> = {
  buyer: "ผู้ซื้อ",
  seller: "ผู้ขาย",
};
