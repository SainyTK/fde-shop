export const SHIPPING_FEE = 40;
export const FREE_SHIPPING_MIN = 1000;

export type Carrier = {
  id: string;
  name: string;
  prefix: string;
};

export const CARRIERS: Carrier[] = [
  { id: "flash", name: "Flash Express", prefix: "TH" },
  { id: "kerry", name: "Kerry Express", prefix: "KEX" },
  { id: "jt", name: "J&T Express", prefix: "JT" },
  { id: "thaipost", name: "ไปรษณีย์ไทย EMS", prefix: "EF" },
];

export const TRACKING_PRESETS: string[] = [
  "พัสดุถึงศูนย์คัดแยกสินค้า",
  "พัสดุออกจากศูนย์คัดแยกสินค้า",
  "พัสดุถึงสาขาปลายทาง",
  "พนักงานกำลังนำส่งพัสดุ",
];
