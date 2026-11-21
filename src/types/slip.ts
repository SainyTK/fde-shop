export type SlipPayload = {
  bankCode: string;
  transRef: string;
};

export type SlipCheckItem = {
  key: "qr" | "format" | "duplicate" | "amount";
  passed: boolean;
  detail: string;
};

export type SlipCheck = {
  payload: SlipPayload | null;
  amountFound: number | null;
  items: SlipCheckItem[];
  passed: boolean;
};

export type SlipScan = {
  qrText: string | null;
  ocrText: string;
};
