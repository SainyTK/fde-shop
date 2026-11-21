import type { CartLine } from "./cart";
import type { Coupon } from "./coupon";
import type { Order } from "./order";
import type { Product } from "./product";
import type { StockMovement } from "./stock";
import type { User } from "./user";

export type ShopData = {
  users: User[];
  products: Product[];
  stockMovements: StockMovement[];
  coupons: Coupon[];
  orders: Order[];
  carts: Record<string, CartLine[]>;
  sessionUserId: string | null;
};

export type Result<T = null> =
  | { ok: true; value: T }
  | { ok: false; error: string };
