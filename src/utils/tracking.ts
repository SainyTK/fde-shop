import type { Carrier } from "@/constants";
import type { Random } from "./random";
import { randomDigits } from "./random";

export function generateTrackingNumber(
  carrier: Carrier,
  random: Random,
): string {
  return `${carrier.prefix}${randomDigits(random, 12)}`;
}

export function generateOrderNumber(at: string, random: Random): string {
  const date = new Date(at);
  const stamp = [date.getFullYear() % 100, date.getMonth() + 1, date.getDate()]
    .map((part) => String(part).padStart(2, "0"))
    .join("");
  return `${stamp}${randomDigits(random, 6)}`;
}
