import { CARRIERS } from "@/constants";
import type {
  Address,
  CheckoutGroup,
  Order,
  OrderEvent,
  OrderStatus,
  Payment,
  Result,
  ShopData,
  SlipCheck,
} from "@/types";
import { checkCoupon, normalizeCouponCode } from "./coupon";
import { newId } from "./id";
import { shippingFeeFor } from "./pricing";
import type { Random } from "./random";
import { applyStockChange } from "./stock";
import { generateOrderNumber } from "./tracking";

type DataResult = Result<ShopData>;

function fail(error: string): { ok: false; error: string } {
  return { ok: false, error };
}

function updateOrder(
  data: ShopData,
  orderId: string,
  update: (order: Order) => Order,
): ShopData {
  return {
    ...data,
    orders: data.orders.map((order) =>
      order.id === orderId ? update(order) : order,
    ),
  };
}

function withEvent(order: Order, event: OrderEvent): Order {
  return { ...order, status: event.status, events: [...order.events, event] };
}

export type PlaceOrderInput = {
  buyerId: string;
  address: Address;
  groups: CheckoutGroup[];
  now: string;
  random: Random;
};

export function placeOrders(
  data: ShopData,
  input: PlaceOrderInput,
): Result<{ data: ShopData; orderIds: string[] }> {
  const cart = data.carts[input.buyerId] ?? [];
  let next = data;
  const orderIds: string[] = [];
  const orderedProductIds = new Set<string>();
  for (const group of input.groups) {
    const lines = cart.filter((line) => {
      const product = data.products.find((item) => item.id === line.productId);
      return line.selected && product?.sellerId === group.sellerId;
    });
    if (lines.length === 0) {
      continue;
    }
    const items = [];
    for (const line of lines) {
      const product = next.products.find((item) => item.id === line.productId);
      if (!product?.active) {
        return fail("มีสินค้าที่ปิดการขายแล้วในตะกร้า");
      }
      if (product.stock < line.quantity) {
        return fail(
          product.stock <= 0
            ? `${product.name} สินค้าหมดแล้ว`
            : `${product.name} เหลือเพียง ${product.stock} ชิ้น`,
        );
      }
      items.push({
        productId: product.id,
        name: product.name,
        image: product.images[0] ?? "",
        price: product.price,
        quantity: line.quantity,
      });
    }
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    let discount = 0;
    let couponCode: string | null = null;
    if (group.couponCode) {
      const code = normalizeCouponCode(group.couponCode);
      const coupon = next.coupons.find(
        (item) => item.code === code && item.sellerId === group.sellerId,
      );
      if (!coupon) {
        return fail(`ไม่พบโค้ด ${code}`);
      }
      const check = checkCoupon(coupon, {
        buyerId: input.buyerId,
        sellerId: group.sellerId,
        subtotal,
        now: input.now,
      });
      if (!check.ok) {
        return fail(`${code}: ${check.reason}`);
      }
      discount = check.discount;
      couponCode = code;
      next = {
        ...next,
        coupons: next.coupons.map((item) =>
          item.id === coupon.id
            ? { ...item, usedBy: [...item.usedBy, input.buyerId] }
            : item,
        ),
      };
    }
    const shippingFee = shippingFeeFor(subtotal);
    const order: Order = {
      id: newId(),
      number: generateOrderNumber(input.now, input.random),
      buyerId: input.buyerId,
      sellerId: group.sellerId,
      items,
      subtotal,
      discount,
      couponCode,
      shippingFee,
      total: subtotal - discount + shippingFee,
      address: input.address,
      note: group.note,
      status: "awaiting_payment",
      events: [
        { status: "awaiting_payment", at: input.now, note: "สั่งซื้อสำเร็จ" },
      ],
      payment: null,
      rejectedPayments: [],
      shipment: null,
      createdAt: input.now,
    };
    for (const item of items) {
      next = applyStockChange(next, {
        productId: item.productId,
        quantity: -item.quantity,
        reason: "sale",
        note: `คำสั่งซื้อ #${order.number}`,
        orderId: order.id,
        at: input.now,
      });
      next = {
        ...next,
        products: next.products.map((product) =>
          product.id === item.productId
            ? { ...product, sold: product.sold + item.quantity }
            : product,
        ),
      };
      orderedProductIds.add(item.productId);
    }
    next = { ...next, orders: [order, ...next.orders] };
    orderIds.push(order.id);
  }
  if (orderIds.length === 0) {
    return fail("กรุณาเลือกสินค้าที่ต้องการสั่งซื้อ");
  }
  next = {
    ...next,
    carts: {
      ...next.carts,
      [input.buyerId]: cart.filter(
        (line) => !(line.selected && orderedProductIds.has(line.productId)),
      ),
    },
  };
  return { ok: true, value: { data: next, orderIds } };
}

function findOrder(data: ShopData, orderId: string): Order | undefined {
  return data.orders.find((order) => order.id === orderId);
}

function requireStatus(
  order: Order | undefined,
  statuses: OrderStatus[],
): string | null {
  if (!order) {
    return "ไม่พบคำสั่งซื้อ";
  }
  if (!statuses.includes(order.status)) {
    return "สถานะคำสั่งซื้อเปลี่ยนไปแล้ว กรุณารีเฟรช";
  }
  return null;
}

export const BUYER_CANCELLABLE: OrderStatus[] = [
  "awaiting_payment",
  "payment_review",
];

export const SELLER_CANCELLABLE: OrderStatus[] = [
  "awaiting_payment",
  "payment_review",
  "paid",
];

export function cancelOrder(
  data: ShopData,
  orderId: string,
  reason: string,
  allowed: OrderStatus[],
  now: string,
): DataResult {
  const order = findOrder(data, orderId);
  const problem = requireStatus(order, allowed);
  if (problem || !order) {
    return fail(problem ?? "ไม่พบคำสั่งซื้อ");
  }
  let next = updateOrder(data, orderId, (item) =>
    withEvent(item, { status: "cancelled", at: now, note: reason }),
  );
  for (const item of order.items) {
    next = applyStockChange(next, {
      productId: item.productId,
      quantity: item.quantity,
      reason: "cancellation",
      note: `ยกเลิกคำสั่งซื้อ #${order.number}`,
      orderId: order.id,
      at: now,
    });
    next = {
      ...next,
      products: next.products.map((product) =>
        product.id === item.productId
          ? { ...product, sold: Math.max(product.sold - item.quantity, 0) }
          : product,
      ),
    };
  }
  if (order.couponCode) {
    next = {
      ...next,
      coupons: next.coupons.map((coupon) =>
        coupon.code === order.couponCode && coupon.sellerId === order.sellerId
          ? {
              ...coupon,
              usedBy: coupon.usedBy.filter((id) => id !== order.buyerId),
            }
          : coupon,
      ),
    };
  }
  return { ok: true, value: next };
}

export function usedSlipReferences(data: ShopData): string[] {
  return data.orders.flatMap((order) => {
    const ref = order.payment?.check.payload?.transRef;
    return ref ? [ref] : [];
  });
}

export function submitPayment(
  data: ShopData,
  orderId: string,
  slipImage: string,
  check: SlipCheck,
  now: string,
): DataResult {
  const problem = requireStatus(findOrder(data, orderId), ["awaiting_payment"]);
  if (problem) {
    return fail(problem);
  }
  const payment: Payment = {
    slipImage,
    submittedAt: now,
    check,
    review: null,
  };
  return {
    ok: true,
    value: updateOrder(data, orderId, (order) =>
      withEvent(
        { ...order, payment },
        {
          status: "payment_review",
          at: now,
          note: check.passed
            ? "ส่งสลิปแล้ว ผ่านการตรวจอัตโนมัติ"
            : "ส่งสลิปแล้ว รอผู้ขายตรวจสอบ",
        },
      ),
    ),
  };
}

export function reviewPayment(
  data: ShopData,
  orderId: string,
  decision: "approved" | "rejected",
  reason: string,
  now: string,
): DataResult {
  const order = findOrder(data, orderId);
  const problem = requireStatus(order, ["payment_review"]);
  if (problem || !order?.payment) {
    return fail(problem ?? "ไม่พบสลิป");
  }
  const reviewed: Payment = {
    ...order.payment,
    review: { decision, reason, at: now },
  };
  if (decision === "approved") {
    return {
      ok: true,
      value: updateOrder(data, orderId, (item) =>
        withEvent(
          { ...item, payment: reviewed },
          { status: "paid", at: now, note: "ผู้ขายยืนยันการชำระเงิน" },
        ),
      ),
    };
  }
  return {
    ok: true,
    value: updateOrder(data, orderId, (item) =>
      withEvent(
        {
          ...item,
          payment: null,
          rejectedPayments: [...item.rejectedPayments, reviewed],
        },
        {
          status: "awaiting_payment",
          at: now,
          note: `สลิปไม่ผ่านการตรวจสอบ: ${reason}`,
        },
      ),
    ),
  };
}

export function packOrder(
  data: ShopData,
  orderId: string,
  now: string,
): DataResult {
  const problem = requireStatus(findOrder(data, orderId), ["paid"]);
  if (problem) {
    return fail(problem);
  }
  return {
    ok: true,
    value: updateOrder(data, orderId, (order) =>
      withEvent(order, {
        status: "packed",
        at: now,
        note: "ผู้ขายเตรียมพัสดุเรียบร้อย",
      }),
    ),
  };
}

export type ShipInput = {
  carrierId: string;
  trackingNumber: string;
  origin: string;
  now: string;
};

export function shipOrder(
  data: ShopData,
  orderId: string,
  input: ShipInput,
): DataResult {
  const problem = requireStatus(findOrder(data, orderId), ["packed"]);
  if (problem) {
    return fail(problem);
  }
  const carrier = CARRIERS.find((item) => item.id === input.carrierId);
  const trackingNumber = input.trackingNumber.trim().toUpperCase();
  if (!carrier) {
    return fail("กรุณาเลือกบริษัทขนส่ง");
  }
  if (trackingNumber.length < 8) {
    return fail("เลขพัสดุต้องมีอย่างน้อย 8 ตัวอักษร");
  }
  const taken = data.orders.some(
    (order) =>
      order.id !== orderId && order.shipment?.trackingNumber === trackingNumber,
  );
  if (taken) {
    return fail("เลขพัสดุนี้ถูกใช้กับคำสั่งซื้ออื่นแล้ว");
  }
  return {
    ok: true,
    value: updateOrder(data, orderId, (order) =>
      withEvent(
        {
          ...order,
          shipment: {
            carrier: carrier.name,
            trackingNumber,
            shippedAt: input.now,
            events: [
              {
                at: input.now,
                location: input.origin,
                description: `ผู้ส่งนำพัสดุส่งให้ ${carrier.name}`,
              },
            ],
          },
        },
        {
          status: "shipped",
          at: input.now,
          note: `ส่งพัสดุกับ ${carrier.name} เลขพัสดุ ${trackingNumber}`,
        },
      ),
    ),
  };
}

export function addTrackingEvent(
  data: ShopData,
  orderId: string,
  location: string,
  description: string,
  now: string,
): DataResult {
  const order = findOrder(data, orderId);
  const problem = requireStatus(order, ["shipped"]);
  if (problem || !order?.shipment) {
    return fail(problem ?? "ยังไม่มีข้อมูลการจัดส่ง");
  }
  if (!location.trim() || !description.trim()) {
    return fail("กรุณากรอกสถานที่และรายละเอียด");
  }
  const shipment = order.shipment;
  return {
    ok: true,
    value: updateOrder(data, orderId, (item) => ({
      ...item,
      shipment: {
        ...shipment,
        events: [
          ...shipment.events,
          {
            at: now,
            location: location.trim(),
            description: description.trim(),
          },
        ],
      },
    })),
  };
}

export function markDelivered(
  data: ShopData,
  orderId: string,
  note: string,
  now: string,
): DataResult {
  const order = findOrder(data, orderId);
  const problem = requireStatus(order, ["shipped"]);
  if (problem || !order?.shipment) {
    return fail(problem ?? "ยังไม่มีข้อมูลการจัดส่ง");
  }
  const shipment = order.shipment;
  return {
    ok: true,
    value: updateOrder(data, orderId, (item) =>
      withEvent(
        {
          ...item,
          shipment: {
            ...shipment,
            events: [
              ...shipment.events,
              {
                at: now,
                location: `${item.address.district}, ${item.address.province}`,
                description: `จัดส่งสำเร็จ ผู้รับ: ${item.address.recipient}`,
              },
            ],
          },
        },
        { status: "delivered", at: now, note },
      ),
    ),
  };
}

export function statusReachedAt(
  order: Order,
  status: OrderStatus,
): string | null {
  const event = [...order.events]
    .reverse()
    .find((item) => item.status === status);
  return event?.at ?? null;
}
