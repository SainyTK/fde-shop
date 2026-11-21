import { createRandom } from "@/utils";

export function now(): string {
  return new Date().toISOString();
}

export function freshRandom() {
  return createRandom(Date.now());
}
