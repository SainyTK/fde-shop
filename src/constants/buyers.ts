import type { Address } from "@/types";

export type BuyerSeed = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: Address;
};

export const BUYER_SEEDS: BuyerSeed[] = [
  {
    id: "buyer-demo",
    name: "มานี ใจดี",
    email: "buyer@fdeshop.test",
    phone: "0891234567",
    address: {
      recipient: "มานี ใจดี",
      phone: "0891234567",
      line: "99/12 หมู่บ้านสุขสันต์ ถนนพหลโยธิน",
      district: "จตุจักร",
      province: "กรุงเทพมหานคร",
      postcode: "10900",
    },
  },
  {
    id: "buyer-second",
    name: "ปิติ รักเรียน",
    email: "piti@fdeshop.test",
    phone: "0877654321",
    address: {
      recipient: "ปิติ รักเรียน",
      phone: "0877654321",
      line: "45 ซอยนิมมานเหมินท์ 9",
      district: "เมืองเชียงใหม่",
      province: "เชียงใหม่",
      postcode: "50200",
    },
  },
];
