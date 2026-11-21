export type Category = {
  id: string;
  label: string;
  sources: string[];
};

export const CATEGORIES: Category[] = [
  { id: "phones", label: "มือถือและแท็บเล็ต", sources: ["smartphones", "tablets"] },
  { id: "computers", label: "คอมพิวเตอร์", sources: ["laptops"] },
  { id: "gadgets", label: "อุปกรณ์เสริมมือถือ", sources: ["mobile-accessories"] },
  { id: "kitchen", label: "เครื่องครัว", sources: ["kitchen-accessories"] },
  {
    id: "home",
    label: "บ้านและเฟอร์นิเจอร์",
    sources: ["furniture", "home-decoration"],
  },
  { id: "groceries", label: "อาหารและเครื่องดื่ม", sources: ["groceries"] },
  {
    id: "beauty",
    label: "ความงาม",
    sources: ["beauty", "skin-care", "fragrances"],
  },
  {
    id: "women",
    label: "แฟชั่นผู้หญิง",
    sources: ["tops", "womens-dresses", "womens-shoes", "womens-bags"],
  },
  { id: "men", label: "แฟชั่นผู้ชาย", sources: ["mens-shirts", "mens-shoes"] },
  {
    id: "accessories",
    label: "นาฬิกาและเครื่องประดับ",
    sources: [
      "mens-watches",
      "womens-watches",
      "womens-jewellery",
      "sunglasses",
    ],
  },
  {
    id: "sports",
    label: "กีฬาและกิจกรรมกลางแจ้ง",
    sources: ["sports-accessories"],
  },
];
