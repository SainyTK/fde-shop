import { BANKS, SLIP_API_ID, SLIP_COUNTRY } from "@/constants";
import type { SlipCheck, SlipCheckItem, SlipPayload, SlipScan } from "@/types";
import { formatAmount } from "./format";

type TlvField = {
  tag: string;
  value: string;
};

export function crc16(text: string): string {
  let crc = 0xffff;
  for (const char of text) {
    crc ^= char.charCodeAt(0) << 8;
    for (let bit = 0; bit < 8; bit++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function parseTlv(text: string): TlvField[] | null {
  const fields: TlvField[] = [];
  let index = 0;
  while (index < text.length) {
    const tag = text.slice(index, index + 2);
    const length = Number(text.slice(index + 2, index + 4));
    if (tag.length < 2 || !Number.isInteger(length)) {
      return null;
    }
    const value = text.slice(index + 4, index + 4 + length);
    if (value.length !== length) {
      return null;
    }
    fields.push({ tag, value });
    index += 4 + length;
  }
  return fields;
}

function tlv(tag: string, value: string): string {
  return `${tag}${String(value.length).padStart(2, "0")}${value}`;
}

export function buildSlipPayload(payload: SlipPayload): string {
  const body =
    tlv(
      "00",
      tlv("00", SLIP_API_ID) +
        tlv("01", payload.bankCode) +
        tlv("02", payload.transRef),
    ) + tlv("51", SLIP_COUNTRY);
  const withCrcTag = `${body}9104`;
  return `${withCrcTag}${crc16(withCrcTag)}`;
}

export function parseSlipPayload(text: string): SlipPayload | null {
  const trimmed = text.trim();
  const fields = parseTlv(trimmed);
  if (!fields) {
    return null;
  }
  const crcField = fields.at(-1);
  if (crcField?.tag !== "91" || crcField.value.length !== 4) {
    return null;
  }
  if (crc16(trimmed.slice(0, -4)) !== crcField.value.toUpperCase()) {
    return null;
  }
  const head = fields.find((field) => field.tag === "00");
  const country = fields.find((field) => field.tag === "51");
  const inner = head ? parseTlv(head.value) : null;
  if (!inner || country?.value !== SLIP_COUNTRY) {
    return null;
  }
  const apiId = inner.find((field) => field.tag === "00")?.value;
  const bankCode = inner.find((field) => field.tag === "01")?.value;
  const transRef = inner.find((field) => field.tag === "02")?.value;
  if (apiId !== SLIP_API_ID || !bankCode || !transRef) {
    return null;
  }
  return { bankCode, transRef };
}

export function findAmounts(text: string): number[] {
  const matches = text.match(/\d{1,3}(?:[,\s]\d{3})*\.\d{2}/g) ?? [];
  return matches.map((match) => Number(match.replace(/[,\s]/g, "")));
}

export function bankName(code: string): string {
  return BANKS[code] ?? `ธนาคารรหัส ${code}`;
}

export function evaluateSlip(
  scan: SlipScan,
  expectedAmount: number,
  usedReferences: string[],
): SlipCheck {
  const payload = scan.qrText ? parseSlipPayload(scan.qrText) : null;
  const amounts = findAmounts(scan.ocrText);
  const amountFound =
    amounts.find((amount) => amount === expectedAmount) ??
    (amounts.length > 0 ? Math.max(...amounts) : null);
  const duplicate = payload ? usedReferences.includes(payload.transRef) : false;
  const items: SlipCheckItem[] = [
    {
      key: "qr",
      passed: scan.qrText !== null,
      detail: scan.qrText ? "" : "ลองใช้ภาพสลิปที่ชัดขึ้น",
    },
    {
      key: "format",
      passed: payload !== null,
      detail: payload
        ? `${bankName(payload.bankCode)} เลขอ้างอิง ${payload.transRef}`
        : "QR ไม่ใช่รูปแบบสลิปโอนเงินของธนาคารไทย",
    },
    {
      key: "duplicate",
      passed: payload !== null && !duplicate,
      detail: duplicate ? "สลิปนี้เคยถูกใช้กับคำสั่งซื้ออื่นแล้ว" : "",
    },
    {
      key: "amount",
      passed: amountFound === expectedAmount,
      detail:
        amountFound === null
          ? `อ่านยอดเงินจากสลิปไม่ได้ (ต้องเป็น ${formatAmount(expectedAmount)} บาท)`
          : `ยอดบนสลิป ${formatAmount(amountFound)} บาท / ยอดที่ต้องชำระ ${formatAmount(expectedAmount)} บาท`,
    },
  ];
  return {
    payload,
    amountFound,
    items,
    passed: items.every((item) => item.passed),
  };
}

export function createTransRef(at: string, digits: string): string {
  const date = new Date(at);
  const stamp = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
    date.getSeconds(),
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join("");
  return `${stamp}${digits}`.slice(0, 25);
}

export function slipBlockingReason(check: SlipCheck): string | null {
  const failed = (key: SlipCheckItem["key"]) =>
    check.items.find((item) => item.key === key)?.passed === false;
  if (failed("qr") || failed("format")) {
    return "สลิปนี้ไม่มี QR ตรวจสอบของธนาคาร กรุณาใช้สลิปจากแอปธนาคาร";
  }
  if (failed("duplicate")) {
    return "สลิปนี้เคยถูกใช้แล้ว";
  }
  if (check.amountFound !== null && failed("amount")) {
    return "ยอดเงินบนสลิปไม่ตรงกับยอดที่ต้องชำระ";
  }
  return null;
}
