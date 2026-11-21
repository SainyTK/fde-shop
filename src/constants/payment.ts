export const BANKS: Record<string, string> = {
  "002": "ธนาคารกรุงเทพ",
  "004": "ธนาคารกสิกรไทย",
  "006": "ธนาคารกรุงไทย",
  "011": "ธนาคารทหารไทยธนชาต",
  "014": "ธนาคารไทยพาณิชย์",
  "025": "ธนาคารกรุงศรีอยุธยา",
  "030": "ธนาคารออมสิน",
  "069": "ธนาคารเกียรตินาคินภัทร",
};

export const DEMO_SLIP_BANK = "004";
export const SLIP_API_ID = "000001";
export const SLIP_COUNTRY = "TH";
export const SLIP_MAX_WIDTH = 900;

export const SLIP_CHECK_LABEL = {
  qr: "พบ QR บนสลิป",
  format: "QR เป็นรูปแบบสลิปธนาคารไทยและ checksum ถูกต้อง",
  duplicate: "เลขอ้างอิงไม่ซ้ำกับสลิปที่เคยใช้",
  amount: "ยอดเงินบนสลิปตรงกับยอดคำสั่งซื้อ",
} as const;
