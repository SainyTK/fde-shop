import {
  BUYER_SEEDS,
  CARRIERS,
  CATALOG,
  DEFAULT_LOW_STOCK_THRESHOLD,
  DEMO_PASSWORD_HASH,
  SELLER_SEEDS,
  TRACKING_PRESETS,
  USD_TO_THB,
} from "@/constants";
import type { Coupon, Product, ShopData, User } from "@/types";
import { categoryFromSource } from "./category";
import {
  addTrackingEvent,
  cancelOrder,
  markDelivered,
  packOrder,
  placeOrders,
  reviewPayment,
  SELLER_CANCELLABLE,
  shipOrder,
} from "./orders";
import { roundPrice } from "./pricing";
import { createRandom, type Random } from "./random";
import { applyStockChange } from "./stock";
import { generateTrackingNumber } from "./tracking";

const HOUR = 3_600_000;
const DAY = 24 * HOUR;

function shift(now: number, offset: number): string {
  return new Date(now + offset).toISOString();
}

function seedUsers(created: string): User[] {
  const sellers: User[] = SELLER_SEEDS.map((seller) => ({
    id: seller.id,
    role: "seller",
    name: seller.name,
    email: seller.email,
    phone: seller.phone,
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: created,
    address: null,
    shop: seller.shop,
  }));
  const buyers: User[] = BUYER_SEEDS.map((buyer) => ({
    id: buyer.id,
    role: "buyer",
    name: buyer.name,
    email: buyer.email,
    phone: buyer.phone,
    passwordHash: DEMO_PASSWORD_HASH,
    createdAt: created,
    address: buyer.address,
    shop: null,
  }));
  return [...sellers, ...buyers];
}

function seedProducts(random: Random, now: number): Product[] {
  return CATALOG.flatMap((entry, index) => {
    const category = categoryFromSource(entry.category);
    const seller = SELLER_SEEDS.find((item) =>
      item.categories.includes(category),
    );
    if (!seller) {
      return [];
    }
    const price = roundPrice(entry.priceUsd * USD_TO_THB);
    const original = roundPrice(price / (1 - entry.discountPercentage / 100));
    const createdAt = shift(now, -(60 - (index % 50)) * DAY);
    return [
      {
        id: entry.slug,
        sellerId: seller.id,
        name: entry.name,
        description: entry.description,
        category,
        brand: entry.brand,
        price,
        originalPrice:
          entry.discountPercentage >= 5 && original > price ? original : null,
        images: entry.images,
        stock: 0,
        lowStockThreshold: DEFAULT_LOW_STOCK_THRESHOLD,
        sold: random.int(3, 2400),
        rating: Math.round(entry.rating * 10) / 10,
        reviews: entry.reviews,
        active: true,
        createdAt,
        updatedAt: createdAt,
      },
    ];
  });
}

type CouponSeed = Omit<Coupon, "id" | "createdAt" | "expiresAt" | "usedBy"> & {
  expiresInDays: number;
  usedCount: number;
};

const COUPON_SEEDS: CouponSeed[] = [
  {
    sellerId: "seller-gadget",
    code: "GADGET10",
    type: "percent",
    value: 10,
    maxDiscount: 500,
    minSpend: 1000,
    usageLimit: 100,
    active: true,
    expiresInDays: 30,
    usedCount: 12,
  },
  {
    sellerId: "seller-gadget",
    code: "GADGET50",
    type: "fixed",
    value: 50,
    maxDiscount: null,
    minSpend: 500,
    usageLimit: 300,
    active: true,
    expiresInDays: 60,
    usedCount: 87,
  },
  {
    sellerId: "seller-gadget",
    code: "SAVE1000",
    type: "fixed",
    value: 1000,
    maxDiscount: null,
    minSpend: 15000,
    usageLimit: 20,
    active: true,
    expiresInDays: 14,
    usedCount: 4,
  },
  {
    sellerId: "seller-gadget",
    code: "FLASH99",
    type: "fixed",
    value: 99,
    maxDiscount: null,
    minSpend: 300,
    usageLimit: 3,
    active: true,
    expiresInDays: 7,
    usedCount: 3,
  },
  {
    sellerId: "seller-gadget",
    code: "OCT2026",
    type: "percent",
    value: 15,
    maxDiscount: 300,
    minSpend: 500,
    usageLimit: 50,
    active: true,
    expiresInDays: -20,
    usedCount: 31,
  },
  {
    sellerId: "seller-home",
    code: "HOME50",
    type: "fixed",
    value: 50,
    maxDiscount: null,
    minSpend: 300,
    usageLimit: 200,
    active: true,
    expiresInDays: 45,
    usedCount: 58,
  },
  {
    sellerId: "seller-home",
    code: "KITCHEN15",
    type: "percent",
    value: 15,
    maxDiscount: 200,
    minSpend: 500,
    usageLimit: 80,
    active: true,
    expiresInDays: 20,
    usedCount: 9,
  },
  {
    sellerId: "seller-style",
    code: "STYLE20",
    type: "percent",
    value: 20,
    maxDiscount: 250,
    minSpend: 600,
    usageLimit: 150,
    active: true,
    expiresInDays: 25,
    usedCount: 40,
  },
  {
    sellerId: "seller-style",
    code: "NEWLOOK",
    type: "fixed",
    value: 120,
    maxDiscount: null,
    minSpend: 900,
    usageLimit: 60,
    active: false,
    expiresInDays: 40,
    usedCount: 2,
  },
  {
    sellerId: "seller-sport",
    code: "SPORT100",
    type: "fixed",
    value: 100,
    maxDiscount: null,
    minSpend: 800,
    usageLimit: 100,
    active: true,
    expiresInDays: 30,
    usedCount: 17,
  },
];

function seedCoupons(now: number): Coupon[] {
  return COUPON_SEEDS.map(({ expiresInDays, usedCount, ...coupon }) => ({
    ...coupon,
    id: `coupon-${coupon.code.toLowerCase()}`,
    expiresAt: shift(now, expiresInDays * DAY),
    createdAt: shift(now, -40 * DAY),
    usedBy: Array.from(
      { length: usedCount },
      (_, index) => `past-buyer-${index}`,
    ),
  }));
}

type OrderScript = {
  buyerId: string;
  sellerId: string;
  daysAgo: number;
  stage:
    | "awaiting_payment"
    | "paid"
    | "packed"
    | "shipped"
    | "delivered"
    | "cancelled";
  couponCode?: string;
};

const ORDER_SCRIPTS: OrderScript[] = [
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 13,
    stage: "delivered",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-home",
    daysAgo: 12,
    stage: "delivered",
  },
  {
    buyerId: "buyer-demo",
    sellerId: "seller-gadget",
    daysAgo: 11,
    stage: "delivered",
    couponCode: "GADGET10",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-style",
    daysAgo: 10,
    stage: "delivered",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 9,
    stage: "delivered",
  },
  {
    buyerId: "buyer-demo",
    sellerId: "seller-home",
    daysAgo: 8,
    stage: "delivered",
    couponCode: "HOME50",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-sport",
    daysAgo: 7,
    stage: "delivered",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 6,
    stage: "cancelled",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 5,
    stage: "delivered",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-home",
    daysAgo: 4,
    stage: "delivered",
  },
  {
    buyerId: "buyer-demo",
    sellerId: "seller-style",
    daysAgo: 3,
    stage: "shipped",
    couponCode: "STYLE20",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 3,
    stage: "shipped",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 2,
    stage: "packed",
  },
  {
    buyerId: "buyer-demo",
    sellerId: "seller-home",
    daysAgo: 1,
    stage: "packed",
  },
  {
    buyerId: "buyer-demo",
    sellerId: "seller-gadget",
    daysAgo: 1,
    stage: "paid",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-gadget",
    daysAgo: 0,
    stage: "paid",
  },
  {
    buyerId: "buyer-second",
    sellerId: "seller-style",
    daysAgo: 0,
    stage: "awaiting_payment",
  },
];

function seedOrder(
  data: ShopData,
  script: OrderScript,
  random: Random,
  now: number,
): ShopData {
  const buyer = BUYER_SEEDS.find((item) => item.id === script.buyerId);
  const seller = SELLER_SEEDS.find((item) => item.id === script.sellerId);
  const pool = data.products.filter(
    (product) =>
      product.sellerId === script.sellerId &&
      product.stock >= 10 &&
      product.price < 20000,
  );
  if (!buyer || !seller || pool.length === 0) {
    return data;
  }
  const picks = new Set<Product>();
  const count = random.int(1, 3);
  while (picks.size < Math.min(count, pool.length)) {
    picks.add(random.pick(pool));
  }
  const start = now - script.daysAgo * DAY - random.int(2, 9) * HOUR;
  const at = (hours: number) => shift(start, hours * HOUR);
  const withCart: ShopData = {
    ...data,
    carts: {
      ...data.carts,
      [buyer.id]: [...picks].map((product) => ({
        productId: product.id,
        quantity: random.int(1, 2),
        selected: true,
      })),
    },
  };
  const placed = placeOrders(withCart, {
    buyerId: buyer.id,
    address: buyer.address,
    groups: [
      { sellerId: seller.id, couponCode: script.couponCode ?? null, note: "" },
    ],
    now: at(0),
    random,
  });
  if (!placed.ok) {
    return data;
  }
  let next: ShopData = { ...placed.value.data, carts: data.carts };
  const orderId = placed.value.orderIds[0];
  if (script.stage === "awaiting_payment") {
    return next;
  }
  if (script.stage === "cancelled") {
    const cancelled = cancelOrder(
      next,
      orderId,
      "ผู้ซื้อไม่ได้ชำระเงินภายในเวลาที่กำหนด",
      SELLER_CANCELLABLE,
      at(30),
    );
    return cancelled.ok ? cancelled.value : next;
  }
  next = {
    ...next,
    orders: next.orders.map((order) =>
      order.id === orderId
        ? {
            ...order,
            status: "payment_review",
            events: [
              ...order.events,
              {
                status: "payment_review",
                at: at(0.4),
                note: "ส่งสลิปแล้ว ผ่านการตรวจอัตโนมัติ",
              },
            ],
            payment: {
              slipImage: "",
              submittedAt: at(0.4),
              review: null,
              check: {
                payload: null,
                amountFound: order.total,
                items: [],
                passed: true,
              },
            },
          }
        : order,
    ),
  };
  const steps: ((state: ShopData) => ReturnType<typeof packOrder>)[] = [
    (state) => reviewPayment(state, orderId, "approved", "", at(1)),
  ];
  if (script.stage !== "paid") {
    steps.push((state) => packOrder(state, orderId, at(5)));
  }
  if (script.stage === "shipped" || script.stage === "delivered") {
    const carrier = random.pick(CARRIERS);
    steps.push((state) =>
      shipOrder(state, orderId, {
        carrierId: carrier.id,
        trackingNumber: generateTrackingNumber(carrier, random),
        origin: seller.shop.location,
        now: at(20),
      }),
    );
    steps.push((state) =>
      addTrackingEvent(
        state,
        orderId,
        `ศูนย์คัดแยก ${seller.shop.location}`,
        TRACKING_PRESETS[0],
        at(26),
      ),
    );
    steps.push((state) =>
      addTrackingEvent(
        state,
        orderId,
        `ศูนย์คัดแยก ${buyer.address.province}`,
        TRACKING_PRESETS[2],
        at(44),
      ),
    );
  }
  if (script.stage === "delivered") {
    steps.push((state) =>
      addTrackingEvent(
        state,
        orderId,
        `${buyer.address.district}, ${buyer.address.province}`,
        TRACKING_PRESETS[3],
        at(50),
      ),
    );
    steps.push((state) =>
      markDelivered(state, orderId, "ผู้ซื้อได้รับสินค้าแล้ว", at(54)),
    );
  }
  for (const step of steps) {
    const result = step(next);
    if (result.ok) {
      next = result.value;
    }
  }
  return next;
}

export function buildSeedData(nowIso: string): ShopData {
  const now = new Date(nowIso).getTime();
  const random = createRandom(20261121);
  const created = shift(now, -90 * DAY);
  const products = seedProducts(random, now);
  let data: ShopData = {
    users: seedUsers(created),
    products,
    stockMovements: [],
    coupons: seedCoupons(now),
    orders: [],
    carts: {},
    sessionUserId: null,
  };
  for (const product of products) {
    const entry = CATALOG.find((item) => item.slug === product.id);
    data = applyStockChange(data, {
      productId: product.id,
      quantity: entry?.stock ?? 0,
      reason: "initial",
      note: "ยอดตั้งต้น",
      orderId: null,
      at: product.createdAt,
    });
  }
  for (const script of ORDER_SCRIPTS) {
    data = seedOrder(data, script, random, now);
  }
  const demoBuyer = BUYER_SEEDS[0];
  const featured = data.products
    .filter((product) => product.stock > 20)
    .slice(0, 2);
  return {
    ...data,
    carts: {
      [demoBuyer.id]: featured.map((product) => ({
        productId: product.id,
        quantity: 1,
        selected: true,
      })),
    },
  };
}
