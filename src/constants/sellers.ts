import type { Shop } from "@/types";

export type SellerSeed = {
  id: string;
  name: string;
  email: string;
  phone: string;
  categories: string[];
  shop: Shop;
};

export const SELLER_SEEDS: SellerSeed[] = [
  {
    id: "seller-gadget",
    name: "ธนพล ศรีสุข",
    email: "seller@fdeshop.test",
    phone: "0812345678",
    categories: ["phones", "computers", "gadgets"],
    shop: {
      name: "Gadget Hub TH",
      tagline: "มือถือ โน้ตบุ๊ก และอุปกรณ์ไอทีของแท้ ประกันศูนย์",
      avatarColor: "#2563eb",
      promptPayId: "0812345678",
      bankAccountName: "บจก. แกดเจ็ต ฮับ",
      location: "กรุงเทพมหานคร",
    },
  },
  {
    id: "seller-home",
    name: "สุภาวดี มีสุข",
    email: "home@fdeshop.test",
    phone: "0898765432",
    categories: ["kitchen", "home", "groceries"],
    shop: {
      name: "บ้านสบาย Living",
      tagline: "ของใช้ในบ้าน เครื่องครัว และของกินคุณภาพดี",
      avatarColor: "#16a34a",
      promptPayId: "0898765432",
      bankAccountName: "สุภาวดี มีสุข",
      location: "นนทบุรี",
    },
  },
  {
    id: "seller-style",
    name: "ณัฐวุฒิ แสงทอง",
    email: "style@fdeshop.test",
    phone: "0861122334",
    categories: ["women", "men", "accessories", "beauty"],
    shop: {
      name: "Style Street BKK",
      tagline: "แฟชั่น ความงาม และเครื่องประดับ อัปเดตทุกสัปดาห์",
      avatarColor: "#db2777",
      promptPayId: "0861122334",
      bankAccountName: "ณัฐวุฒิ แสงทอง",
      location: "กรุงเทพมหานคร",
    },
  },
  {
    id: "seller-sport",
    name: "กิตติพัฒน์ วงศ์ใหญ่",
    email: "sport@fdeshop.test",
    phone: "0855566778",
    categories: ["sports"],
    shop: {
      name: "Active Sport",
      tagline: "อุปกรณ์กีฬาครบทุกประเภท ส่งไวทั่วไทย",
      avatarColor: "#ea580c",
      promptPayId: "0855566778",
      bankAccountName: "กิตติพัฒน์ วงศ์ใหญ่",
      location: "เชียงใหม่",
    },
  },
];
