import generatePayload from "promptpay-qr";

export function promptPayPayload(target: string, amount: number): string {
  return generatePayload(target, { amount });
}
