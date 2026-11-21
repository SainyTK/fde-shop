import type { CouponInput, ProductInput, Result, ShopData } from "@/types";
import {
  adjustStock,
  createProduct,
  deleteProduct,
  type StockAdjustment,
  saveCoupon,
  updateProduct,
} from "@/utils";
import { now } from "./clock";
import type { ActionCreator } from "./types";

export type CatalogActions = {
  addToCart: (productId: string, quantity: number) => Result;
  setCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productIds: string[]) => void;
  setCartSelected: (productIds: string[], selected: boolean) => void;
  buyNow: (productId: string, quantity: number) => Result;
  createProduct: (input: ProductInput, initialStock: number) => Result<string>;
  updateProduct: (productId: string, input: ProductInput) => Result;
  deleteProduct: (productId: string) => Result;
  adjustStock: (adjustment: Omit<StockAdjustment, "now">) => Result;
  saveCoupon: (couponId: string | null, input: CouponInput) => Result;
  setCouponActive: (couponId: string, active: boolean) => void;
  deleteCoupon: (couponId: string) => void;
};

function sessionId(data: ShopData): string | null {
  return data.sessionUserId;
}

export const createCatalogActions: ActionCreator<CatalogActions> = (
  set,
  get,
) => {
  const commit = (result: Result<ShopData>): Result => {
    if (!result.ok) {
      return result;
    }
    set({ data: result.value });
    return { ok: true, value: null };
  };

  const putInCart = (
    productId: string,
    quantity: number,
    exclusive: boolean,
  ): Result => {
    const data = get().data;
    const userId = sessionId(data);
    const product = data.products.find((item) => item.id === productId);
    const user = data.users.find((item) => item.id === userId);
    if (!userId || !user) {
      return { ok: false, error: "กรุณาเข้าสู่ระบบก่อน" };
    }
    if (user.role !== "buyer") {
      return { ok: false, error: "กรุณาเข้าสู่ระบบด้วยบัญชีผู้ซื้อเพื่อสั่งซื้อสินค้า" };
    }
    if (product?.sellerId === userId || !product?.active) {
      return { ok: false, error: "ไม่พบสินค้า" };
    }
    if (product.stock <= 0) {
      return { ok: false, error: "สินค้าหมดแล้ว" };
    }
    const lines = data.carts[userId] ?? [];
    const existing = lines.find((line) => line.productId === productId);
    const target = exclusive ? quantity : (existing?.quantity ?? 0) + quantity;
    if (target > product.stock) {
      return {
        ok: false,
        error: `สินค้าเหลือ ${product.stock} ชิ้น (ในตะกร้า ${existing?.quantity ?? 0} ชิ้น)`,
      };
    }
    const others = lines
      .filter((line) => line.productId !== productId)
      .map((line) => (exclusive ? { ...line, selected: false } : line));
    set({
      data: {
        ...data,
        carts: {
          ...data.carts,
          [userId]: [
            { productId, quantity: target, selected: true },
            ...others,
          ],
        },
      },
    });
    return { ok: true, value: null };
  };

  const updateCart = (
    update: (lines: ShopData["carts"][string]) => ShopData["carts"][string],
  ) => {
    const data = get().data;
    const userId = sessionId(data);
    if (!userId) {
      return;
    }
    set({
      data: {
        ...data,
        carts: { ...data.carts, [userId]: update(data.carts[userId] ?? []) },
      },
    });
  };

  return {
    addToCart: (productId, quantity) => putInCart(productId, quantity, false),
    buyNow: (productId, quantity) => putInCart(productId, quantity, true),
    setCartQuantity: (productId, quantity) =>
      updateCart((lines) =>
        lines.map((line) =>
          line.productId === productId ? { ...line, quantity } : line,
        ),
      ),
    removeFromCart: (productIds) =>
      updateCart((lines) =>
        lines.filter((line) => !productIds.includes(line.productId)),
      ),
    setCartSelected: (productIds, selected) =>
      updateCart((lines) =>
        lines.map((line) =>
          productIds.includes(line.productId) ? { ...line, selected } : line,
        ),
      ),
    createProduct: (input, initialStock) => {
      const data = get().data;
      const sellerId = sessionId(data);
      if (!sellerId) {
        return { ok: false, error: "กรุณาเข้าสู่ระบบก่อน" };
      }
      const result = createProduct(data, sellerId, input, initialStock, now());
      if (!result.ok) {
        return result;
      }
      set({ data: result.value.data });
      return { ok: true, value: result.value.productId };
    },
    updateProduct: (productId, input) =>
      commit(updateProduct(get().data, productId, input, now())),
    deleteProduct: (productId) => commit(deleteProduct(get().data, productId)),
    adjustStock: (adjustment) =>
      commit(adjustStock(get().data, { ...adjustment, now: now() })),
    saveCoupon: (couponId, input) => {
      const data = get().data;
      const sellerId = sessionId(data);
      if (!sellerId) {
        return { ok: false, error: "กรุณาเข้าสู่ระบบก่อน" };
      }
      return commit(saveCoupon(data, sellerId, couponId, input, now()));
    },
    setCouponActive: (couponId, active) =>
      set((state) => ({
        data: {
          ...state.data,
          coupons: state.data.coupons.map((coupon) =>
            coupon.id === couponId ? { ...coupon, active } : coupon,
          ),
        },
      })),
    deleteCoupon: (couponId) =>
      set((state) => ({
        data: {
          ...state.data,
          coupons: state.data.coupons.filter(
            (coupon) => coupon.id !== couponId,
          ),
        },
      })),
  };
};
