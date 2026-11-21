import type {
  Address,
  CheckoutGroup,
  Result,
  ShopData,
  SlipCheck,
} from "@/types";
import {
  addTrackingEvent,
  BUYER_CANCELLABLE,
  cancelOrder,
  markDelivered,
  packOrder,
  placeOrders,
  reviewPayment,
  SELLER_CANCELLABLE,
  type ShipInput,
  shipOrder,
  submitPayment,
} from "@/utils";
import { freshRandom, now } from "./clock";
import type { ActionCreator } from "./types";

export type OrderActions = {
  placeOrders: (address: Address, groups: CheckoutGroup[]) => Result<string[]>;
  cancelOrder: (
    orderId: string,
    reason: string,
    by: "buyer" | "seller",
  ) => Result;
  submitPayment: (
    orderId: string,
    slipImage: string,
    check: SlipCheck,
  ) => Result;
  reviewPayment: (
    orderId: string,
    decision: "approved" | "rejected",
    reason: string,
  ) => Result;
  packOrder: (orderId: string) => Result;
  shipOrder: (orderId: string, input: Omit<ShipInput, "now">) => Result;
  addTrackingEvent: (
    orderId: string,
    location: string,
    description: string,
  ) => Result;
  markDelivered: (orderId: string, by: "buyer" | "seller") => Result;
};

export const createOrderActions: ActionCreator<OrderActions> = (set, get) => {
  const commit = (result: Result<ShopData>): Result => {
    if (!result.ok) {
      return result;
    }
    set({ data: result.value });
    return { ok: true, value: null };
  };

  return {
    placeOrders: (address, groups) => {
      const data = get().data;
      if (!data.sessionUserId) {
        return { ok: false, error: "กรุณาเข้าสู่ระบบก่อน" };
      }
      const result = placeOrders(data, {
        buyerId: data.sessionUserId,
        address,
        groups,
        now: now(),
        random: freshRandom(),
      });
      if (!result.ok) {
        return result;
      }
      set({ data: result.value.data });
      return { ok: true, value: result.value.orderIds };
    },
    cancelOrder: (orderId, reason, by) =>
      commit(
        cancelOrder(
          get().data,
          orderId,
          reason,
          by === "buyer" ? BUYER_CANCELLABLE : SELLER_CANCELLABLE,
          now(),
        ),
      ),
    submitPayment: (orderId, slipImage, check) =>
      commit(submitPayment(get().data, orderId, slipImage, check, now())),
    reviewPayment: (orderId, decision, reason) =>
      commit(reviewPayment(get().data, orderId, decision, reason, now())),
    packOrder: (orderId) => commit(packOrder(get().data, orderId, now())),
    shipOrder: (orderId, input) =>
      commit(shipOrder(get().data, orderId, { ...input, now: now() })),
    addTrackingEvent: (orderId, location, description) =>
      commit(
        addTrackingEvent(get().data, orderId, location, description, now()),
      ),
    markDelivered: (orderId, by) =>
      commit(
        markDelivered(
          get().data,
          orderId,
          by === "buyer" ? "ผู้ซื้อยืนยันการรับสินค้า" : "ผู้ขายยืนยันการจัดส่งสำเร็จ",
          now(),
        ),
      ),
  };
};
